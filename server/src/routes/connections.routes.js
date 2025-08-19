import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const r = Router();

// request to connect
r.post('/request', requireAuth, async (req, res) => {
  const { project_id, message } = req.body;
  // fetch project and owner
  const { rows: projRows } = await pool.query(`select id, creator_id from projects where id=$1`, [project_id]);
  if (!projRows[0]) return res.status(404).json({ error: 'Project not found' });

  const to_user_id = projRows[0].creator_id;
  if (to_user_id === req.user.id) return res.status(400).json({ error: 'Cannot request own project' });

  try {
    const { rows } = await pool.query(
      `insert into connection_requests (from_user_id, project_id, to_user_id, message)
       values ($1,$2,$3,$4) returning *`,
      [req.user.id, project_id, to_user_id, message]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Already requested' });
    res.status(500).json({ error: 'Server error' });
  }
});

// owner reviews incoming
r.get('/incoming', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `select cr.*, u.name as from_name, p.title as project_title
     from connection_requests cr
     join users u on cr.from_user_id=u.id
     join projects p on cr.project_id=p.id
     where cr.to_user_id=$1 and cr.status='pending' order by cr.created_at desc`,
    [req.user.id]
  );
  res.json(rows);
});

// approve/deny
r.post('/:id/decision', requireAuth, async (req, res) => {
  const { decision } = req.body; // 'approve' or 'deny'
  if (!['approve','deny'].includes(decision)) return res.status(400).json({ error: 'Invalid decision' });

  // ensure request belongs to this owner
  const { rows: reqRows } = await pool.query(`select * from connection_requests where id=$1`, [req.params.id]);
  const cr = reqRows[0];
  if (!cr) return res.status(404).json({ error: 'Not found' });
  if (cr.to_user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (cr.status !== 'pending') return res.status(400).json({ error: 'Already decided' });

  if (decision === 'deny') {
    const { rows } = await pool.query(
      `update connection_requests set status='denied', decision_at=now() where id=$1 returning *`,
      [cr.id]
    );
    return res.json(rows[0]);
  } else {
    await pool.query(`begin`);
    try {
      await pool.query(
        `update connection_requests set status='approved', decision_at=now() where id=$1`,
        [cr.id]
      );
      await pool.query(
        `insert into project_members (project_id,user_id) values ($1,$2) on conflict do nothing`,
        [cr.project_id, cr.from_user_id]
      );
      await pool.query(`commit`);
      res.json({ ...cr, status: 'approved' });
    } catch (e) {
      await pool.query(`rollback`);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// messaging (unlocked after approved)
r.get('/:projectId/messages', requireAuth, async (req, res) => {
  const { projectId } = req.params;
  // must be owner or member
  const { rows: ok } = await pool.query(
    `select 1 from projects where id=$1 and creator_id=$2
     union
     select 1 from project_members where project_id=$1 and user_id=$2`,
    [projectId, req.user.id]
  );
  if (!ok[0]) return res.status(403).json({ error: 'Not a member' });

  const { rows } = await pool.query(
    `select * from messages where project_id=$1 order by created_at asc`,
    [projectId]
  );
  res.json(rows);
});

r.post('/:projectId/messages', requireAuth, async (req, res) => {
  const { projectId } = req.params;
  const { to_user_id, content } = req.body;

  const { rows: ok } = await pool.query(
    `select 1 from projects where id=$1 and creator_id=$2
     union
     select 1 from project_members where project_id=$1 and user_id=$2`,
    [projectId, req.user.id]
  );
  if (!ok[0]) return res.status(403).json({ error: 'Not a member' });

  const { rows } = await pool.query(
    `insert into messages (project_id, from_user_id, to_user_id, content)
     values ($1,$2,$3,$4) returning *`,
    [projectId, req.user.id, to_user_id, content]
  );
  res.status(201).json(rows[0]);
});

export default r;
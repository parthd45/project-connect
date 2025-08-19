import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const r = Router();

// list projects + filters
r.get('/', async (req, res) => {
  const { skill, q, limit = 20, offset = 0 } = req.query;
  const clauses = [];
  const params = [];

  if (skill) { 
    params.push(skill); 
    clauses.push(`$${params.length} = any (skills_needed)`); 
  }
  if (q) { 
    params.push(`%${q}%`); 
    clauses.push(`(title ilike $${params.length} or description ilike $${params.length})`); 
  }

  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';
  const { rows } = await pool.query(
    `select p.*, u.name as creator_name from projects p
     join users u on p.creator_id=u.id
     ${where} order by p.created_at desc limit $${params.length+1} offset $${params.length+2}`,
    [...params, limit, offset]
  );
  res.json(rows);
});

// create project
r.post('/', requireAuth, async (req, res) => {
  const { title, description, skills_needed = [], tags = [] } = req.body;
  const { rows } = await pool.query(
    `insert into projects (title,description,skills_needed,tags,creator_id)
     values ($1,$2,$3,$4,$5) returning *`,
    [title, description, skills_needed, tags, req.user.id]
  );
  res.status(201).json(rows[0]);
});

// get detail
r.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `select p.*, u.name as creator_name, u.id as creator_id
     from projects p join users u on p.creator_id=u.id where p.id=$1`,
    [req.params.id]
  );
  res.json(rows[0]);
});

// update/delete (owner only)
r.put('/:id', requireAuth, async (req, res) => {
  const { title, description, skills_needed, tags } = req.body;
  const { rows } = await pool.query(
    `update projects set title=$1, description=$2, skills_needed=$3, tags=$4
     where id=$5 and creator_id=$6 returning *`,
    [title, description, skills_needed, tags, req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(403).json({ error: 'Not owner' });
  res.json(rows[0]);
});

r.delete('/:id', requireAuth, async (req, res) => {
  const { rowCount } = await pool.query(
    `delete from projects where id=$1 and creator_id=$2`,
    [req.params.id, req.user.id]
  );
  if (!rowCount) return res.status(403).json({ error: 'Not owner' });
  res.status(204).end();
});

export default r;
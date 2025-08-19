import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const r = Router();

// current user profile
r.get('/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query(`select * from users where id=$1`, [req.user.id]);
  res.json(rows[0]);
});

// update profile
r.put('/me', requireAuth, async (req, res) => {
  const { name, bio, skills = [], interests = [], github_username } = req.body;
  const { rows } = await pool.query(
    `update users set name=$1, bio=$2, skills=$3, interests=$4, github_username=$5
     where id=$6 returning *`,
    [name, bio, skills, interests, github_username, req.user.id]
  );
  res.json(rows[0]);
});

// find partner: search users
r.get('/', async (req, res) => {
  const { skill, q, limit = 20, offset = 0 } = req.query;
  const clauses = [];
  const params = [];

  if (skill) { 
    params.push(skill); 
    clauses.push(`$${params.length} = any (skills)`); 
  }
  if (q) { 
    params.push(`%${q}%`); 
    clauses.push(`(name ilike $${params.length} or bio ilike $${params.length})`); 
  }

  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';
  const { rows } = await pool.query(
    `select id,name,avatar_url,bio,skills,github_username from users ${where}
     order by created_at desc limit $${params.length+1} offset $${params.length+2}`,
    [...params, limit, offset]
  );
  res.json(rows);
});

export default r;
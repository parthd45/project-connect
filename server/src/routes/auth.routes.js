import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { signToken } from '../auth.js';

const r = Router();

// signup
r.post('/signup', async (req, res) => {
  const { name, email, password, skills = [], interests = [] } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      `insert into users (name,email,password_hash,skills,interests)
       values ($1,$2,$3,$4,$5) returning id,name`,
      [name, email, hash, skills, interests]
    );
    const token = signToken(rows[0]);
    res.json({ token, user: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// login
r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query(`select * from users where email=$1`, [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user);
  res.json({ token, user: { id: user.id, name: user.name } });
});

// TODO: GitHub OAuth endpoints (optional)

export default r;
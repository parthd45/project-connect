import { Router } from 'express';

const r = Router();

r.get('/repos/:username', async (req, res) => {
  const { username } = req.params;
  const headers = {};
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers });
    if (!response.ok) return res.status(response.status).json({ error: 'GitHub API error' });

    const data = await response.json();
    const minimal = data.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      url: r.html_url,
      language: r.language,
      updated_at: r.updated_at
    }));
    res.json(minimal);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default r;
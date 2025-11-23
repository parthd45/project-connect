import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import connectionsRoutes from './routes/connections.routes.js';
import githubRoutes from './routes/github.routes.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://projectconnect-frontend.azurewebsites.net',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/github', githubRoutes);

// Health check endpoint for Azure
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server on ${port}`));
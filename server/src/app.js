import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import connectionsRoutes from './routes/connections.routes.js';
import githubRoutes from './routes/github.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/github', githubRoutes);

// serve client build
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuild = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server on ${port}`));
# Project Connect

A platform for developers to find collaborators for their projects.

## Features

- User authentication with JWT
- Create and browse projects
- Search for project partners
- Connect with other developers
- Messaging system
- GitHub integration

## Environment Variables

- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Random long string for JWT tokens
- GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET (optional): For OAuth
- GITHUB_TOKEN (optional): To increase GitHub API rate limits
- NODE_ENV: development or production
- PORT: Server port (defaults to 8080)

## Installation and Setup

### Server
```bash
cd server && npm i && npm run dev
```

### Client  
```bash
cd client && npm i && npm run dev
```

### Monorepo (both at once)
```bash
npm i && npm run dev
```

## Database Setup

Run the SQL files in the server/sql/ directory in order:
1. 01_users.sql
2. 02_projects.sql  
3. 03_connections.sql
4. 04_messages.sql

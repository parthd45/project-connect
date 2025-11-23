require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://projectconnect-frontend.azurewebsites.net',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'ProjectConnect Backend is running!'
  });
});

// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'ProjectConnect API Server', version: '1.0.0' });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`ProjectConnect Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
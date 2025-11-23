#!/bin/bash

# Install dependencies
npm install

# Build client
npm run build --prefix client

# Start server
npm start
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const usersRouter = require('./routes/users');
const petsRouter = require('./routes/pets');
const tasksRouter = require('./routes/tasks');
const shopRouter = require('./routes/shop');
const achievementsRouter = require('./routes/achievements');
const { errorHandler } = require('./middleware');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/shop', shopRouter);
app.use('/api/achievements', achievementsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   - Users: http://localhost:${PORT}/api/users`);
  console.log(`   - Pets: http://localhost:${PORT}/api/pets`);
  console.log(`   - Tasks: http://localhost:${PORT}/api/tasks`);
  console.log(`   - Shop: http://localhost:${PORT}/api/shop`);
  console.log(`   - Achievements: http://localhost:${PORT}/api/achievements`);
});

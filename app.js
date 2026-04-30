const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./app/config/database');
const postRoutes = require('./app/routes/api/posts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', postRoutes);

// Serve React frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', message: 'Node Blog API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Database sync and server start
const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    console.log('Syncing database models...');
    await sequelize.sync({ alter: false, force: false });
    console.log('Database synced.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

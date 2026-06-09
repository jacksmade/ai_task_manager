const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ Connection failed:', err.message);
  });
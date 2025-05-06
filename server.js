const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Prediction = require('./models/Prediction');
const Expert = require('./models/Expert');

const app = express();

// CORS Configuration - More permissive for debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/development';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AGI Timeline Tracker API' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: {
        status: dbState === 1 ? 'connected' : 'disconnected',
        state: dbState
      }
    };
    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get timeline data
app.get('/timeline', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate('expertId', 'name organization title')
      .sort({ predictionDate: -1 });
    
    const timelineData = predictions.map(prediction => ({
      expert: prediction.expertName,
      organization: prediction.organizationAtTime,
      estimatedDate: prediction.estimatedDate,
      source: prediction.source,
      sourceUrl: prediction.sourceUrl,
      predictionDate: prediction.predictionDate,
      definition: prediction.definition,
      definitionSummary: prediction.definitionSummary
    }));

    res.json(timelineData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching timeline data',
      details: error.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000; // Railway will provide the PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




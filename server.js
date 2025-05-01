const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://agi-timeline-tracker.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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

// Get all predictions
app.get('/predictions', async (req, res) => {
  try {
    // For now, return sample data until we set up the database schema
    const samplePredictions = [
      {
        expert: "Geoffrey Hinton",
        organization: "Google",
        predictionDate: "2023-05-01",
        estimatedDate: "2070-2075",
        definition: "AGI will be able to do any intellectual task that a human can do",
        source: "Interview with The Guardian"
      },
      {
        expert: "Yann LeCun",
        organization: "Meta AI",
        predictionDate: "2022-12-15",
        estimatedDate: "2050-2060",
        definition: "Human-level artificial general intelligence",
        source: "Twitter/X Post"
      }
    ];
    res.json(samplePredictions);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching predictions',
      details: error.message 
    });
  }
});

// Get timeline data
app.get('/timeline', async (req, res) => {
  try {
    // For now, return sample timeline data
    const timelineData = [
      {
        expert: "Geoffrey Hinton",
        year: 2070,
        confidence: "high"
      },
      {
        expert: "Yann LeCun",
        year: 2075,
        confidence: "medium"
      }
    ];
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




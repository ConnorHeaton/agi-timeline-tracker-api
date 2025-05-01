const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Make name the unique identifier
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  currentOrganization: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expert', ExpertSchema);
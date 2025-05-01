const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  expertName: {
    type: String,
    required: true,
    trim: true
  },
  estimatedDate: {
    type: String,
    required: true,
    trim: true
  },
  estimatedYearLow: {
    type: Number
  },
  estimatedYearHigh: {
    type: Number
  },
  estimatedYearMean: {
    type: Number
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  sourceUrl: {
    type: String,
    required: true,
    trim: true
  },
  predictionDate: {
    type: Date,
    required: true
  },
  definition: {
    type: String,
    required: true,
    trim: true
  },
  definitionSummary: {
    type: String,
    trim: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  confidence: {
    type: String,
    enum: ['high', 'medium', 'low', 'unknown'],
    default: 'unknown'
  },
  organizationAtTime: {
    type: String,
    trim: true
  },
  titleAtTime: {
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

// Parse estimated date into year values for querying and graphing
PredictionSchema.pre('save', function(next) {
  try {
    // Handle different date formats like "2030", "2030-2040", "by 2035"
    const dateStr = this.estimatedDate.toLowerCase();
    
    // Extract years using regex
    const years = dateStr.match(/\d{4}/g);
    
    if (years && years.length > 0) {
      this.estimatedYearLow = parseInt(years[0]);
      
      if (years.length > 1) {
        this.estimatedYearHigh = parseInt(years[1]);
        // Calculate mean for visualization
        this.estimatedYearMean = Math.round((this.estimatedYearLow + this.estimatedYearHigh) / 2);
      } else {
        this.estimatedYearHigh = this.estimatedYearLow;
        this.estimatedYearMean = this.estimatedYearLow;
      }
    }
    
    // Generate summary of definition if not provided
    if (!this.definitionSummary && this.definition) {
      // Create a summary of max ~60 chars
      this.definitionSummary = this.definition.length > 60 
        ? this.definition.substring(0, 60) + '...' 
        : this.definition;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
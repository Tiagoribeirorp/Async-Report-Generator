// worker/src/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'user-123'
  },
  type: {
    type: String,
    required: true,
    enum: ['sales', 'users', 'products', 'financial']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  parameters: {
    type: Object,
    default: {}
  },
  fileUrl: {
    type: String
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Report', reportSchema);
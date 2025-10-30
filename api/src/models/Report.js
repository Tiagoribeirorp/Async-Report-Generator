// api/src/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'user-123' // Temporário para testes
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

// Índice para melhor performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);
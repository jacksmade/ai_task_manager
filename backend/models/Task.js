const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Urgent', 'Important', 'Can Wait'],
    default: null
  },
  effortLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: null
  },
  priorityRank: {
    type: Number,
    default: null
  },
  aiReason: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
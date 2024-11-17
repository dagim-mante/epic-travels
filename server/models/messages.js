const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => crypto.randomUUID(), // Automatically generates a UUID
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system'], // Optional: restrict role values
    default: 'user',
  },
  content: {
    type: String,
    required: true,
  },
});

// Main schema to hold the array of messages
const dataSchema = new mongoose.Schema({
  messages: {
    type: [messageSchema],
    default: [],
  },
});

const Chat = mongoose.model('Data', dataSchema);
module.exports = Chat
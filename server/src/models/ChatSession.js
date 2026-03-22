const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, maxlength: 4000 },
    sentimentScore: { type: Number, default: 0 },
    moodLabel: { type: String, default: 'Neutral' },
    crisisFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const chatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Session' },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatSession', chatSessionSchema);

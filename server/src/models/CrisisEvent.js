const mongoose = require('mongoose');

const crisisEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' },
    content: { type: String, required: true },
    sentimentScore: { type: Number, required: true },
    keywords: { type: [String], default: [] },
    escalated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CrisisEvent', crisisEventSchema);

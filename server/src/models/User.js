const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    moodHistory: { type: [moodEntrySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

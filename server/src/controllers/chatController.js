const ChatSession = require('../models/ChatSession');
const CrisisEvent = require('../models/CrisisEvent');
const User = require('../models/User');
const { analyzeMood } = require('../services/sentimentService');
const { detectCrisis, HELPLINE_MESSAGE } = require('../services/crisisService');
const { sendCrisisAlertEmail } = require('../services/alertService');
const { generateAssistantReply } = require('../services/aiService');
const appError = require('../utils/appError');

async function getOrCreateSession(userId, sessionId) {
  if (sessionId) {
    const existing = await ChatSession.findOne({ _id: sessionId, userId });
    if (existing) return existing;
  }

  return ChatSession.create({ userId, title: 'New Session' });
}

async function postMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body;
    if (!message || typeof message !== 'string') {
      throw appError('message is required', 400);
    }

    const session = await getOrCreateSession(req.user.id, sessionId);
    const mood = analyzeMood(message);
    const crisis = detectCrisis(message, mood.score);

    session.messages.push({
      role: 'user',
      content: message,
      sentimentScore: mood.score,
      moodLabel: mood.label,
      crisisFlag: crisis.flagged,
    });

    const historyForModel = session.messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let assistantReply = await generateAssistantReply({
      userMessage: message,
      history: historyForModel,
      moodLabel: mood.label,
    });

    if (crisis.flagged) {
      assistantReply = `${assistantReply}\n\n${HELPLINE_MESSAGE}`;

      const event = await CrisisEvent.create({
        userId: req.user.id,
        chatSessionId: session._id,
        content: message,
        sentimentScore: mood.score,
        keywords: crisis.matchedKeywords,
      });

      const user = await User.findById(req.user.id);
      const escalated = await sendCrisisAlertEmail({
        userEmail: user?.email || 'unknown',
        content: message,
        sentimentScore: mood.score,
        keywords: crisis.matchedKeywords,
      });

      if (escalated) {
        event.escalated = true;
        await event.save();
      }
    }

    session.messages.push({
      role: 'assistant',
      content: assistantReply,
      sentimentScore: 0,
      moodLabel: mood.label,
      crisisFlag: crisis.flagged,
    });

    if (session.messages.length === 2) {
      session.title = message.slice(0, 40);
    }

    await session.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { moodHistory: { score: mood.score, label: mood.label } },
    });

    res.status(201).json({
      sessionId: session._id,
      assistantReply,
      mood,
      crisis: {
        flagged: crisis.flagged,
        helplineMessage: crisis.helplineMessage,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    res.json({ sessions });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postMessage,
  getHistory,
};

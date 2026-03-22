
let OpenAI = null;
let openaiClient = null;
let Gemini = null;
try {
  OpenAI = require('openai');
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      ...(process.env.OPENAI_BASE_URL ? { baseURL: process.env.OPENAI_BASE_URL } : {}),
    });
  }
} catch (e) {
  OpenAI = null;
  openaiClient = null;
}
try {
  Gemini = require('@google/generative-ai');
} catch (e) {
  Gemini = null;
}

function buildSystemPrompt(moodLabel) {
  const toneMap = {
    Distressed: 'Use extra gentle, short, validating language and grounding suggestions.',
    Anxious: 'Use calm, reassuring language and practical coping ideas.',
    Neutral: 'Use supportive and clear language.',
    Calm: 'Use engaging, positive, and reflective language.',
  };

  return [
    'You are a compassionate mental health support assistant, not a doctor.',
    'Do not provide diagnosis. Encourage professional help for severe symptoms.',
    'If user appears in crisis, prioritize immediate safety and share helplines.',
    toneMap[moodLabel] || toneMap.Neutral,
  ].join(' ');
}


async function generateAssistantReply({ userMessage, history = [], moodLabel = 'Neutral', provider = 'openai' }) {
  if (provider === 'gemini') {
    if (!Gemini) throw new Error('Gemini SDK not installed');
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
    const genAI = new Gemini.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });
    // Gemini expects a single prompt string, so concatenate history
    const prompt = [
      buildSystemPrompt(moodLabel),
      ...history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`),
      `User: ${userMessage}`
    ].join('\n');
    const result = await model.generateContent(prompt);
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.text;
    return text || 'I am here with you. Tell me what feels hardest right now.';
  } else {
    if (!openaiClient) throw new Error('OPENAI_API_KEY not set and OpenAI not available');
    const response = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt(moodLabel) },
        ...history.slice(-10),
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    return response.choices?.[0]?.message?.content || 'I am here with you. Tell me what feels hardest right now.';
  }
}

module.exports = {
  generateAssistantReply,
};

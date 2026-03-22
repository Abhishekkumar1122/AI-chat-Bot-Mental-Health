const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  ...(process.env.OPENAI_BASE_URL ? { baseURL: process.env.OPENAI_BASE_URL } : {}),
});

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

async function generateAssistantReply({ userMessage, history = [], moodLabel = 'Neutral' }) {
  const response = await client.chat.completions.create({
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

module.exports = {
  generateAssistantReply,
};

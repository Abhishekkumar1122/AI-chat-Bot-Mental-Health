const Sentiment = require('sentiment');

const sentiment = new Sentiment();

function moodLabelFromScore(score) {
  if (score <= -6) return 'Distressed';
  if (score <= -2) return 'Anxious';
  if (score < 2) return 'Neutral';
  return 'Calm';
}

function analyzeMood(text) {
  const result = sentiment.analyze(text || '');
  const score = result.score || 0;
  return {
    score,
    label: moodLabelFromScore(score),
  };
}

module.exports = {
  analyzeMood,
  moodLabelFromScore,
};

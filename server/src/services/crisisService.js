const CRISIS_KEYWORDS = [
  'suicide',
  'self harm',
  'kill myself',
  'end my life',
  'i want to die',
  'hopeless',
  'cannot go on',
  'hurt myself',
  'no reason to live',
];

const HELPLINE_MESSAGE =
  'You are not alone. If you may be in immediate danger, contact local emergency services now. India support: iCall +91 9152987821, Vandrevala 1860-2662-345.';

function detectCrisis(content, sentimentScore) {
  const text = (content || '').toLowerCase();
  const matchedKeywords = CRISIS_KEYWORDS.filter((keyword) => text.includes(keyword));
  const flagged = matchedKeywords.length > 0 || sentimentScore <= -6;

  return {
    flagged,
    matchedKeywords,
    helplineMessage: flagged ? HELPLINE_MESSAGE : null,
  };
}

module.exports = {
  detectCrisis,
  HELPLINE_MESSAGE,
};

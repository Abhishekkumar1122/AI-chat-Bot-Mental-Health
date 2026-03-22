function MoodIndicator({ mood }) {
  const map = {
    Distressed: 'High support mode',
    Anxious: 'Gentle tone',
    Neutral: 'Balanced tone',
    Calm: 'Engaging tone',
  };

  const label = mood?.label || 'Neutral';
  const score = Number.isFinite(mood?.score) ? mood.score : 0;

  return (
    <div className="mood-chip">
      <span className="mood-pill">{label}</span>
      <span className="mood-note">{map[label] || map.Neutral}</span>
      <span className="mood-score">score {score}</span>
    </div>
  );
}

export default MoodIndicator;

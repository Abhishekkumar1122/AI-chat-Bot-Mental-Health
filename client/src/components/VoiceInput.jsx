import { useEffect, useMemo, useState } from 'react';

function VoiceInput({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const r = new SpeechRecognition();
    r.lang = 'en-IN';
    r.interimResults = false;
    return r;
  }, []);

  useEffect(() => {
    if (!recognition) {
      setSupported(false);
      return;
    }

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      if (text) onTranscript(text);
    };

    recognition.onend = () => setRecording(false);
  }, [recognition, onTranscript]);

  function toggleRecording() {
    if (!recognition) return;
    if (recording) {
      recognition.stop();
    } else {
      recognition.start();
      setRecording(true);
    }
  }

  if (!supported) {
    return <span className="small">Voice input not supported in this browser.</span>;
  }

  return (
    <button
      type="button"
      className={`icon-btn ${recording ? 'recording' : ''}`}
      onClick={toggleRecording}
      title={recording ? 'Stop voice input' : 'Start voice input'}
      aria-label={recording ? 'Stop voice input' : 'Start voice input'}
    >
      <svg className="voice-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.08A7 7 0 0 1 5 12a1 1 0 0 1 2 0 5 5 0 0 0 10 0z" />
      </svg>
    </button>
  );
}

export default VoiceInput;

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../features/chat/chatSlice';
import VoiceInput from './VoiceInput';

function ChatWindow() {
  const dispatch = useDispatch();
  const { messages, loading, sessionId } = useSelector((state) => state.chat);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  function submit(e) {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    dispatch(sendMessage({ message, sessionId }));
    setText('');
  }

  function usePrompt(prompt) {
    setText(prompt);
  }

  return (
    <>
      <div className="message-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="empty-state">
            <p className="empty-title">Start your first check-in</p>
            <p className="small">Pick a prompt or type your own thoughts.</p>
            <div className="quick-prompts">
              <button type="button" className="prompt-chip" onClick={() => usePrompt('I feel anxious about work today.')}>Work anxiety</button>
              <button type="button" className="prompt-chip" onClick={() => usePrompt('I feel low and unmotivated since morning.')}>Low mood</button>
              <button type="button" className="prompt-chip" onClick={() => usePrompt('Help me calm down, I am overthinking.')}>Overthinking</button>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={`${msg.role}-${idx}`} className={`msg-row ${msg.role === 'assistant' ? 'left' : 'right'}`}>
            <div className={`msg ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
              <div className="msg-label">{msg.role === 'assistant' ? 'Support Assistant' : 'You'}</div>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-row left">
            <div className="msg bot typing">Typing...</div>
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <VoiceInput onTranscript={setText} />
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what is on your mind"
        />
        <button className="btn" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </>
  );
}

export default ChatWindow;

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import MoodIndicator from '../components/MoodIndicator';
import CrisisBanner from '../components/CrisisBanner';
import ChatWindow from '../components/ChatWindow';

function ChatPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mood, crisis } = useSelector((state) => state.chat);

  return (
    <div className="chat-shell">
      <div className="chat-card">
        <div className="chat-head">
          <div className="chat-head-copy">
            <p className="eyebrow">Compassion-first support</p>
            <strong className="chat-title">Mental Health AI Assistant</strong>
            <div className="small">Hello {user?.name || 'there'}, this is your safe check-in space.</div>
          </div>
          <div className="chat-head-actions">
            <MoodIndicator mood={mood} />
            <button className="logout-btn" onClick={() => dispatch(logout())}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 4a1 1 0 0 1 0 2H6v12h4a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5z" />
                <path d="M13.3 7.3a1 1 0 0 1 1.4 0l4.99 5a1 1 0 0 1 0 1.4l-4.99 5a1 1 0 0 1-1.4-1.4L16.59 14H9a1 1 0 1 1 0-2h7.59l-3.3-3.3a1 1 0 0 1 0-1.4z" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <CrisisBanner crisis={crisis} />
        <ChatWindow />
      </div>
    </div>
  );
}

export default ChatPage;

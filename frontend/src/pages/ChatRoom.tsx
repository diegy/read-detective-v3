import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'me' | 'other';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'other',
    content: '你好！我也很喜欢《百年孤独》这本书。',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    sender: 'me',
    content: '真的吗？你最喜欢书里的哪个角色？',
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: '3',
    sender: 'other',
    content: '乌尔苏拉，她是整个家族里最有韧性的女性。',
    timestamp: new Date(Date.now() - 2400000),
  },
];

export default function ChatRoom() {
  const navigate = useNavigate();
  useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        content: '说得太对了！我也这么觉得。😊',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)'
      }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <div className="share-avatar" style={{ width: '36px', height: '36px' }}></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>读者 #07</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>阅读DNA相似度 87%</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.sender === 'me' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                background: message.sender === 'me' ? 'var(--accent)' : 'var(--bg-card)',
                color: message.sender === 'me' ? 'white' : 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: '16px',
                borderBottomRightRadius: message.sender === 'me' ? '4px' : '16px',
                borderBottomLeftRadius: message.sender === 'other' ? '4px' : '16px',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {message.content}
            </div>
            <span style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)',
              marginTop: '4px',
              marginLeft: message.sender === 'me' ? '0' : '4px',
              marginRight: message.sender === 'me' ? '4px' : '0',
            }}>
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ 
        padding: '12px 20px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '8px 16px',
          border: '1px solid var(--border)'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              background: input.trim() ? 'var(--accent)' : 'var(--bg-secondary)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

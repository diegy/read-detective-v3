import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '你好！我是你的 AI 阅读助手。我可以帮你：\n\n📚 推荐适合你的书籍\n💭 解读复杂的文学概念\n📝 生成书评或阅读笔记\n🎯 制定个性化阅读计划\n\n今天想聊点什么？',
    timestamp: new Date(),
  },
];

const sampleResponses = [
  '这是一个很有趣的问题！从文学角度来看，这部作品确实探讨了深刻的主题...',
  '基于你的阅读DNA，我推荐你看看《追风筝的人》，它同样具有沉重的情感基调。',
  '我来为你生成一段书评：这本书像一把钥匙，打开了我们对人性的深层思考...',
  '根据你最近阅读的书籍，我发现你对现实主义题材很感兴趣。要不要试试《活着》？',
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        <div>
          <div style={{ fontWeight: 600 }}>AI 阅读助手</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>在线</div>
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
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: message.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
              color: message.role === 'user' ? 'white' : 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: '12px',
              borderBottomRightRadius: message.role === 'user' ? '4px' : '12px',
              borderBottomLeftRadius: message.role === 'assistant' ? '4px' : '12px',
              fontSize: '14px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ 
            alignSelf: 'flex-start',
            background: 'var(--bg-card)',
            padding: '12px 16px',
            borderRadius: '12px',
            borderBottomLeftRadius: '4px',
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            <span style={{ animation: 'pulse 1s infinite' }}>思考中...</span>
          </div>
        )}
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
            placeholder="输入你的问题..."
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
            disabled={!input.trim() || isLoading}
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

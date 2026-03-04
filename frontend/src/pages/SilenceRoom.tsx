import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SilenceRoom() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          navigate('/match');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">沉默时刻</div>
        <div className="badge">Step 2/3</div>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
        <div className="card-title">强制沉默 · 禁止交谈</div>
        <div className="card-subtitle">
          在这3分钟里，你只能做一件事：读你带来的书，或者观察这个房间里的人
        </div>
      </div>
      
      <div className="timer">
        <div className="timer-display">{formatTime(timeLeft)}</div>
        <div className="timer-label">剩余时间</div>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <span style={{ fontWeight: 500 }}>观察提示</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
          注意那些和你选了同一本书的人<br />
          观察他们的阅读习惯<br />
          记住让你印象深刻的细节
        </div>
      </div>
      
      <button className="btn" onClick={() => navigate('/match')}>
        时间到，进入匹配
      </button>
    </div>
  );
}

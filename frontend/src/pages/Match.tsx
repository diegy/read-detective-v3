import { useNavigate } from 'react-router-dom';

export default function Match() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">灵魂匹配</div>
        <div className="badge">Step 3/3</div>
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '100%' }}></div>
      </div>
      
      <div className="card">
        <div className="card-title">基于你的阅读DNA，我们找到了</div>
        
        <div className="match-result">
          <div className="match-avatar">👤</div>
          <div className="match-name">读者 #07</div>
          <div className="match-similarity">阅读DNA相似度 87%</div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
          <span className="book-tag">科幻未来</span>
          <span className="book-tag">沉重深刻</span>
          <span className="book-tag">存在主义</span>
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">共同阅读痕迹</div>
        <div className="card-subtitle">你们都在第37页折了角</div>
        
        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
          <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。"
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            —— 《百年孤独》第37页
          </div>
        </div>
      </div>
      
      <button className="btn" onClick={() => navigate('/home')}>
        确认连接
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/home')} 
        style={{ marginTop: '12px' }}
      >
        继续寻找
      </button>
    </div>
  );
}

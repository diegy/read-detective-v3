import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-title">书页间</div>
      <div className="landing-subtitle">
        以实体书为媒介的轻社交场<br />
        让社恐体面出场，让深度连接发生在意料之外
      </div>
      
      <div className="landing-features">
        <div className="landing-feature">
          <div className="landing-feature-icon">📚</div>
          <div className="landing-feature-text">带书入场</div>
        </div>
        <div className="landing-feature">
          <div className="landing-feature-icon">🎭</div>
          <div className="landing-feature-text">隐藏身份</div>
        </div>
        <div className="landing-feature">
          <div className="landing-feature-icon">✨</div>
          <div className="landing-feature-text">灵魂匹配</div>
        </div>
      </div>
      
      <button 
        className="btn" 
        onClick={() => navigate('/onboarding')}
        style={{ maxWidth: '280px' }}
      >
        开始体验
      </button>
      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
        无需注册，扫码即进入幽灵侦探模式
      </p>
    </div>
  );
}

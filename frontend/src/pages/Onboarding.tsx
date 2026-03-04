import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const worldViewTags = [
  { label: '科幻未来', desc: '相信技术改变一切' },
  { label: '现实主义', desc: '关注当下的真实' },
  { label: '历史长河', desc: '从过去寻找答案' },
  { label: '奇幻魔法', desc: '相信想象的力量' },
];

const emotionTags = [
  { label: '沉重深刻', desc: '喜欢有重量的文字' },
  { label: '轻松治愈', desc: '需要温暖的慰藉' },
  { label: '温暖疗愈', desc: '寻找内心的平静' },
  { label: '黑暗致郁', desc: '在阴影中思考' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (label: string) => {
    setSelectedTags(prev => 
      prev.includes(label) 
        ? prev.filter(t => t !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">书页间</div>
        <div className="badge">Step 1/3</div>
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '33%' }}></div>
      </div>
      
      <div className="card">
        <div className="card-title">选择你的阅读DNA</div>
        <div className="card-subtitle">这将帮助我们为你匹配灵魂书友</div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            世界观偏好
          </div>
          <div className="tag-grid">
            {worldViewTags.map(tag => (
              <div 
                key={tag.label}
                className={`tag ${selectedTags.includes(tag.label) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.label)}
              >
                <div className="tag-label">{tag.label}</div>
                <div className="tag-desc">{tag.desc}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            情感基调
          </div>
          <div className="tag-grid">
            {emotionTags.map(tag => (
              <div 
                key={tag.label}
                className={`tag ${selectedTags.includes(tag.label) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.label)}
              >
                <div className="tag-label">{tag.label}</div>
                <div className="tag-desc">{tag.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button className="btn" onClick={() => navigate('/silence')}>
        进入沉默时刻
      </button>
    </div>
  );
}

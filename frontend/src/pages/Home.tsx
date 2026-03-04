import { useNavigate } from 'react-router-dom';

const books = [
  {
    id: 1,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    tags: ['魔幻现实', '孤独'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: '1984',
    author: '乔治·奥威尔',
    tags: ['反乌托邦', '政治'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    title: '三体',
    author: '刘慈欣',
    tags: ['科幻', '宇宙'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-container with-nav">
        <div className="header">
          <div className="logo">书页间</div>
          <div className="badge">已连接</div>
        </div>
        
        <div className="share-card">
          <div className="share-header">
            <div className="share-avatar"></div>
            <div className="share-meta">
              <div className="share-name">你的阅读DNA报告</div>
              <div className="share-time">本周生成</div>
            </div>
          </div>
          <div className="share-content">
            本周潜逃记录：霍格沃茨4小时，马孔多3次转机，1984年滞留过夜。我有充分的不在场证明。
          </div>
          <div className="share-stats">
            <span>📖 5本书</span>
            <span>💬 3次对话</span>
            <span>✨ 1次匹配</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-title">推荐阅读</div>
          
          {books.map(book => (
            <div key={book.id} className="book-card">
              <div 
                className="book-cover" 
                style={{ background: book.gradient }}
              ></div>
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                <div className="book-tags">
                  {book.tags.map(tag => (
                    <span key={tag} className="book-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">AI 阅读助手</div>
          <div className="card-subtitle">获取个性化阅读建议和深度解读</div>
          <button 
            className="btn" 
            style={{ marginTop: '12px' }}
            onClick={() => navigate('/ai-assistant')}
          >
            开始对话
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <div className="nav-item active" onClick={() => navigate('/home')}>
          <div className="nav-icon">📚</div>
          <div>发现</div>
        </div>
        <div className="nav-item" onClick={() => navigate('/chat/general')}>
          <div className="nav-icon">💬</div>
          <div>对话</div>
        </div>
        <div className="nav-item" onClick={() => navigate('/')}>
          <div className="nav-icon">👤</div>
          <div>我的</div>
        </div>
      </div>
    </>
  );
}

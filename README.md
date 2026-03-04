# Read Detective V3 - 书页间

基于 AI 的阅读社交平台 - 从纯前端到全栈的重构

## 🚀 项目概述

从 read-detective-v2 的纯前端 HTML 升级为完整的全栈 AI 驱动应用。

### 技术栈

- **Frontend**: React 18 + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Redis
- **AI**: OpenAI API (Embeddings + GPT-4)
- **Real-time**: Socket.io
- **Deploy**: Docker Compose

## 📁 项目结构

```
read-detective-v3/
├── frontend/           # React 前端
├── backend/            # Node.js 后端
├── shared/             # 共享类型定义
├── database/           # 数据库迁移
├── docker/             # Docker 配置
└── .github/            # CI/CD 工作流
```

## 🎯 核心功能

### 1. AI 智能匹配
- 使用 OpenAI Embeddings 将阅读偏好转为向量
- 基于余弦相似度计算匹配度
- 实时匹配队列

### 2. AI 读书助手
- 对话式书评生成
- 书籍智能摘要
- 个性化阅读建议

### 3. 实时社交
- WebSocket 实时聊天
- 沉默时刻房间
- 在线状态同步

### 4. 阅读DNA
- 个性化阅读画像
- 阅读偏好分析
- 阅读轨迹可视化

## 🛠️ 快速开始

### 使用 Docker Compose

```bash
# 克隆项目
git clone https://github.com/diegy/read-detective-v3.git
cd read-detective-v3

# 启动所有服务
docker-compose up -d

# 访问应用
open http://localhost:3000
```

### 本地开发

```bash
# 安装依赖
npm run install:all

# 启动开发服务器
npm run dev
```

## 📚 API 文档

详见 [API Documentation](./docs/API.md)

## 🎨 设计文档

详见 [Design Documentation](./docs/DESIGN.md)

## 📝 更新日志

### v3.0.0 (2026-03-04)
- 🎉 从 v2 纯前端重构为全栈应用
- 🤖 集成 OpenAI 实现智能匹配和 AI 助手
- 💬 添加实时聊天功能
- 🔐 添加用户认证系统
- 🐳 添加 Docker 部署支持

## 📄 许可证

MIT License

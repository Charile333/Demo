# LUMI 预测市场

<div align="center">

![LUMI Logo](public/image/LUMI1.png)

**下一代加密市场工具 - 专注链上黑天鹅风险信号、不确定性量化测量与预测市场平台**

[English](#english) | [中文](#中文)

</div>

---

## 中文

### 📖 项目简介

LUMI 预测市场是一个集成了 DuoLume 和 Market 两个项目的综合性预测市场平台。项目采用 Next.js + TypeScript 构建，提供实时市场数据、动态背景效果和多分类市场预测功能。

### ✨ 核心功能

- 🎯 **实时警报系统** - 监控加密货币市场的黑天鹅事件
- 📊 **预测市场** - 涵盖7大赛道：
  - 汽车与新能源
  - 手机与智能硬件  
  - 科技发布与AI创新
  - 娱乐与文化
  - 体育与电竞
  - 经济与社会趋势
  - 新兴赛道
- 🌟 **动态背景** - 炫酷的三角形动画背景效果
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 🔗 **API集成** - 可选的 Flask 后端支持实时数据

### 🚀 快速开始

#### 前端启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# 主页: http://localhost:3000
# 预测市场: http://localhost:3000/LUMI
```

#### 后端启动（可选）

```bash
# 进入后端目录
cd ../duolume-master/crypto_alert_api

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 启动 Flask 服务器
python src/main.py
```

### 📁 项目结构

```
market/
├── app/                    # Next.js 应用目录
│   ├── page.tsx           # DuoLume 主页
│   ├── LUMI/              # 预测市场主页
│   ├── event/[eventId]/   # 市场详情页
│   ├── automotive/        # 汽车赛道
│   ├── tech-ai/           # AI科技赛道
│   └── ...                # 其他分类页面
├── components/            # React 组件
│   ├── Navbar.tsx        # 导航栏
│   └── DynamicBackground.tsx  # 动态背景
├── lib/                   # 数据模块
│   ├── marketData.ts     # 汽车数据
│   ├── techAiData.ts     # AI数据
│   └── ...               # 其他数据
├── public/               # 静态资源
│   ├── image/           # 图片
│   └── dynamic-bg.css   # 背景样式
└── package.json         # 项目配置
```

### 🎨 特色功能

#### 1. 动态背景
- 200个三角形的流畅动画
- 自适应的径向渐变效果
- 优化的性能表现

#### 2. 智能导航
- 分类高亮显示
- 面包屑导航
- 智能返回功能

#### 3. ID分配方案
- 汽车与新能源: 1-100
- 手机与智能硬件: 101-200
- 科技发布与AI创新: 201-300
- 娱乐与文化: 301-400
- 体育与电竞: 401-500
- 经济与社会趋势: 501-600
- 新兴赛道: 601-700

### 🛠️ 技术栈

- **前端框架**: Next.js 14 + React
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: FontAwesome
- **图表**: Chart.js
- **后端** (可选): Flask + Python

### 📝 配置说明

#### 修改 API 端点

编辑 `app/api/alerts/route.ts` 和 `app/api/prices/route.ts`：

```typescript
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000'
```

#### 自定义样式

编辑 `app/globals.css` 修改全局样式和动态背景效果。

### 🔧 常见问题

**Q: 为什么看不到实时警报数据？**  
A: 实时警报需要启动 Flask 后端服务。如果不启动后端，前端会优雅降级，不显示警报数据但不影响其他功能。

**Q: 动态背景不显示？**  
A: 确保 `/public/dynamic-bg.css` 文件存在，并且浏览器支持 CSS 动画。

**Q: 详情页导航栏高亮错误？**  
A: 这个问题已修复，每个分类使用唯一的ID范围。

### 📄 文档

- [集成说明](INTEGRATION_README.md)
- [ID修复总结](ID_FIX_SUMMARY.md)
- [间距修复](SPACING_FIX.md)
- [后端可选说明](BACKEND_OPTIONAL.md)

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📧 联系方式

- GitHub: [Charile333](https://github.com/Charile333)
- 项目地址: [https://github.com/Charile333/Demo](https://github.com/Charile333/Demo)

---

## English

### 📖 Introduction

LUMI Prediction Market is a comprehensive prediction market platform that integrates DuoLume and Market projects. Built with Next.js + TypeScript, it provides real-time market data, dynamic background effects, and multi-category market prediction features.

### ✨ Key Features

- 🎯 **Real-time Alert System** - Monitor black swan events in crypto markets
- 📊 **Prediction Markets** - Covering 7 major tracks:
  - Automotive & New Energy
  - Mobile & Smart Devices
  - Tech Releases & AI Innovation
  - Entertainment & Culture
  - Sports & Gaming
  - Economy & Social Trends
  - Emerging Tracks
- 🌟 **Dynamic Background** - Cool triangle animation effects
- 📱 **Responsive Design** - Perfect support for mobile and desktop
- 🔗 **API Integration** - Optional Flask backend for real-time data

### 🚀 Quick Start

#### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
# Home: http://localhost:3000
# Prediction Market: http://localhost:3000/LUMI
```

#### Backend (Optional)

```bash
# Navigate to backend directory
cd ../duolume-master/crypto_alert_api

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Start Flask server
python src/main.py
```

### 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: FontAwesome
- **Charts**: Chart.js
- **Backend** (Optional): Flask + Python

### 📝 License

MIT License

### 🤝 Contributing

Issues and Pull Requests are welcome!

---

<div align="center">

Made with ❤️ by the LUMI Team

[⬆ Back to Top](#lumi-预测市场)

</div>

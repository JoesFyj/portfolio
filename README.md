# 小福老师 · 个人作品集

> 甘肃深山 → 西安城 → AI 探索者
> 职业自由、不靠时间赚钱、每天阅读锻炼就能有收入的追梦人

🌐 **线上地址**：https://portfolio-zhifuxia.vercel.app

---

## 👋 我是谁

我叫小福老师，三十岁。

从甘肃深山放牛娃，靠读书走到西安城，拿下硕士学位。

现在正在做一件事：**用 AI 把自己变成一家公司**。

我的梦想很简单：
- 一家小书店 + 一个朴素的健身房
- 每天阅读、锻炼、接娃做饭陪家人
- 不用靠时间换钱，靠能力和价值

---

## 🚀 技术栈

| 技术 | 用途 |
|------|------|
| React 19 + Vite | 前端框架 |
| Tailwind CSS | 样式系统 |
| Lucide React | 图标库 |
| Vercel | 托管部署 |

---

## 📁 项目结构

```
portfolio/
├── src/
│   ├── components/          # 页面组件
│   │   ├── Hero.jsx         # 首页 Hero（含打字机效果）
│   │   ├── Nav.jsx           # 导航栏
│   │   ├── HomeAbout.jsx    # 关于我
│   │   ├── HomeTimeline.jsx # 成长轨迹（时间轴）
│   │   ├── HomeValues.jsx   # 价值观
│   │   ├── HomeConnect.jsx  # 联系方式
│   │   ├── Footer.jsx       # 页脚
│   │   └── AdminDashboard.jsx # 后台管理（配置站点）
│   ├── lib/
│   │   ├── defaultConfig.js # 默认配置数据
│   │   └── siteConfig.js    # 配置读取逻辑
│   ├── pages/
│   │   ├── Home.jsx         # 首页
│   │   └── Hub.jsx          # 作品中心
│   └── App.jsx              # 主入口
└── public/
    └── assets               # 静态资源
```

---

## ⚙️ 配置说明

所有模块内容均在 `src/lib/defaultConfig.js` 中配置，修改后部署即生效。

**联系信息** 在 `defaultConfig.js` → `homeConnect` 中修改（微信、公众号、即刻、推特、抖音）。

---

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev      # http://localhost:5173

# 生产构建
npm run build

# 预览构建
npm run preview
```

---

## 📝 写作风格

- **真实** — 不堆砌、不煽情，敢承认困惑和失败
- **朴素** — 口语感、短句为主、第一称"我"
- **有血有肉** — 细节来自真实经历，不是写作模板

---

## 📬 找到我

- 微信公众号：**生活的小虾**
- 微信号：**小福老师**
- GitHub：https://github.com/JoesFyj

---

*Last updated: 2026-04-09*

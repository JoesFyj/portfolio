# 朴俊浩 · 个人作品集

> 个人网站 + 自媒体创作自动化中心

## 运行

```bash
npm run dev      # 开发模式 http://localhost:5173
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

## 项目结构

```
src/
├── components/
│   ├── SelfMedia.jsx    ← 自媒体创作中心（新增）
│   ├── Nav.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Portfolio.jsx
│   └── Courses.jsx
└── data/
    └── content.js       ← 文章/作品数据
```

## 内容创作中心（SelfMedia）

自媒体自动化发布链路的管理面板，位于导航栏「创作中心」。

### 功能

- **发布流程管道**：选题→写作→封面→公众号→小红书→音频，可视化显示每步完成状态
- **文章列表**：显示每篇文章的发布进度、状态、阅读量
- **一键发布**：执行全链路自动化（需 OpenClaw 后台运行）
- **AI新闻音频**：抓取当日AI要闻，生成播报音频
- **数据统计**：文章总数、已发布、草稿、总阅读量

### 自动化链路

```
用户触发 → OpenClaw skill → 读取文章
       → 格式化（公众号/小红书不同版本）
       → 生成封面图
       → 推公众号草稿箱
       → 推小红书草稿箱
       → 录入飞书多维表
       → 生成TTS音频
```

### 与 OpenClaw 的集成

创作中心依赖 OpenClaw 后台执行实际发布操作：

- **公众号发布**：调用 `youmind-wechat-article` skill
- **小红书发布**：browser tool 模拟 Web 操作
- **封面图生成**：调用 `canvas-design` skill
- **TTS音频**：调用 `voice` skill（Edge TTS）
- **多维表录入**：调用 `feishu_bitable` tool
- **定时提醒**：cron job 每天 10:00 触发

需要保持 OpenClaw（QClaw）后台运行，自动化链路才能完整执行。

### 相关技能

| 技能 | 路径 |
|------|------|
| multi-platform-publishing | `~/.openclaw/workspace/skills/multi-platform-publishing/` |
| voice (TTS) | `~/.openclaw/workspace/skills/voice/` |
| canvas-design | 需安装 |

## 技术栈

- React 19 + Vite 8
- Tailwind CSS 3（温润米色调设计系统）
- lucide-react 图标库
- recharts（待安装，用于数据图表）

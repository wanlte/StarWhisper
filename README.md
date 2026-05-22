# 星语小馆 StarWhisper

微信趣味星座小程序 · 纯娱乐性质 | UniApp + Vue3 + Vite | Node.js + Express

## 快速开始

### 启动后端
```bash
cd server
npm install
npm run dev
```
后端启动在 http://localhost:3001

### 启动前端 (H5 开发模式)
```bash
cd client
npm install
npm run dev:h5
```
前端启动在 http://localhost:8080

### 编译为微信小程序
```bash
cd client
npm run build:mp-weixin
```
产物在 `dist/build/mp-weixin/`，用微信开发者工具打开即可预览。

## 项目结构

```
StarWhisper/
├── server/                 # Express 后端
│   ├── data/               # JSON 数据文件
│   ├── controllers/        # 控制器
│   ├── routes/             # 路由
│   ├── utils/              # 工具函数
│   └── index.js            # 入口
├── client/                 # UniApp 前端
│   └── src/
│       ├── pages/          # 页面
│       ├── components/     # 公共组件
│       ├── api/            # API 请求层
│       ├── utils/          # 工具函数
│       └── styles/         # 全局样式
└── task_plan.md            # 开发计划
```

## 核心功能

- **星座详情** — 12星座性格解读、运势提示、趣味知识
- **星座配对** — 双星座合拍分析、匹配度评分
- **角色匹配** — 趣味问卷 + 星座 → 匹配12个猎奇虚构角色
- **个人中心** — 生日识星座、浏览记录、免责声明

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | UniApp, Vue 3, Vite, Pinia, SCSS |
| 后端 | Node.js, Express, CORS |
| 存储 | 本地 JSON 文件 |
| 目标平台 | 微信小程序 / H5 |

## 微信审核注意事项

- 所有内容标注「仅供娱乐」
- 底部固定免责声明
- 不涉及算命、吉凶、祸福、改运等违规内容
- 角色匹配结果为虚构角色，纯娱乐性质

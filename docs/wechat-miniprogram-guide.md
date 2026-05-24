# 星语小馆 — 微信小程序完整上线流程

## 目录

1. [项目现状速览](#1-项目现状速览)
2. [本地编译](#2-本地编译)
3. [配置微信小程序 AppID](#3-配置微信小程序-appid)
4. [配置后端服务器地址](#4-配置后端服务器地址)
5. [在微信开发者工具中预览](#5-在微信开发者工具中预览)
6. [后端部署](#6-后端部署)
7. [微信公众平台配置](#7-微信公众平台配置)
8. [提交审核](#8-提交审核)
9. [正式图标替换](#9-正式图标替换)

---

## 1. 项目现状速览

```
StarWhisper/
├── server/          ← Node.js + Express 后端（提供 API 接口）
├── client/          ← UniApp + Vue3 前端（将编译为微信小程序）
│   └── dist/build/mp-weixin/  ← 编译产物（给微信开发者工具用的）
└── README.md
```

**技术栈**：UniApp + Vue3 + Vite 前端，Node.js + Express 后端，本地 JSON 文件存储。

**当前状态**：
- 前端：5 个页面（首页/星座详情/星座配对/角色匹配/个人中心），可编译为微信小程序
- 后端：7 个 API 接口，本地 JSON 数据
- 编译验证：已通过 `npm run build:mp-weixin`，产物生成在 `client/dist/build/mp-weixin/`

---

## 2. 本地编译

将 Vue 代码编译成微信小程序可运行的格式：

```bash
# 进入前端目录
cd client

# 安装依赖（首次需要，已安装可跳过）
npm install

# 编译为微信小程序
npm run build:mp-weixin
```

编译成功后，产物在 `client/dist/build/mp-weixin/`，目录结构如下：

```
dist/build/mp-weixin/
├── app.js            ← 小程序入口
├── app.json          ← 小程序配置
├── app.wxss          ← 全局样式
├── pages/            ← 5 个页面
├── components/       ← 组件
├── api/              ← 接口请求层
├── static/           ← 图标等静态资源
└── project.config.json
```

> 以后每次改了前端代码，都要重新跑一遍 `npm run build:mp-weixin`。

---

## 3. 配置微信小程序 AppID

### 3.1 获取 AppID

1. 打开 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册一个小程序账号（个人或企业）
3. 进入「开发」→「开发管理」→「开发设置」
4. 复制你的 **AppID（小程序 ID）**

### 3.2 创建本地配置文件

`manifest.json` 已被加入 `.gitignore`，不会上传到 GitHub（保护你的 AppID）。

首先从模板创建本地配置：

```bash
cd client/src
cp manifest.example.json manifest.json
```

### 3.3 填入 AppID

打开刚创建的 `client/src/manifest.json`，找到这一段：

```json
"mp-weixin": {
    "appid": "touristappid",
```

把 `touristappid` 替换为你的正式 AppID：

```json
"mp-weixin": {
    "appid": "your_appid",
```

> `touristappid` 是游客模式，仅限开发调试。正式预览和发布必须用真实 AppID。
>
> **你的真实 AppID 不会被提交到 GitHub**，因为 `manifest.json` 已在 `.gitignore` 中。

修改后**重新编译**：

```bash
cd client
npm run build:mp-weixin
```

---

## 4. 配置后端服务器地址

小程序发起网络请求时，必须使用完整的服务器地址（不能像 H5 开发那样用相对路径 `/api`）。

打开 `client/src/api/request.js`，找到这一段：

```js
// #ifdef MP-WEIXIN
const BASE_URL = 'https://your-server.com';
// #endif
```

把 `https://your-server.com` 替换为你的服务器地址（**不要带 /api 后缀**），例如：

```js
// #ifdef MP-WEIXIN
const BASE_URL = 'https://starwhisper.example.com';
// #endif
```

修改后**重新编译**。

---

## 5. 在微信开发者工具中预览

### 5.1 下载安装微信开发者工具

- 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 选择对应系统版本（Windows/Mac）安装

### 5.2 打开项目

1. 启动微信开发者工具
2. 扫码登录
3. 点击「导入项目」或点击 `+` 创建项目
4. 填写：
   - **项目名称**：星语小馆
   - **目录**：选择 `client/dist/build/mp-weixin/` （注意是 `dist/build/mp-weixin`，不是 `client`）
   - **AppID**：填入你的 AppID 或选择「游客模式」
5. 点击「确定」

### 5.3 开发调试

- 工具左侧是模拟器，可以看到小程序的实际效果
- 如果后端还没部署，清忽略网络请求错误
- 可以右键点击模拟器 → 打开调试器查看 console 日志

### 5.4 真机预览

1. 点击工具栏的「预览」按钮
2. 生成二维码
3. 用微信扫码，在手机上查看效果

> 真机预览仍会走网络请求，需要后端已部署并能被手机访问到。

---

## 6. 后端部署

当前后端是本地 JSON 文件存储，部署到服务器后即可提供在线 API。

### 6.1 服务器要求

- Node.js 18+
- 一个外网可访问的域名 + HTTPS（微信小程序强制要求 HTTPS）

### 6.2 部署步骤

```bash
# 1. 把 server/ 目录上传到服务器

# 2. 安装依赖
cd server
npm install

# 3. 启动后端
npm run dev    # 开发模式（nodemon 热重启）
# 或
npm start      # 生产模式
```

后端默认监听 **3001** 端口。

### 6.3 HTTPS 配置

微信小程序要求请求域名必须 HTTPS。推荐两种方案：

**方案 A：Nginx 反向代理（推荐）**

```nginx
server {
    listen 443 ssl;
    server_name starwhisper.example.com;

    ssl_certificate     /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
    }
}
```

**方案 B：使用 Vercel / Railway 等平台托管**，平台自动提供 HTTPS。

### 6.4 验证后端是否可用

在浏览器访问：`https://你的域名/api/health`

应该返回：
```json
{ "code": 0, "message": "ok", "data": { "status": "running" } }
```

---

## 7. 微信公众平台配置

登录 [微信公众平台](https://mp.weixin.qq.com/)，进入「开发」→「开发管理」→「开发设置」。

### 7.1 服务器域名配置

在「服务器域名」一栏，填入：

| 类型 | 域名 |
|------|------|
| request 合法域名 | `https://你的域名` |

> 微信限制只能填 HTTPS 域名，不支持 IP 地址和 localhost。

### 7.2 其他配置

如果后端有上传/下载文件功能，还需配置 `uploadFile` 和 `downloadFile` 合法域名。当前项目不涉及，可先跳过。

---

## 8. 提交审核

### 8.1 审核前 Checklist

- [ ] 后端已部署并可外网访问（HTTPS）
- [ ] 服务器域名已配置到微信后台
- [ ] `manifest.json` 中 appid 已设置为正式 AppID
- [ ] `request.js` 中 BASE_URL 已指向正式服务器地址
- [ ] 已重新编译（`npm run build:mp-weixin`）
- [ ] 所有页面底部都有「仅供娱乐」免责声明
- [ ] 内容不涉及算命、吉凶、祸福、改运等
- [ ] 在微信开发者工具中可以正常浏览所有页面

### 8.2 上传代码

1. 在微信开发者工具中点击右上角「上传」
2. 填写版本号和备注，如 `v1.0.0 - 初始版本`
3. 点击「上传」

### 8.3 提交审核

1. 回到微信公众平台网页 →「管理」→「版本管理」
2. 在「开发版本」中可以看到刚上传的版本
3. 点击「提交审核」
4. 填写审核信息：
   - **功能页面**：逐项描述 5 个页面的功能
   - **测试账号**：如果有登录功能需提供（当前项目不需要）
5. 提交后等待审核（通常 1-7 个工作日）

### 8.4 审核通过后

1. 审核通过后，你会在微信收到通知
2. 回到公众平台 →「版本管理」
3. 点击「发布」，小程序就正式上线了

---

## 9. 正式图标替换

当前 TabBar 图标是 8×8 彩色占位方块，正式发布前需要替换。

### 图标清单

| 文件 | 用途 |
|------|------|
| `client/src/static/icons/tab-zodiac.png` | 星座 tab — 未选中 |
| `client/src/static/icons/tab-zodiac-active.png` | 星座 tab — 选中 |
| `client/src/static/icons/tab-character.png` | 角色匹配 tab — 未选中 |
| `client/src/static/icons/tab-character-active.png` | 角色匹配 tab — 选中 |
| `client/src/static/icons/tab-my.png` | 我的 tab — 未选中 |
| `client/src/static/icons/tab-my-active.png` | 我的 tab — 选中 |

### 规格要求

- 尺寸：推荐 **81 × 81** 像素（最小 40 × 40）
- 格式：PNG
- 大小：每个文件 < 40KB
- 设计：未选中态用灰色 `#999999`，选中态用金色 `#D4A574`

替换图标后，重新编译即可生效。

---

## 附录：常用命令速查

```bash
# ===== 后端 =====
cd server
npm install          # 安装后端依赖
npm run dev          # 启动后端（开发模式，自动重启）
npm start            # 启动后端（生产模式）

# ===== 前端 =====
cd client
npm install          # 安装前端依赖
npm run dev:h5       # H5 开发模式（浏览器预览）
npm run build:mp-weixin  # 编译为微信小程序

# ===== 编译产物 =====
# 产物位置：client/dist/build/mp-weixin/
# 用微信开发者工具打开此目录即可预览
```

---

## 附录：文件对照表

| 需要改的 | 文件路径 | 什么时候改 |
|----------|---------|-----------|
| AppID | `client/src/manifest.json` | 注册小程序后 |
| 服务器地址 | `client/src/api/request.js` | 后端部署后 |
| TabBar 图标 | `client/src/static/icons/tab-*.png` | 发布前 |

> 每次修改上述文件后，都需要重新执行 `npm run build:mp-weixin`。

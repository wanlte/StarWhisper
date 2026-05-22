# Task Plan — 星语小馆 StarWhisper

微信趣味星座小程序（前后端分离） · UniApp + Vue3 + Vite / Node.js + Express

> 核心准则：仅做性格趣味解析、日常心情参考。严禁算命、吉凶、祸福、改运类违规内容。

---

## 一、项目整体介绍

### 1.1 项目定位
星语小馆（StarWhisper）是一款**纯娱乐性质的微信小程序**，围绕12星座提供：
- 性格趣味解读
- 日常心情小建议
- **角色匹配 — 通过趣味问卷 + 星座，匹配虚构角色，给出性格共鸣分析**
- 星座配对合拍分析
- 生日自动识星座

定位关键词：**有趣、温暖、科学感、角色共鸣、视觉猎奇、无迷信**。

### 1.2 核心功能

| 模块 | 功能 | 说明 |
|------|------|------|
| 🏠 首页 | 12星座网格选择 | 星空主题网格，3大入口（详情/配对/角色匹配） |
| 📋 星座详情 | 性格解读 + 日常建议 + 趣味提示 | 综合展示星座信息 |
| 💑 星座配对 | 双星座合拍分析 | 选择两个星座，输出匹配度与趣味分析 |
| 🎭 **角色匹配** | **问卷 + 星座 → 匹配虚构角色** | **核心亮点功能，见下方详细设计** |
| 👤 个人中心 | 生日识星座 + 浏览记录 + 免责声明 | 用户工具与合规入口 |

### 1.3 角色匹配模块 — 详细设计

**流程：**
```
选择星座 → 回答6道趣味问卷 → 提交 → 后端匹配算法 → 返回匹配角色 + 共鸣分析
```

**角色体系设计（12个猎奇角色）：**

| # | 角色名称 | 猎奇概念 | 匹配星座 | 一句话震住用户 |
|---|----------|----------|----------|----------------|
| 1 | 🫠 **无面说书人** | 脸是一张不断翻页的羊皮纸，五官被文字取代，每眨一次眼就换一个故事 | 双子/天秤/水瓶 | "你的故事，写在我脸上" |
| 2 | 🕳️ **逆时症患者** | 全身皮肤呈半透明，能看到内脏在倒放——血液倒流、心脏先舒张再收缩 | 摩羯/处女/金牛 | "我昨天已经见过了明天的你" |
| 3 | 📺 **颅骨电视机** | 脑袋是一台 CRT 老电视，雪花屏中偶尔闪过别人的记忆片段，脖子后面有天线 | 水瓶/双鱼/天蝎 | "嘘…我刚刚收到了你的梦境信号" |
| 4 | 🫧 **肥皂泡内脏人** | 胸腔和腹腔是透明的泡泡，心肝肺漂浮其中，情绪激动时会"啵"地破裂再重组 | 巨蟹/双鱼/金牛 | "别靠太近，我怕你会戳破我的小心脏" |
| 5 | 👁️ **千眼档案员** | 全身长满眨动的眼睛，每一只都记录了别人的一个秘密，眼睑翻开是标签编号 | 处女/摩羯/天蝎 | "第9473号秘密：你昨晚睡前刷了2小时手机" |
| 6 | 🧵 **解线人偶** | 关节由彩色丝线缝合，每做一次选择就断一根线，线尽之时会变成一堆布料和棉花 | 天秤/双子/射手 | "今天的选择……啊，又断了一根" |
| 7 | 🖐️ **反向生长者** | 右手永远在变小变嫩，左手永远在变老变皱。左手握着的东西会加速腐朽，右手碰过的会回到最新状态 | 射手/白羊/狮子 | "用左手告别，用右手重逢" |
| 8 | 🔇 **回声收集者** | 嘴里吐出的不是声音是发光气泡，泡里包裹着别人说过但被遗忘的话。靠听别人的沉默活着 | 天蝎/摩羯/巨蟹 | "你三年前说的那句再见……还在这里" |
| 9 | 🦴 **镜中人** | 身体是液态水银，只在镜面中才有实体。和镜子里的自己不是同一个人，经常对着镜子吵架 | 双鱼/天秤/水瓶 | "镜子里那位今天心情不太好" |
| 10 | 🎭 **情绪变色龙** | 皮肤随情绪瞬间变花纹——愤怒是岩浆裂纹、快乐是蝴蝶斑点、悲伤是雨天水渍 | 狮子/白羊/巨蟹 | "别装了，你的颜色骗不了我" |
| 11 | 🌒 **半蚀者** | 身体从中线对半劈开——左半身永远在白昼，右半身永远在黑夜。左眼日出、右眼星空 | 金牛/处女/射手 | "我左半边在早安，右半边在晚安" |
| 12 | 🕸️ **记忆蚊** | 本体是一只半人高的蚊子，用长吻刺入太阳穴吸食不愉快的记忆，消化后排出金色微光。最怕电蚊拍 | 巨蟹/天蝎/双鱼 | "那个让你尴尬的瞬间……吸溜，味道不错" |

**问卷设计（6道题）：**

| 题号 | 问题 | 选项（对应不同角色属性） |
|------|------|--------------------------|
| Q1 | 周末你最想怎么过？ | A.户外冒险 B.安静阅读 C.朋友聚会 D.在家休息 |
| Q2 | 遇到困难你通常会？ | A.直接冲 B.冷静分析 C.找朋友商量 D.等待时机 |
| Q3 | 你更喜欢哪种颜色？ | A.热烈的红 B.深邃的蓝 C.温暖的黄 D.沉稳的绿 |
| Q4 | 哪种描述最像你？ | A.行动派 B.思考者 C.社交达人 D.倾听者 |
| Q5 | 你最看重什么？ | A.自由 B.成就 C.关系 D.安全 |
| Q6 | 你理想中的一天？ | A.充满刺激 B.收获新知 C.被人需要 D.平静舒适 |

**匹配逻辑：**
```
总匹配度 = 星座基础分(40%) + 问卷答案加权分(60%)
         → 取最高分角色
         → 返回角色信息 + 共鸣分析文案 + 个性建议
```

### 1.4 猎奇视觉设计 — 角色图片方案

**设计理念：** 每个角色拥有一张"猎奇"风格的插画，既吸引眼球又有辨识度。不走传统可爱/二次元路线，而是**暗黑童话 + 星空神秘 + 超现实拼贴**的混合风格。

**图片规格：**

| 类型 | 尺寸 | 格式 | 用途 |
|------|------|------|------|
| 角色头像 | 400×400rpx | PNG (透明底) | 角色卡片正面 |
| 角色全图 | 600×800rpx | PNG/JPG | 结果页大图展示 |
| 星座背景 | 750×1624rpx | JPG (压缩) | 详情页背景 |
| 首页星空 | 750×1624rpx | JPG | 首页背景 |
| 配对背景 | 750×400rpx | PNG | 配对结果背景 |

**12角色猎奇视觉方向：**

| 角色 | 视觉核心 | AI Prompt 关键词 |
|------|----------|-------------------|
| 🫠 无面说书人 | 羊皮纸脸皮翻卷、文字从毛孔渗出、墨迹头发 | faceless scribe, parchment skin peeling into pages, text crawling out of pores, ink-bleeding hair, surreal dark fantasy |
| 🕳️ 逆时症患者 | 半透明皮肤、可见逆向流动的内脏、反向衰老皱纹 | reverse-time patient, translucent skin showing organs moving backwards, veins flowing in reverse, chrono-dysmorphia body horror lite |
| 📺 颅骨电视机 | CRT电视头、雪花屏脸、天线脊椎、胸腔里磁带转 | TV-head humanoid, CRT skull with static screen face, antenna spine protruding from neck, VHS ribs, analog horror aesthetic |
| 🫧 肥皂泡内脏人 | 透明泡泡胸腔、漂浮心肝肺、肥皂泡彩虹折射 | bubble organ human, transparent soap-bubble chest cavity, floating heart and lungs inside, iridescent membrane, delicate and fragile body |
| 👁️ 千眼档案员 | 全身覆盖眨动的眼睛、眼睑有编号标牌、手指末端也是眼球 | thousand-eye archivist, body covered in blinking eyes, numbered tags on eyelids, eyeball-tipped fingers, bureaucratic body horror |
| 🧵 解线人偶 | 关节处彩色丝线缝合、断线飘散、布料和棉花外露 | unraveling marionette, joints stitched with colored threads, loose threads floating around, cotton stuffing spilling from seams, fabric skin patches |
| 🖐️ 反向生长者 | 右手婴儿般嫩滑、左手枯皱如树皮、不对称撕裂感 | asymmetric aging being, right hand baby-smooth and tiny, left hand ancient and wrinkled bark-like, temporal dissonance, split-body surrealism |
| 🔇 回声收集者 | 嘴中吐出光泡包裹的文字、泡中可见模糊人脸的残影 | echo collector, luminous bubbles emerging from mouth containing forgotten words, faint faces trapped in bubbles, silent surreal creature |
| 🦴 镜中人 | 液态水银身体、只有镜面反射才可见、分裂的两个自我 | mirror-bound entity, liquid mercury body only visible in reflections, arguing with own reflection that moves independently, chrome surrealism |
| 🎭 情绪变色龙 | 皮肤实时变幻花纹——岩浆裂纹/蝴蝶斑点/雨天水渍 | emotion chameleon, skin shifting patterns in real-time, lava-crack angry mode, butterfly-speckled happy mode, rain-streak sad mode, living mood ring |
| 🌒 半蚀者 | 身体中线精准分割、左半昼右半夜、日出左眼星空右眼 | half-eclipse being, body split perfectly down middle, left side permanent daylight with sunrise eye, right side eternal night with starfield eye, cosmic dichotomy |
| 🕸️ 记忆蚊 | 半人高巨蚊、长吻刺入太阳穴、消化后排出金色微光粉尘 | memory mosquito, human-sized mosquito creature, proboscis entering temples to extract memories, glowing golden dust excrement, unsettling but oddly helpful, dark whimsical |

### 1.5 技术架构图

**图片来源方案：**
- 方案A：AI 生成（Midjourney/DALL-E）→ 按上述 prompt 生成统一风格
- 方案B：设计工具（Figma/PS）自制拼贴合成
- 方案C：开源插画素材 + 滤镜加工

**前端展示效果：**
- 角色卡片支持 **3D 翻转**（正面头像 → 背面属性详情）
- 匹配结果页加入 **粒子特效 + 渐显动画**
- 首页星座网格 hover/点击有 **星光扩散** 微动效

### 1.5 技术架构图

```
┌─────────────────────────────────────────────────┐
│                  微信小程序客户端                  │
│         UniApp + Vue3 + Vite (前端)              │
│                                                  │
│  pages/  components/  api/  utils/  styles/     │
└──────────────────┬──────────────────────────────┘
                   │  HTTP (uni.request)
                   ▼
┌─────────────────────────────────────────────────┐
│           Node.js + Express (后端 API)           │
│                                                  │
│  routes/  controllers/  data/  middleware/      │
│                                                  │
│  本地 JSON 文件存储                               │
│  (zodiac / match / daily-tips / characters / quiz)│
└─────────────────────────────────────────────────┘
```

---

## 二、开发阶段总览

| Phase | 内容 | 子任务数 | 状态 |
|-------|------|----------|------|
| **Phase 1** | 后端 — 项目初始化 & 数据层 | 8 | ⬜ |
| **Phase 2** | 后端 — 接口开发 & 测试 | 8 | ⬜ |
| **Phase 3** | 前端 — 项目初始化 & 基础设施 | 8 | ⬜ |
| **Phase 4** | 前端 — 页面开发 | 8 | ⬜ |
| **Phase 5** | 前后端联调 & 编译交付 | 6 | ⬜ |

---

## Phase 1: 后端 — 项目初始化 & 数据层

| # | Task | Status |
|---|------|--------|
| 1.1 | 初始化 Express 项目 (package.json + 依赖) | ⬜ |
| 1.2 | 创建后端目录结构 | ⬜ |
| 1.3 | 编写 12 星座完整 JSON 数据文件 | ⬜ |
| 1.4 | 编写星座配对 JSON 数据文件 | ⬜ |
| 1.5 | 编写每日建议 JSON 数据文件 | ⬜ |
| 1.6 | **编写 12 个虚构角色 JSON 数据文件** | ⬜ |
| 1.7 | **编写问卷题目 + 选项权重 JSON 数据文件** | ⬜ |
| 1.8 | 统一响应格式工具函数 + JSON 读取工具 | ⬜ |

## Phase 2: 后端 — 接口开发 & 测试

| # | Task | Status |
|---|------|--------|
| 2.1 | `GET /api/zodiac/list` — 获取12星座列表 | ⬜ |
| 2.2 | `GET /api/zodiac/:name` — 根据星座名获取详情 | ⬜ |
| 2.3 | `GET /api/zodiac/match` — 星座配对分析 | ⬜ |
| 2.4 | `GET /api/zodiac/daily-tip` — 每日趣味建议 | ⬜ |
| 2.5 | `GET /api/zodiac/birthday` — 生日自动识星座 | ⬜ |
| 2.6 | `GET /api/character/list` — **获取所有角色列表** | ⬜ |
| 2.7 | `POST /api/character/match` — **提交问卷 + 星座 → 返回匹配角色** | ⬜ |
| 2.8 | CORS 跨域配置 + 接口联调测试 | ⬜ |

## Phase 3: 前端 — 项目初始化 & 基础设施

| # | Task | Status |
|---|------|--------|
| 3.1 | 初始化 UniApp + Vue3 + Vite 项目 | ⬜ |
| 3.2 | 创建前端目录结构 | ⬜ |
| 3.3 | pages.json 路由 & TabBar 配置 | ⬜ |
| 3.4 | uni.scss 全局样式 & 主题变量 | ⬜ |
| 3.5 | API 请求层封装 (baseURL + 拦截器) | ⬜ |
| 3.6 | 工具函数 (星座换算 / 时间格式化) | ⬜ |
| 3.7 | 全局组件 (免责弹窗 / 加载动画 / 星空背景 / 角色卡片 / 粒子特效) | ⬜ |
| 3.8 | **猎奇图片资源准备 — 12角色头像 + 全图 + 背景图 + 占位图** | ⬜ |

## Phase 4: 前端 — 页面开发

| # | Task | Status |
|---|------|--------|
| 4.1 | 首页 — 12星座网格 + 3大功能入口 | ⬜ |
| 4.2 | 星座详情页 — 性格解读 + 建议 + 趣味提示 | ⬜ |
| 4.3 | **角色匹配页 — 星座选择 → 6题问卷 → 结果展示动画** | ⬜ |
| 4.4 | **角色结果页 — 匹配角色卡 + 共鸣分析 + 个性建议 + 粒子渐显动画** | ⬜ |
| 4.5 | 星座配对页 — 双星座合拍分析 | ⬜ |
| 4.6 | 个人中心页 — 生日识星座 + 浏览记录 + 免责 | ⬜ |
| 4.7 | 每个页面合规检查（底部免责声明） | ⬜ |
| 4.8 | **猎奇视觉动效 — 3D卡片翻转 / 星光扩散 / 匹配粒子动画** | ⬜ |

## Phase 5: 前后端联调 & 编译交付

| # | Task | Status |
|---|------|--------|
| 5.1 | 前端对接所有后端接口 | ⬜ |
| 5.2 | manifest.json 微信小程序配置 | ⬜ |
| 5.3 | 编译为微信小程序 & 开发者工具预览 | ⬜ |
| 5.4 | 微信审核 checklist | ⬜ |
| 5.5 | 图片资源压缩优化（保证小程序包体积 < 2MB） | ⬜ |
| 5.6 | 启动命令 & 部署说明文档 | ⬜ |

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-22 | 前后端分离架构 | 后端可独立维护，数据与页面解耦 |
| 2026-05-22 | Node.js + Express | 轻量、与前端 JS 生态统一 |
| 2026-05-22 | 本地 JSON 存储 | 无需数据库依赖，开箱即用 |
| 2026-05-22 | UniApp + Vue3 + Vite | 用户指定 |
| 2026-05-22 | 星空紫 #6B5B9A + 浅金 #D4A574 | 用户指定 |
| 2026-05-22 | 严禁算命类内容 | 微信审核红线 |
| 2026-05-22 | 12角色体系 + 3属性维度 | 可搭配任意星座，匹配更多元有趣 |
| 2026-05-22 | 匹配算法：星座40% + 问卷60% | 星座定基调，问卷反应真实性格 |
| 2026-05-22 | 角色名采用「称号」风格 | 星之勇者、月下诗人等，增强沉浸感和趣味性 |
| 2026-05-22 | 猎奇视觉风格：暗黑童话+超现实 | 不走可爱路线，怪诞风格更有记忆点，且不涉及真人肖像 |
| 2026-05-22 | AI生成图片优先（方案A） | Midjourney/DALL-E 风格统一、成本低、迭代快 |

## Open Questions

- 微信小程序 AppID 是否已注册？
- 后端是本地运行还是需要部署到云服务器？
- 角色是否需要配图/头像？什么风格？（二次元/手绘/简约图标）
- 问卷题目是否需要更多（目前6题）？

# Findings — 星语小馆 StarWhisper

完整技术方案与设计文档（前后端分离 + 角色匹配系统 + 极端猎奇视觉）

---

## 一、技术架构总览

```
微信小程序 (客户端)
    │
    │  uni.request
    │  BaseURL: http://localhost:3000/api
    ▼
Express API Server (Node.js)
    │
    │  fs.readFileSync
    ▼
本地 JSON 数据文件 (data/*.json)
```

---

## 二、前端项目（UniApp + Vue3 + Vite）

### 2.1 目录结构

```
starwhisper-client/
├── pages/
│   ├── index/                # 首页 — 12星座网格 + 3大入口
│   │   └── index.vue
│   ├── detail/               # 星座详情页
│   │   └── detail.vue
│   ├── match/                # 星座配对页
│   │   └── match.vue
│   ├── quiz/                 # 🆕 角色匹配 — 问卷页
│   │   └── quiz.vue
│   ├── result/               # 🆕 角色匹配 — 结果页
│   │   └── result.vue
│   └── profile/              # 个人中心页
│       └── profile.vue
├── components/
│   ├── ZodiacGrid.vue        # 星座网格
│   ├── ZodiacCard.vue        # 星座卡片
│   ├── CharacterCard.vue     # 🆕 角色卡片（正面角色图/背面详情）
│   ├── QuizQuestion.vue      # 🆕 单题问卷组件
│   ├── DisclaimerModal.vue   # 合规免责弹窗
│   ├── LoadingOverlay.vue    # 加载动画
│   └── StarBackground.vue    # 星空背景
├── api/
│   ├── request.js            # 请求封装
│   ├── zodiac.js             # 星座 API
│   └── character.js          # 🆕 角色匹配 API
├── utils/
│   ├── zodiac.js             # 星座计算工具
│   ├── storage.js            # 本地存储封装
│   └── format.js             # 格式化工具
├── static/
│   ├── icons/                # 星座图标
│   └── images/
│       └── characters/       # 🆕 12角色头像/插画
├── styles/
│   ├── theme.scss            # 主题变量
│   └── common.scss           # 通用工具类
├── pages.json                # 路由 & TabBar
├── manifest.json             # 微信小程序配置
├── uni.scss                  # UniApp 全局变量
├── App.vue                   # 应用入口
├── main.js
└── vite.config.js
```

### 2.2 页面路由 & TabBar

| 页面 | 路径 | TabBar |
|------|------|--------|
| 首页 | `/pages/index/index` | 🏠 首页 |
| 星座详情 | `/pages/detail/detail` | — (导航跳转) |
| 星座配对 | `/pages/match/match` | 💑 配对 |
| 角色问卷 | `/pages/quiz/quiz` | — (从首页入口) |
| 匹配结果 | `/pages/result/result` | — (问卷提交后跳转) |
| 个人中心 | `/pages/profile/profile` | 👤 我的 |

### 2.3 全局主题变量

```scss
// uni.scss
$color-primary: #6B5B9A;        // 星空紫
$color-primary-light: #8B7DB5;  // 浅紫
$color-primary-dark: #4A3D6F;   // 深紫
$color-accent: #D4A574;         // 浅金
$color-accent-light: #E8CBA5;   // 亮金

$bg-dark: #1A1028;              // 深空背景
$bg-card: rgba(255,255,255,0.08);
$bg-gradient: linear-gradient(180deg, #1A1028 0%, #2D1B4E 100%);

$text-primary: #F0E6FF;
$text-secondary: rgba(240,230,255,0.65);
$text-accent: #D4A574;

$radius-card: 16rpx;
$shadow-card: 0 4rpx 20rpx rgba(107,91,154,0.3);
```

### 2.4 API 请求层

```js
// api/request.js
const BASE_URL = 'http://localhost:3000/api';

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data || {},
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data);
        } else {
          uni.showToast({ title: res.data.msg || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      }
    });
  });
};
```

---

## 三、后端项目（Node.js + Express）

### 3.1 目录结构

```
starwhisper-server/
├── data/
│   ├── zodiac.json           # 12星座完整数据
│   ├── match.json            # 星座配对关系数据
│   ├── daily-tips.json       # 每日趣味建议池
│   ├── characters.json       # 🆕 12个虚构角色数据
│   └── quiz.json             # 🆕 问卷题目 + 选项权重
├── routes/
│   ├── zodiac.js             # 星座相关路由
│   └── character.js          # 🆕 角色匹配路由
├── controllers/
│   ├── zodiacController.js   # 星座接口逻辑
│   └── characterController.js # 🆕 角色匹配逻辑
├── middleware/
│   └── cors.js               # 跨域中间件
├── utils/
│   ├── response.js           # 统一响应格式
│   └── reader.js             # JSON 文件读取工具
├── app.js                    # 服务入口
├── package.json
└── README.md
```

### 3.2 接口列表

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/api/zodiac/list` | 获取12星座列表 | 无 |
| GET | `/api/zodiac/:name` | 获取星座详情 | name (路径参数) |
| GET | `/api/zodiac/match` | 星座配对分析 | zodiac1, zodiac2 (query) |
| GET | `/api/zodiac/daily-tip` | 每日趣味建议 | name (query, 可选) |
| GET | `/api/zodiac/birthday` | 生日自动识星座 | month, day (query) |
| GET | `/api/character/list` | 获取所有角色列表 | 无 |
| POST | `/api/character/match` | 提交问卷 → 匹配角色 | zodiac, answers (body) |

### 3.3 统一响应格式

```json
// 成功
{ "code": 0, "msg": "success", "data": { ... } }

// 失败
{ "code": 400, "msg": "请输入正确的星座名称", "data": null }
```

---

## 四、核心数据结构

### 4.1 12星座数据 (zodiac.json)

```json
{
  "id": "aries",
  "name": "白羊座",
  "emoji": "♈",
  "dateRange": "3月21日 - 4月19日",
  "element": "火象",
  "ruler": "火星",
  "personality": {
    "title": "勇敢的开拓者",
    "description": "白羊座是黄道十二宫的第一个星座，象征着新的开始...",
    "strengths": ["热情开朗", "勇往直前", "真诚直率", "充满活力"],
    "traits": ["行动派", "乐观", "独立", "自信"]
  },
  "dailySuggestion": {
    "mood": "今天的你充满活力，适合尝试新事物",
    "social": "适合与朋友小聚，分享快乐",
    "tip": "记得多喝水，保持精力充沛"
  },
  "funFact": "白羊座的守护星是火星，在罗马神话中是战神的象征",
  "color": "#FF6B6B"
}
```

### 4.2 12猎奇角色数据 (characters.json)

```json
[
  {
    "id": "faceless_teller",
    "name": "无面说书人",
    "title": "你的故事写在我脸上",
    "type": "文字怪异",
    "emoji": "🫠",
    "description": "它的脸是一张不断翻页的羊皮纸，五官被流动的文字取代。每眨一次眼，就换一个故事。你盯着它看的时候，会看到自己刚刚做过的梦从它额头上滑过。",
    "tags": ["叙事者", "文字的容器", "梦的镜子"],
    "affinityZodiacs": ["gemini", "libra", "aquarius"],
    "advice": "你不是没有表情，你只是把心情写在了别处",
    "quote": "你的故事，写在我脸上",
    "color": "#C4A46C",
    "images": {
      "avatar": "/static/images/characters/faceless_teller_avatar.png",
      "full": "/static/images/characters/faceless_teller_full.jpg",
      "thumbnail": "/static/images/characters/faceless_teller_thumb.png"
    }
  },
  {
    "id": "reverse_time",
    "name": "逆时症患者",
    "title": "我昨天见过明天的你",
    "type": "时间怪异",
    "emoji": "🕳️",
    "description": "半透明的皮肤下，血液从指尖倒流回心脏。它的昨天是你的明天，所以它总是一副早就知道你要说什么的表情。靠近它会闻到倒带的焦糖味。",
    "tags": ["时间逆流", "预知", "倒带人生"],
    "affinityZodiacs": ["capricorn", "virgo", "taurus"],
    "advice": "不必后悔昨天，你的血液方向是对的",
    "quote": "我昨天已经见过了明天的你",
    "color": "#8BB8C4",
    "images": {
      "avatar": "/static/images/characters/reverse_time_avatar.png",
      "full": "/static/images/characters/reverse_time_full.jpg",
      "thumbnail": "/static/images/characters/reverse_time_thumb.png"
    }
  },
  {
    "id": "tv_head",
    "name": "颅骨电视机",
    "title": "刚收到了你的梦境信号",
    "type": "机械怪异",
    "emoji": "📺",
    "description": "脑袋是一台布满灰尘的CRT老电视，大多数时候显示雪花屏。但偶尔会接收到不知来源的信号——播放的是别人正在做的梦。脖子后面伸出三根天线，手背上有换台旋钮。",
    "tags": ["信号接收器", "梦境盗看者", "频道漫游"],
    "affinityZodiacs": ["aquarius", "pisces", "scorpio"],
    "advice": "偶尔切换到静音模式，对大脑有好处",
    "quote": "嘘…我刚刚收到了你的梦境信号",
    "color": "#5B6B8A",
    "images": {
      "avatar": "/static/images/characters/tv_head_avatar.png",
      "full": "/static/images/characters/tv_head_full.jpg",
      "thumbnail": "/static/images/characters/tv_head_thumb.png"
    }
  }
  // ... 其余9个角色
]
```

### 4.3 问卷数据 (quiz.json)

```json
{
  "questions": [
    {
      "id": 1,
      "text": "周末你最想怎么过？",
      "options": [
        { "key": "A", "text": "出门冒险，探索未知", "weight": { "star_hero": 3, "thunder_traveler": 3, "flame_knight": 2 } },
        { "key": "B", "text": "安静在家，看书充电", "weight": { "moon_poet": 3, "mountain_sage": 3, "truth_seeker": 2 } },
        { "key": "C", "text": "约上好友，聚会聊天", "weight": { "melody_heart": 3, "color_dreamer": 2, "forest_whisperer": 2 } },
        { "key": "D", "text": "随心所欲，看心情决定", "weight": { "deep_sea_whisperer": 2, "dawn_blade": 2, "guardian_shield": 2 } }
      ]
    }
    // ... 其余5题
  ]
}
```

### 4.4 配对数据模型

```json
{
  "aries": {
    "leo":     { "score": 95, "title": "天作之合", "summary": "...", "tags": ["热情", "默契"] },
    "sagittarius": { "score": 90, "title": "灵魂伴侣", "summary": "...", "tags": ["自由", "冒险"] }
  }
}
```

---

## 五、角色匹配算法

### 5.1 匹配流程

```
[用户输入]
  zodiac: "aries"  (白羊座)
  answers: ["A", "B", "C", "A", "B", "C"]  (6题答案)

[计算步骤]
  1. 星座基础分 (40%): 查询 characters.json
     → 白羊座亲和角色: star_hero(+40), flame_knight(+35), thunder_traveler(+30)
     → 其余角色: +20 基础分

  2. 问卷加权分 (60%): 逐题累加
     → Q1选A: star_hero+3, thunder_traveler+3, flame_knight+2
     → Q2选B: moon_poet+3, mountain_sage+3, truth_seeker+2
     → ...累加后归一化为百分制

  3. 总分 = 星座分 × 0.4 + 问卷分 × 0.6
     → 取最高分角色

[返回结果]
  {
    character: { ... 完整角色信息 },
    score: 88,
    analysis: "星之勇者的热情与白羊座的天性完美契合...",
    zodiacResonance: "白羊座的冒险精神与星之勇者的无畏产生了强烈共鸣",
    advice: "你的热情是最大的武器，但记得偶尔停下脚步看看风景"
  }
```

### 5.2 避免重复匹配

同一用户短时间内返回相同结果时，前端缓存上一次结果。如果用户想重新匹配，需主动点击「重新测试」。

---

## 六、前后端交互流程

### 6.1 角色匹配接口（核心新增）

```
POST /api/character/match
Content-Type: application/json

Request Body:
{
  "zodiac": "aries",
  "answers": ["A", "B", "C", "A", "B", "D"]
}

Response:
{
  "code": 0,
  "msg": "success",
  "data": {
    "character": {
      "id": "star_hero",
      "name": "星之勇者",
      "title": "炽热之魂的化身",
      "type": "热血冒险",
      "emoji": "🌟",
      "description": "你是被星辰选中的勇者...",
      "tags": ["勇敢", "热血", "正义"],
      "quote": "真正的勇气，是在黑暗中仍能看见光",
      "color": "#FF6B6B"
    },
    "score": 88,
    "analysis": "星之勇者的热情与白羊座的天性完美契合，你的每一个选择都透露着冒险家的灵魂。",
    "zodiacResonance": "白羊座的冒险精神与星之勇者的无畏产生了强烈共鸣，这并非巧合。",
    "advice": "你的热情是最大的武器，但记得偶尔停下脚步看看风景。",
    "disclaimer": "本匹配结果仅供娱乐参考，愿你保持独特的自己。"
  }
}
```

---

## 七、开发顺序

1. **Phase 1** — 后端数据层（含角色 + 问卷 JSON）
2. **Phase 2** — 后端全部 7 个接口
3. **Phase 3** — 前端基础设施
4. **Phase 4** — 前端 6 个页面（重点：quiz.vue + result.vue）
5. **Phase 5** — 联调 + 编译交付

---

## 八、合规要点

| 红线 | 措施 |
|------|------|
| 禁止算命 | 所有文案使用「趣味解读」「仅供参考」「可能」「也许」 |
| 禁止吉凶 | 配对只说「合拍度」「默契值」，不用「吉」「凶」 |
| 禁止改运 | 建议仅限「多喝水」「早点休息」等生活小贴士 |
| **角色匹配合规** | "匹配结果仅为娱乐，不代表真实人格" |
| 免责声明 | 首页弹窗 + 每页底部 + 结果页显著位置 |
| 敏感词库 | 过滤：运势/吉凶/祸福/改运/化解/命理/八字/占卜/塔罗 |

---

## 九、猎奇图片资源规格

### 9.1 图片清单

| 资源 | 数量 | 尺寸 | 格式 | 大小限制 |
|------|------|------|------|----------|
| 角色头像 | 12张 | 400×400rpx | PNG (透明底) | <50KB/张 |
| 角色全图 | 12张 | 600×800rpx | JPG (85%) | <100KB/张 |
| 首页星空背景 | 1张 | 750×1624rpx | JPG (70%) | <150KB |
| 详情页星座背景 | 12张 | 750×1624rpx | JPG (70%) | <80KB/张 |
| 配对结果背景 | 3张 | 750×400rpx | PNG | <60KB/张 |
| 占位图 | 1张 | 400×400rpx | PNG | <10KB |
| 免责弹窗插画 | 1张 | 500×300rpx | PNG | <30KB |

**总计预算：约 2MB**，符合微信小程序分包前的体积限制。

### 9.2 AI 生成 Prompt 模板（猎奇增强版）

> 以「无面说书人」为例：

```
A bizarre surreal creature portrait, "Faceless Teller",
face replaced with unrolling parchment scroll, 
ink text crawling out of skin pores like living insects,
hair made of bleeding ink strands dripping upward defying gravity,
moth-eaten robe, quill fingers, 
dark fantasy meets body horror lite,
surrealist oil painting style, Zdzisław Beksiński influence,
moody chiaroscuro lighting, deep amber and aged-paper tones,
no text, no watermark, dark atmospheric background,
vertical portrait composition, 2:3 aspect ratio
--style raw --ar 2:3
```

> 以「颅骨电视机」为例：

```
Analog horror creature, humanoid with CRT television for a head,
dusty vintage TV set showing static snow with barely visible face,
three antennae protruding from back of neck like insect appendages,
VHS tape ribs visible through torn clothing,
broadcasting waves visualized as glowing circuit patterns on skin,
dark room vibes, glitch aesthetic, 1980s technology fused with flesh,
David Cronenberg meets vaporwave, unsettling but captivating,
no text, dark moody background, 2:3 aspect ratio
--style raw --ar 2:3
```

> 以「记忆蚊」为例：

```
Dark whimsical creature, human-sized mosquito standing upright,
long proboscis glowing with extracted golden memories,
translucent abdomen showing swirling light particles of consumed thoughts,
compound eyes reflecting tiny faces of forgotten people,
delicate iridescent wings folded like a cloak,
twisted fairy tale illustration style, unsettling yet oddly gentle,
moonlit scene, golden dust particles floating around,
no text, atmospheric dark background, 2:3 aspect ratio
--style raw --ar 2:3
```

### 9.3 角色图片字段 (characters.json 扩展)

```json
{
  "id": "star_hero",
  "name": "星之勇者",
  "images": {
    "avatar": "/static/images/characters/star_hero_avatar.png",
    "full": "/static/images/characters/star_hero_full.jpg",
    "thumbnail": "/static/images/characters/star_hero_thumb.png"
  }
}
```

### 9.4 前端性能策略

- 角色列表使用缩略图（thumbnail），点击时才加载全图
- 首页星空背景使用 CSS gradient 模拟，减少图片请求
- 图片懒加载 + 渐进式加载占位
- 结果页大图采用渐显动画，掩盖加载延迟
- 小程序 `image` 组件 `lazy-load` 属性

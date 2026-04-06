# 视觉小说游戏框架

一个基于 Web 的轻量级互动小说引擎，支持创作者通过 JSON 数据文件快速构建带有分支选择、HP 机制、物品系统和 AI 生成图像的视觉小说。

## 核心特性

### 📖 数据驱动创作
- 通过 JSON 文件创作小说，无需编程经验
- 内容与代码完全分离，修改即时生效
- 分章-节-页三级结构，支持复杂叙事

### 🎮 互动游戏机制
- **HP 系统**: 血量显示、扣血加血场景、死亡结局
- **物品系统**: 拾取物品、食物加血、物品解锁选项
- **分支选择**: 多路线叙事，抉择影响结局

### 🎨 AI 图像生成
- 使用「千问 - 文生图」Skill 生成背景图
- 根据小说 tags 自动带入场景上下文
- 支持手动上传图片作为替代

### ⚡ 阅读体验优化
- 打字机效果呈现文字内容
- 响应式布局，支持 PC、平板、移动端
- 自动保存阅读进度，刷新恢复位置

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
# 访问 http://localhost:8002
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
# 访问 http://localhost:8003
```

## 项目结构

```
novelgame/
├── specs/                          # 规范文档目录
│   ├── constitution.md             # 项目宪法
│   ├── overall-spec.md             # 整体规格文档
│   ├── overall-plan.md             # 技术方案
│   ├── overall-data-model.md       # 数据模型
│   ├── overall-api.md              # API 接口
│   ├── 001-architecture/           # 核心架构文档
│   ├── 002-module-*/               # 功能模块文档
│   └── 101-doomsday/               # 示例小说文档
├── public/
│   ├── data/                       # 小说数据目录
│   │   ├── books.json              # 小说列表索引
│   │   └── <小说名>/               # 单部小说目录
│   │       ├── book.json           # 小说框架配置
│   │       ├── <章>/<节>/<页>.json # 页面内容文件
│   │       └── images/             # 图片资源
│   │           ├── cover.jpg       # 封面图
│   │           └── backgrounds/    # 背景图
│   └── images/                     # 公共图片资源
├── src/
│   ├── main.ts                     # 应用入口
│   ├── App.vue                     # 根组件
│   ├── components/                 # Vue 组件
│   │   ├── BookList.vue            # 小说列表
│   │   ├── Reader.vue              # 阅读器
│   │   ├── SelectionPanel.vue      # 选择面板
│   │   ├── Typewriter.vue          # 打字机效果
│   │   ├── DeathEnding.vue         # 死亡结局
│   │   └── ItemPickupDialog.vue    # 物品拾取
│   ├── composables/                # 组合式函数
│   │   ├── useBooks.ts             # 小说数据管理
│   │   ├── useGameState.ts         # 游戏状态（HP、物品）
│   │   ├── useNavigation.ts        # 导航管理
│   │   ├── useImageGeneration.ts   # 图片生成
│   │   └── useSaveSystem.ts        # 进度保存
│   ├── types/                      # TypeScript 类型
│   │   ├── book.ts                 # 小说类型
│   │   └ api.ts                    # API 类型
│   ├── styles/                     # 样式文件
│   │   ├── main.css                # 全局样式
│   │   └ responsive.css            # 响应式样式
│   └── utils/                      # 工具函数
│       ├── path.ts                 # 路径处理
│       └ image.ts                  # 图片处理
├── index.html                      # HTML 入口
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript 配置
└── vite.config.ts                  # Vite 配置
```

## 数据结构

### 小说列表 (books.json)

```json
{
  "books": [
    {
      "title": "小说标题",
      "subtitle": "小说子标题",
      "cover": "<封面图片相对路径>",
      "path": "<小说英文名>/book.json"
    }
  ]
}
```

### 小说框架 (book.json)

```json
{
  "title": "小说标题",
  "subtitle": "小说子标题",
  "cover": "<封面图片相对路径>",
  "tags": "小说的基础环境设定，用于 AI 生图",
  "chapters": [
    {
      "id": "01",
      "title": "章标题",
      "sections": [
        {
          "id": "01-01",
          "title": "节标题",
          "pages": [
            {
              "id": "01-01-001",
              "title": "页标题",
              "json": "01/01/001.json"
            }
          ]
        }
      ]
    }
  ],
  "items": [
    {
      "id": "bread",
      "name": "面包",
      "type": "food",
      "hp": 2,
      "icon": "🍞"
    },
    {
      "id": "gun",
      "name": "手枪",
      "type": "weapon",
      "icon": "🔫"
    }
  ]
}
```

### 页面内容 (XX/YY/ZZ.json)

```json
{
  "id": "01-01-001",
  "title": "页标题",
  "background": "<背景图片相对路径>",
  "content": "该页的文字内容",
  "hp": -1,
  "items": ["bread"],
  "selections": [
    {
      "icon": "🚪",
      "text": "打开门",
      "to": "01-01-002"
    },
    {
      "icon": "🔑",
      "text": "用钥匙开门",
      "use": "key-for-01-01-001",
      "to": "01-01-003"
    }
  ]
}
```

**字段说明**:
- `hp`: 进入此页面时的血量变化（正数加血，负数扣血）
- `items`: 页面中可拾取的物品 ID 列表（只能选择一个或都不选）
- `use`: 选择支需要的物品 ID（只有拥有该物品才显示此选项）

## 创作小说

### 1. 复制示例

```bash
cp -r public/data/doomsday public/data/my-novel
```

### 2. 修改配置

编辑 `public/data/my-novel/book.json`：
- 设置小说标题、副标题、tags
- 定义章-节-页结构
- 配置小说中的物品列表

### 3. 编写内容

在对应章节目录下创建 JSON 文件：
- 设置背景图片路径
- 编写文字内容
- 设计 HP 变化场景（扣血/加血）
- 设置可拾取物品
- 创建分支选择（可设置物品锁定）

### 4. 添加到列表

编辑 `public/data/books.json`，添加新小说信息。

### 5. 测试验证

刷新页面即可查看效果，修改即时生效。

## AI 生成配图

### 前置条件

1. **获取 API Key**: 从 [阿里云百炼控制台](https://help.aliyun.com/zh/model-studio/get-api-key) 获取 API Key
2. **配置环境变量**: 
   ```bash
   export DASHSCOPE_API_KEY="sk-xxx"
   ```

### 使用 Skill 生成图片

使用「千问 - 文生图」Skill 生成小说背景图：

```bash
# 基本用法
./skills/qwen-image/generate-image.sh "图片描述" qwen-image-2.0-pro "2048*2048" 1

# 示例：生成末日废土街道场景
./skills/qwen-image/generate-image.sh "末日废土风格的街道，破败的建筑，灰暗的天空，写实风格" qwen-image-2.0-pro "2048*2048" 1
```

### 图片存储

生成的图片 URL 有效期为 **24 小时**，必须：

1. **立即下载**: 打开返回的 URL 下载图片
2. **保存到项目**: 放入 `public/data/<小说名>/images/backgrounds/` 目录
3. **重命名**: 使用描述性文件名，如 `street-ruined-01.png`
4. **在 JSON 中引用**:
   ```json
   {
     "background": "images/backgrounds/street-ruined-01.png"
   }
   ```

### 推荐模型

- **qwen-image-2.0-pro**: 擅长文本渲染，适合海报、图表（推荐）
- **qwen-image-plus**: 增强版，通用场景
- **wan2.7-image-pro**: 功能最全，支持 4K 分辨率

### 提示词技巧

- **具体详细**: 描述主体、场景、风格、光照、构图
- **结构化**: 按"主体 + 场景 + 风格 + 细节"顺序
- **带上 tags**: 结合小说的 tags 作为上下文

示例提示词：
```
冬日北京的都市街景，青灰瓦顶、朱红色外墙的中式商铺，檐下悬挂灯笼，
湿润鹅卵石路面，阴天漫射光，写实风格，高清晰度
```

## 示例小说《末日》

框架包含一部完整的示例小说《末日》，讲述末日生存环境中的抉择故事，展示了框架的所有核心功能。

### 基本信息

- **标题**: 末日 - 生存与抉择
- **类型**: 末日生存互动小说
- **视角**: 第二人称（"你"）
- **初始 HP**: 10 点

### 已完成内容

- ✅ **第 1 章：觉醒** - 60 页，包含初始探索、物品拾取、扣血场景
- ✅ **第 2 章：废土求生** - 25 页，包含战斗、资源搜索、抉择
- ✅ **第 3 章：抉择时刻** - 26 页，包含分支 A/B 路线、关键抉择
- ✅ **第 4 章：终章** - 35 页，包含多个结局路线
- ✅ **总计**: 146 页完整剧情
- ✅ **背景图**: 11 张高质量背景图（建筑、营地、走廊、大厅、商场、辐射区、屋顶、房间、楼梯、街道、荒野）

### 游戏机制展示

**HP 系统**:
- 扣血场景：跌落、战斗、危险环境
- 加血场景：休息、进食、医疗
- 死亡结局：HP ≤ 0 触发

**物品系统**:
- 食物类：面包（+2HP）、水（+1HP）、罐头（+3HP）
- 工具类：手枪、手电筒、急救包（+5HP）
- 关键物品解锁特定选项

**多结局设计**:
- 新生结局
- 孤独行者结局
- 牺牲结局
- 黑暗王者结局
- 希望之光结局

## 技术栈

- **Vue 3** - 前端框架（Composition API）
- **TypeScript** - 类型系统，100% 类型覆盖
- **Vite** - 构建工具，极速开发体验
- **千问 - 文生图 Skill** - AI 图像生成（基于阿里云百炼 API）

## 规范文档

详细规范文档见 `specs/` 目录，采用三层结构：

**整体层**:
- `constitution.md` - 项目宪法原则
- `overall-spec.md` - 功能规格（FR-BOOKS、FR-READING、FR-HP、FR-ITEMS 等）
- `overall-plan.md` - 技术方案
- `overall-data-model.md` - 数据模型
- `overall-api.md` - API 接口

**架构层** (`001-architecture/`):
- `spec.md` - 核心架构规格
- `plan.md` - 架构实现方案
- `task.md` - 架构任务清单

**模块层** (`002-module-*/`):
- 各功能模块的 spec/plan/task 文档

**小说层** (`101-doomsday/`):
- 示例小说的规格、创作方案、任务清单

## 功能清单

- [x] 小说列表显示
- [x] 点击开始进入小说
- [x] 阅读内容显示（背景图 + 文字）
- [x] 分支选择正常工作
- [x] HP 机制（血量显示、扣血加血、死亡结局）
- [x] 物品机制（拾取、使用、物品锁定选项）
- [x] 打字机效果呈现文字
- [x] 选择框动画显示
- [x] 响应式布局（PC、平板、移动端）
- [x] 阅读进度自动保存
- [x] 刷新页面恢复进度
- [x] AI 生图功能集成（使用千问 - 文生图 Skill）
- [ ] 图片缓存优化
- [ ] 链接校验工具

## 性能指标

- ✅ 首屏加载 ≤ 2 秒
- ✅ 页面切换 ≤ 500ms
- ✅ TypeScript 编译零错误
- ✅ 浏览器兼容：Chrome 90+, Safari 14+, Firefox 88+
- ✅ 设备兼容：iOS 13+, Android 10+

## License

MIT
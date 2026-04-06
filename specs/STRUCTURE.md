# 项目目录结构

## 整体结构

```
novelgame/                          # 项目根目录
├── specs/                          # 规范文档目录
│   ├── SPECS_CHECKLIST.md          # 规格检查清单
│   ├── STRUCTURE.md                # 本文件：目录结构说明
│   ├── constitution.md             # 宪法原则文档
│   ├── overall-spec.md             # 整体规格文档
│   ├── overall-plan.md             # 整体技术方案
│   ├── overall-data-model.md       # 数据模型
│   ├── overall-api.md              # 对外接口模型
│   ├── 001-architecture/           # 核心架构、主要框架
│   │   ├── spec.md                 # 架构规格
│   │   ├── plan.md                 # 架构方案
│   │   └── task.md                 # 架构任务
│   ├── 002-module-XX/              # 框架相关模块
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── task.md
│   └── 101-doomsday/               # 指定小说的规范文档
│       ├── spec.md                 # 小说规格
│       ├── plan.md                 # 小说方案
│       └── task.md                 # 小说任务
├── public/                         # 静态资源目录
│   ├── data/                       # 小说数据目录
│   │   ├── books.json              # 小说列表
│   │   └── doomsday/               # 《末日》小说数据
│   │       ├── book.json           # 小说框架
│   │       ├── 01/                 # 第 1 章
│   │       │   └── 01/             # 第 1 节
│   │       │       └── 001.json    # 第 1 页
│   │       └── images/             # 小说图片资源
│   │           ├── cover.jpg       # 封面
│   │           └── backgrounds/    # 背景图
│   └── images/                     # 公共图片资源
├── src/                            # 源代码目录
│   ├── main.ts                     # 应用入口
│   ├── App.vue                     # 根组件
│   ├── components/                 # 可复用组件
│   │   ├── BookList.vue            # 小说列表组件
│   │   ├── Reader.vue              # 阅读器组件
│   │   ├── SelectionPanel.vue      # 选择面板组件
│   │   └── ImageViewer.vue         # 图片查看器组件
│   ├── composables/                # 组合式函数
│   │   ├── useBooks.ts             # 小说数据管理
│   │   ├── useNavigation.ts        # 导航管理
│   │   └── useImageGeneration.ts   # 图片生成管理
│   ├── types/                      # TypeScript 类型定义
│   │   ├── book.ts                 # 小说类型定义
│   │   └── api.ts                  # API 类型定义
│   ├── styles/                     # 样式文件
│   │   ├── main.css                # 全局样式
│   │   └── responsive.css          # 响应式样式
│   └── utils/                      # 工具函数
│       ├── path.ts                 # 路径处理工具
│       └── image.ts                # 图片处理工具
├── index.html                      # HTML 入口
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript 配置
└── vite.config.ts                  # Vite 配置
```

## 规范文档结构

### 整体层（overall-*）
- `overall-spec.md`: 整体功能规格
- `overall-plan.md`: 整体技术实现方案
- `overall-data-model.md`: 数据模型定义
- `overall-api.md`: API 接口定义

### 架构层（001-architecture/）
每个架构模块包含：
- `spec.md`: 架构规格说明
- `plan.md`: 架构实现方案
- `task.md`: 架构实现任务

### 模块层（002-module-XX/）
每个功能模块包含：
- `spec.md`: 模块规格说明
- `plan.md`: 模块实现方案
- `task.md`: 模块实现任务

### 小说层（101-<小说英文名>/）
每部小说包含：
- `spec.md`: 小说内容规格
- `plan.md`: 小说创作方案
- `task.md`: 小说创作任务

## 数据文件结构

### books.json
小说列表索引，位于 `public/data/books.json`

### book.json
单部小说的框架结构，位于 `public/data/<小说英文名>/book.json`

### 页面 JSON
小说的每一页内容，位于 `public/data/<小说英文名>/<章>/<节>/<页>.json`

## 图片资源结构

所有图片资源存放在 `public/data/<小说英文名>/images/` 目录下：
- `cover.jpg`: 小说封面
- `backgrounds/`: 背景图片目录
- `characters/`: 角色图片目录（未来扩展）

所有路径在 JSON 中使用相对路径，相对于对应的 JSON 文件所在位置。

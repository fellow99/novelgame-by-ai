# 视觉小说游戏框架 - 整体技术方案

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 技术上下文

### 1.1 技术选型

| 技术领域 | 选择 | 理由 |
|---------|------|------|
| **前端框架** | Vue 3 | 轻量、易学、组合式 API 适合状态管理 |
| **开发语言** | TypeScript | 类型安全、开发体验好、减少运行时错误 |
| **构建工具** | Vite | 极速启动、热更新、配置简单 |
| **样式方案** | 原生 CSS + CSS Variables | 轻量、灵活、无需额外依赖 |
| **AI 服务** | bailian-image MCP | 高质量文生图、API 稳定 |

### 1.2 技术约束

- **开发服务器**: Host 0.0.0.0, Port 8002
- **浏览器支持**: Chrome 90+, Safari 14+, Firefox 88+
- **移动端支持**: iOS 13+, Android 10+
- **Node.js 版本**: 16+

---

## 2. 架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                    用户界面层                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ BookList    │  │ Reader      │  │ Selection   │ │
│  │ 小说列表     │  │ 阅读器      │  │ 选择面板    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   业务逻辑层                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ useBooks    │  │ useNavigat  │  │ useImage    │ │
│  │ 小说数据管理 │  │ 导航管理    │  │ 图片生成    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   数据访问层                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ books.json  │  │ book.json   │  │ XX/YY/ZZ    │ │
│  │ 小说列表    │  │ 小说框架    │  │ 页面内容    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   外部服务层                         │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │ bailian-    │  │ 本地文件    │                   │
│  │ image API   │  │ 系统        │                   │
│  └─────────────┘  └─────────────┘                   │
└─────────────────────────────────────────────────────┘
```

### 2.2 核心模块

#### 2.2.1 小说列表模块 (BookList)
- **职责**: 显示小说列表、处理点击事件
- **依赖**: useBooks composable
- **文件**: `src/components/BookList.vue`

#### 2.2.2 阅读器模块 (Reader)
- **职责**: 显示页面内容、背景图、文字
- **依赖**: useNavigation composable
- **文件**: `src/components/Reader.vue`

#### 2.2.3 选择面板模块 (SelectionPanel)
- **职责**: 显示选择支、处理用户选择
- **依赖**: useNavigation composable
- **文件**: `src/components/SelectionPanel.vue`

#### 2.2.4 图片生成模块 (ImageGenerator)
- **职责**: 调用 AI 生成图片、缓存管理
- **依赖**: bailian-image MCP
- **文件**: `src/composables/useImageGeneration.ts`

---

## 3. 数据模型设计

### 3.1 核心实体

详见 `overall-data-model.md`

### 3.2 数据流

```
用户打开应用
    ↓
加载 books.json
    ↓
显示小说列表
    ↓
用户点击"开始"
    ↓
加载 book.json
    ↓
解析章节结构
    ↓
加载第一页 JSON
    ↓
显示页面内容
    ↓
用户做出选择
    ↓
加载目标页 JSON
    ↓
(循环)
```

### 3.3 状态管理

采用 Vue 3 Composition API + reactive 状态管理：

```typescript
// 全局状态
interface AppState {
  currentBook: Book | null
  currentPage: Page | null
  history: string[] // 阅读历史
}

// 每个 composable 管理自己的状态
const state = reactive<AppState>({
  currentBook: null,
  currentPage: null,
  history: []
})
```

---

## 4. 接口设计

### 4.1 内部接口

详见 `overall-api.md`

### 4.2 外部接口

#### bailian-image API

```typescript
interface ImageGenerationRequest {
  prompt: string // 包含 tags 的完整提示词
  size: string // "1328*1328"
  n: number // 1
  watermark: boolean // false
}

interface ImageGenerationResponse {
  task_id: string
  task_status: 'PENDING' | 'SUCCEEDED' | 'FAILED'
  results?: Array<{
    url: string
    prompt: string
  }>
}
```

---

## 5. 文件结构设计

### 5.1 源代码目录

```
src/
├── main.ts                     # 应用入口
├── App.vue                     # 根组件
├── components/
│   ├── BookList.vue            # 小说列表
│   ├── Reader.vue              # 阅读器
│   ├── SelectionPanel.vue      # 选择面板
│   └── ImageViewer.vue         # 图片查看器
├── composables/
│   ├── useBooks.ts             # 小说数据管理
│   ├── useNavigation.ts        # 导航管理
│   └── useImageGeneration.ts   # 图片生成
├── types/
│   ├── book.ts                 # 小说类型定义
│   └── api.ts                  # API 类型
├── styles/
│   ├── main.css                # 全局样式
│   ├── responsive.css          # 响应式样式
│   └── variables.css           # CSS 变量
└── utils/
    ├── path.ts                 # 路径工具
    └── image.ts                 # 图片工具
```

### 5.2 数据目录

```
public/data/
├── books.json                  # 小说列表
└── doomsday/
    ├── book.json               # 小说框架
    ├── images/
    │   ├── cover.jpg           # 封面
    │   └── backgrounds/        # 背景图
    └── 01/
        └── 01/
            └── 001.json        # 第 1 章第 1 节第 1 页
```

---

## 6. 关键技术实现

### 6.1 响应式布局实现

采用 CSS Media Queries + CSS Variables:

```css
:root {
  --font-size-base: 16px;
  --container-max-width: 800px;
  --touch-target-min: 44px;
}

@media (max-width: 768px) {
  :root {
    --font-size-base: 14px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
  }
}
```

### 6.2 路径解析实现

```typescript
// 相对路径解析工具
export function resolvePath(basePath: string, relativePath: string): string {
  const baseDir = basePath.substring(0, basePath.lastIndexOf('/'))
  return `${baseDir}/${relativePath}`
}

// 使用示例
const pageJson = 'public/data/doomsday/01/01/001.json'
const bgPath = resolvePath(pageJson, 'images/bg001.jpg')
// 结果：public/data/doomsday/01/01/images/bg001.jpg
```

### 6.3 AI 生图实现

```typescript
export async function generateImage(
  prompt: string,
  tags: string
): Promise<string> {
  // 组合完整提示词
  const fullPrompt = `${tags}, ${prompt}`
  
  // 调用 bailian-image API
  const task = await bailianImageGenerate({
    prompt: fullPrompt,
    size: '1328*1328',
    n: 1,
    watermark: false
  })
  
  // 轮询任务状态
  const result = await pollTaskStatus(task.task_id)
  
  // 返回图片 URL
  return result.results[0].url
}
```

### 6.4 阅读进度保存

```typescript
// 使用 localStorage 保存进度
export function saveProgress(bookId: string, pageId: string) {
  const progress = {
    bookId,
    pageId,
    timestamp: Date.now()
  }
  localStorage.setItem('novel-progress', JSON.stringify(progress))
}

export function loadProgress(): { bookId: string, pageId: string } | null {
  const data = localStorage.getItem('novel-progress')
  return data ? JSON.parse(data) : null
}
```

---

## 7. 性能优化

### 7.1 加载优化

- **按需加载**: 只加载当前页 JSON，不预加载全部
- **图片懒加载**: 背景图进入视域后再加载
- **缓存策略**: 已加载的 JSON 和图片缓存在内存中

### 7.2 渲染优化

- **组件懒加载**: 路由级别代码分割
- **虚拟滚动**: 小说列表超过 10 部时使用
- **过渡动画**: 使用 CSS transition 而非 JS 动画

### 7.3 生图优化

- **缓存机制**: 相同 prompt 不重复生成
- **队列管理**: 并发限制为 3 个任务
- **失败重试**: 自动重试 3 次

---

## 8. 错误处理

### 8.1 错误分类

| 错误类型 | 处理方式 | 用户提示 |
|---------|---------|---------|
| **数据文件不存在** | 显示占位内容 | "内容加载中..." |
| **图片加载失败** | 使用默认背景色 | 不提示 |
| **AI 生图失败** | 显示重试按钮 | "生成失败，点击重试" |
| **网络错误** | 自动重试 | "网络连接中..." |
| **类型错误** | 上报错误日志 | "发生错误，请刷新" |

### 8.2 错误边界

```typescript
// 全局错误边界组件
export default defineComponent({
  setup() {
    const error = ref<Error | null>(null)
    
    onErrorCaptured((err) => {
      error.value = err
      logError(err) // 上报日志
      return false // 阻止错误冒泡
    })
    
    if (error.value) {
      return () => h(ErrorFallback, { error: error.value })
    }
  }
})
```

---

## 9. 开发工作流

### 9.1 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:8002
```

### 9.2 创作小说

```bash
# 1. 复制示例小说目录
cp -r public/data/doomsday public/data/my-novel

# 2. 修改 book.json
vim public/data/my-novel/book.json

# 3. 编写章节内容
vim public/data/my-novel/01/01/001.json

# 4. 刷新页面查看效果
```

### 9.3 生成图片

```typescript
// 在组件中调用
const imageUrl = await generateImage(
  '荒凉的城市废墟',
  '末日废土风格，灰暗天空，破碎建筑' // tags
)
```

---

## 10. 部署方案

### 10.1 构建

```bash
npm run build
# 输出到 dist/ 目录
```

### 10.2 部署选项

- **静态托管**: Vercel, Netlify, GitHub Pages
- **自建服务器**: Nginx 静态文件服务
- **本地运行**: 直接打开 dist/index.html

### 10.3 生产配置

```typescript
// vite.config.ts
export default defineConfig({
  base: './', // 相对路径，支持任意部署位置
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

---

## 11. 测试策略

### 11.1 手动测试清单

- [ ] 小说列表显示正常
- [ ] 点击"开始"进入游戏
- [ ] 阅读内容正常显示
- [ ] 选择支跳转正确
- [ ] 移动端响应式正常
- [ ] AI 生图功能可用
- [ ] 刷新页面恢复进度

### 11.2 自动化测试（未来）

- 单元测试：Vitest
- E2E 测试：Playwright

---

## 12. 技术债务

### 12.1 已知限制

1. **图片缓存**: 当前版本使用简单内存缓存，刷新后失效
   - **改进方案**: IndexedDB 持久化缓存

2. **进度保存**: 仅支持单进度点
   - **改进方案**: 支持多存档位

3. **生图成本**: 每次生图调用 API 产生费用
   - **改进方案**: 本地缓存 + 批量生成

### 12.2 未来优化

1. **音效支持**: 添加背景音乐和音效
2. **角色立绘**: 支持角色图片显示
3. **动画效果**: 添加转场动画
4. **多语言**: 支持多语言切换

---

## 13. 参考资料

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [bailian-image API 文档](https://help.aliyun.com/zh/dashscope/)

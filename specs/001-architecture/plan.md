# 视觉小说游戏框架 - 架构实现方案

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 技术上下文

### 1.1 已确认技术栈

| 技术领域 | 选择 | 版本 |
|---------|------|------|
| **前端框架** | Vue 3 | ^3.4.0 |
| **开发语言** | TypeScript | ^5.3.0 |
| **构建工具** | Vite | ^5.0.0 |
| **AI 服务** | bailian-image MCP | 阿里云百炼 |

### 1.2 架构约束

- 开发服务器：Host 0.0.0.0, Port 8002
- 响应式：支持 320px - 1920px
- 类型安全：禁止使用 `any`
- 数据驱动：内容与代码分离

---

## 2. 架构设计

### 2.1 分层架构

```
┌─────────────────────────────────────┐
│         表现层 (Components)          │
│  BookList, Reader, SelectionPanel   │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│         业务层 (Composables)         │
│  useBooks, useNavigation, useImage  │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│         数据层 (Data Access)         │
│  JSON files, bailian-image API      │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│         基础设施层 (Utils)           │
│  path.ts, image.ts, types           │
└─────────────────────────────────────┘
```

### 2.2 核心模块

#### 模块 1: 小说列表模块
- **文件**: `src/components/BookList/BookList.vue`
- **职责**: 显示小说列表，处理点击事件
- **依赖**: useBooks composable

#### 模块 2: 阅读器模块
- **文件**: `src/components/Reader/Reader.vue`
- **职责**: 显示页面内容、背景图、文字
- **依赖**: useNavigation composable

#### 模块 3: 选择面板模块
- **文件**: `src/components/SelectionPanel/SelectionPanel.vue`
- **职责**: 显示选择支，处理用户选择
- **依赖**: 无（纯展示组件）

#### 模块 4: 图片生成模块
- **文件**: `src/composables/useImageGeneration.ts`
- **职责**: 调用 bailian-image API 生成图片
- **依赖**: bailian-image MCP 服务

---

## 3. 实现策略

### 3.1 组件实现顺序

1. **基础组件** → SelectionPanel（纯展示）
2. **容器组件** → BookList（数据展示）
3. **核心组件** → Reader（复杂交互）
4. **集成组件** → ImageViewer（外部服务）

### 3.2 Composable 实现顺序

1. **useBooks** → 数据加载基础
2. **useNavigation** → 导航逻辑
3. **useImageGeneration** → AI 生图集成

### 3.3 样式实现策略

- **全局样式**: `src/styles/main.css` - CSS 变量 + 基础样式
- **响应式**: Media Queries + CSS Variables
- **组件样式**: Scoped CSS per component

---

## 4. 关键技术决策

### 4.1 状态管理

**决策**: 使用 Vue 3 `reactive` + `ref`

**理由**:
- 轻量级，无需额外依赖
- Composition API 原生支持
- 类型推导友好

**实现**:
```typescript
const state = reactive({
  currentBook: null as Book | null,
  currentPage: null as Page | null,
  history: [] as string[]
})
```

### 4.2 数据加载

**决策**: Fetch API + 错误处理

**理由**:
- 浏览器原生支持
- 简单直接
- 适合小型项目

**实现**:
```typescript
async function loadBooks(): Promise<BooksList> {
  const response = await fetch('/data/books.json')
  if (!response.ok) throw new Error('Failed to load')
  return response.json()
}
```

### 4.3 图片加载

**决策**: 懒加载 + 缓存

**理由**:
- 减少首屏加载时间
- 避免重复加载
- 提升用户体验

**实现**:
```typescript
const imageCache = new Map<string, string>()

async function loadImage(src: string): Promise<string> {
  if (imageCache.has(src)) return imageCache.get(src)!
  // Load and cache
}
```

---

## 5. 文件结构

### 5.1 源代码目录

```
src/
├── main.ts                     # 应用入口
├── App.vue                     # 根组件
├── components/
│   ├── BookList/
│   │   ├── BookList.vue
│   │   └── BookList.css
│   ├── Reader/
│   │   ├── Reader.vue
│   │   └── Reader.css
│   ├── SelectionPanel/
│   │   ├── SelectionPanel.vue
│   │   └── SelectionPanel.css
│   └── ImageViewer/
│       ├── ImageViewer.vue
│       └── ImageViewer.css
├── composables/
│   ├── useBooks.ts
│   ├── useNavigation.ts
│   └── useImageGeneration.ts
├── types/
│   └── book.ts
├── styles/
│   ├── main.css
│   ├── responsive.css
│   └── variables.css
└── utils/
    ├── path.ts
    └── image.ts
```

### 5.2 数据目录

```
public/data/
├── books.json
└── doomsday/
    ├── book.json
    ├── images/
    │   ├── cover.jpg
    │   └── backgrounds/
    └── 01/01/*.json
```

---

## 6. 构建配置

### 6.1 Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8002
  }
})
```

### 6.2 TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 7. 质量保证

### 7.1 代码质量

- TypeScript 编译零错误
- ESLint 零错误
- 组件都有类型定义

### 7.2 性能指标

- 首屏加载 ≤ 2 秒
- 页面切换 ≤ 500ms
- 图片懒加载

### 7.3 测试策略

- 手动测试核心功能
- 验证所有页面跳转
- 测试响应式布局

---

## 8. 部署方案

### 8.1 构建命令

```bash
npm run build
```

### 8.2 输出目录

```
dist/
├── index.html
├── assets/
└── data/
```

### 8.3 部署选项

- Vercel / Netlify（静态托管）
- Nginx（自建服务器）
- 本地运行

---

## 9. 参考资料

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

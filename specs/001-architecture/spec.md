# 视觉小说游戏框架 - 架构设计

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 架构概述

### 1.1 架构目标

1. **模块化**: 各组件职责单一，可独立开发和测试
2. **可扩展**: 支持添加新功能而不影响现有代码
3. **高性能**: 快速加载，流畅交互
4. **易维护**: 代码清晰，文档完整

### 1.2 架构分层

```
┌─────────────────────────────────────┐
│         表现层 (Presentation)        │
│  Components, Views, Styles          │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│         业务层 (Business Logic)      │
│  Composables, Services              │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│         数据层 (Data Access)         │
│  Repositories, API Clients          │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│         基础设施层 (Infrastructure)  │
│  Utils, Types, External Services    │
└─────────────────────────────────────┘
```

---

## 2. 核心架构模式

### 2.1 Composition API

采用 Vue 3 Composition API 组织业务逻辑：

```typescript
// 每个功能模块一个 composable
export function useBooks() {
  // 状态
  const books = ref<BooksList | null>(null)
  
  // 方法
  async function loadBooks() { ... }
  async function getBook(path: string) { ... }
  
  // 暴露
  return {
    books,
    loadBooks,
    getBook
  }
}
```

**优势**:
- 逻辑复用方便
- 类型推导友好
- 测试简单

---

### 2.2 数据流

采用**单向数据流**:

```
用户交互
    ↓
Component 触发事件
    ↓
Composable 处理业务逻辑
    ↓
数据层获取/更新数据
    ↓
状态更新
    ↓
Component 重新渲染
```

**禁止**:
- 组件直接修改数据
- 跨组件直接通信
- 循环依赖

---

### 2.3 组件分类

#### 展示组件 (Presentational Components)

**职责**: 纯 UI 渲染，无业务逻辑

**特点**:
- 通过 props 接收数据
- 通过 emits 触发事件
- 不直接访问外部数据源

**示例**:
```vue
<template>
  <div class="book-card">
    <img :src="cover" :alt="title" />
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>
    <button @click="$emit('start')">开始</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  cover: string
}>()

defineEmits<{
  (e: 'start'): void
}>()
</script>
```

---

#### 容器组件 (Container Components)

**职责**: 数据获取和业务逻辑

**特点**:
- 调用 composables 获取数据
- 处理用户交互
- 传递数据给展示组件

**示例**:
```vue
<template>
  <BookList 
    :books="books" 
    @start="handleStart" 
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBooks } from '@/composables/useBooks'
import BookList from '@/components/BookList.vue'

const { books, loadBooks } = useBooks()

onMounted(async () => {
  await loadBooks()
})

function handleStart(bookPath: string) {
  // 导航到阅读器
}
</script>
```

---

## 3. 模块设计

### 3.1 小说列表模块

**目录**: `src/components/BookList.*`

**职责**:
- 显示小说列表
- 处理点击事件
- 支持滚动加载

**依赖**:
- `useBooks` composable
- `BookCard` 展示组件

**接口**:
```typescript
interface BookListProps {
  books: BookInfo[]
}

interface BookListEmits {
  (e: 'start', bookPath: string): void
}
```

---

### 3.2 阅读器模块

**目录**: `src/components/Reader.*`

**职责**:
- 显示页面内容
- 显示背景图
- 显示文字内容
- 显示选择支

**依赖**:
- `useNavigation` composable
- `SelectionPanel` 组件
- `ImageViewer` 组件

**接口**:
```typescript
interface ReaderProps {
  page: Page
}

interface ReaderEmits {
  (e: 'select', targetId: string): void
}
```

---

### 3.3 选择面板模块

**目录**: `src/components/SelectionPanel.*`

**职责**:
- 显示所有选择支
- 处理用户点击
- 动画效果

**依赖**:
- 无（纯展示组件）

**接口**:
```typescript
interface SelectionPanelProps {
  selections: Selection[]
}

interface SelectionPanelEmits {
  (e: 'select', targetId: string): void
}
```

---

### 3.4 图片查看器模块

**目录**: `src/components/ImageViewer.*`

**职责**:
- 加载和显示图片
- 懒加载
- 错误处理

**依赖**:
- `useImageGeneration` composable

**接口**:
```typescript
interface ImageViewerProps {
  src: string
  alt: string
  lazy?: boolean
}
```

---

## 4. 状态管理

### 4.1 全局状态

使用 Vue 3 `reactive` 管理全局状态：

```typescript
// src/state/app.ts
import { reactive } from 'vue'

export interface AppState {
  currentBook: Book | null
  currentPage: Page | null
  history: string[]
}

export const appState = reactive<AppState>({
  currentBook: null,
  currentPage: null,
  history: []
})
```

---

### 4.2 局部状态

组件内部状态使用 `ref` 或 `reactive`:

```typescript
// 组件内部
const isLoading = ref(false)
const error = ref<string | null>(null)
```

---

### 4.3 持久化状态

使用 localStorage 持久化关键状态：

```typescript
// 阅读进度
interface PersistedProgress {
  bookPath: string
  pageId: string
  timestamp: number
}

// 保存
localStorage.setItem('progress', JSON.stringify(progress))

// 加载
const progress = JSON.parse(
  localStorage.getItem('progress') || 'null'
)
```

---

## 5. 文件组织

### 5.1 按功能组织

```
src/
├── components/          # 组件
│   ├── BookList/
│   │   ├── BookList.vue
│   │   ├── BookList.css
│   │   └── BookList.spec.ts
│   ├── Reader/
│   └── SelectionPanel/
├── composables/         # 组合式函数
│   ├── useBooks.ts
│   ├── useNavigation.ts
│   └── useImageGeneration.ts
├── types/              # 类型定义
│   ├── book.ts
│   └── api.ts
├── styles/             # 全局样式
│   ├── main.css
│   ├── responsive.css
│   └── variables.css
└── utils/              # 工具函数
    ├── path.ts
    └── image.ts
```

---

### 5.2 组件文件结构

每个组件独立目录，包含：

```
ComponentName/
├── ComponentName.vue      # 组件主文件
├── ComponentName.css      # 组件样式
├── ComponentName.spec.ts  # 组件测试（未来）
└── index.ts               # 导出文件
```

---

## 6. 样式架构

### 6.1 CSS 变量

使用 CSS 变量实现主题和响应式：

```css
/* src/styles/variables.css */
:root {
  /* 颜色 */
  --color-primary: #3498db;
  --color-text: #333;
  --color-bg: #fff;
  
  /* 字体 */
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-sm: 14px;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  /* 断点 */
  --breakpoint-sm: 320px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

---

### 6.2 响应式设计

```css
/* 移动端优先 */
.container {
  padding: var(--spacing-sm);
  font-size: var(--font-size-base);
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
    font-size: var(--font-size-lg);
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
}
```

---

## 7. 性能优化

### 7.1 代码分割

使用 Vite 的动态导入实现路由级别代码分割：

```typescript
// 懒加载组件
const Reader = defineAsyncComponent(
  () => import('@/components/Reader/Reader.vue')
)
```

---

### 7.2 图片优化

```typescript
// 懒加载
<img 
  v-if="inView" 
  :src="imageSrc" 
  alt="..." 
/>

// 使用 IntersectionObserver
const inView = ref(false)
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    inView.value = true
    observer.disconnect()
  }
})
```

---

### 7.3 缓存策略

```typescript
// 内存缓存
const pageCache = new Map<string, Page>()

async function getPage(path: string): Promise<Page> {
  // 检查缓存
  if (pageCache.has(path)) {
    return pageCache.get(path)!
  }
  
  // 加载数据
  const page = await loadPageFromServer(path)
  
  // 存入缓存
  pageCache.set(path, page)
  
  return page
}
```

---

## 8. 错误处理架构

### 8.1 全局错误边界

```vue
<!-- src/components/ErrorBoundary.vue -->
<template>
  <div v-if="error" class="error-fallback">
    <h2>发生错误</h2>
    <p>{{ error.message }}</p>
    <button @click="retry">重试</button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  logError(err) // 上报错误
  return false // 阻止错误冒泡
})

function retry() {
  error.value = null
  location.reload()
}
</script>
```

---

### 8.2 错误日志

```typescript
// src/utils/errorLogger.ts
export function logError(error: Error): void {
  console.error('[App Error]', error)
  
  // 生产环境可以上报到服务器
  if (import.meta.env.PROD) {
    // sendToServer(error)
  }
}
```

---

## 9. 测试架构（未来）

### 9.1 单元测试

使用 Vitest 测试 composables 和工具函数：

```typescript
// src/composables/useBooks.spec.ts
import { describe, it, expect } from 'vitest'
import { useBooks } from './useBooks'

describe('useBooks', () => {
  it('should load books list', async () => {
    const { books, loadBooks } = useBooks()
    await loadBooks()
    expect(books.value).toBeDefined()
  })
})
```

---

### 9.2 组件测试

使用 Vue Test Utils 测试组件：

```typescript
import { mount } from '@vue/test-utils'
import BookCard from './BookCard.vue'

describe('BookCard', () => {
  it('renders book info correctly', () => {
    const wrapper = mount(BookCard, {
      props: {
        title: 'Test Book',
        subtitle: 'Test Subtitle',
        cover: '/cover.jpg'
      }
    })
    expect(wrapper.text()).toContain('Test Book')
  })
})
```

---

### 9.3 E2E 测试

使用 Playwright 测试完整流程：

```typescript
import { test, expect } from '@playwright/test'

test('can start reading a book', async ({ page }) => {
  await page.goto('/')
  await page.click('text=开始')
  await expect(page.locator('.reader')).toBeVisible()
})
```

---

## 10. 部署架构

### 10.1 构建输出

```bash
npm run build
# 输出到 dist/ 目录
```

**dist/ 结构**:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
└── data/
    ├── books.json
    └── doomsday/
```

---

### 10.2 部署选项

**选项 1: 静态托管**
- Vercel
- Netlify
- GitHub Pages

**选项 2: 自建服务器**
```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/novelgame/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

**选项 3: 本地运行**
- 直接打开 `dist/index.html`
- 或使用 `npx serve dist`

---

## 11. 架构决策记录

### 11.1 为什么选择 Vue 3？

**决策日期**: 2026-04-05

**选项**:
1. Vue 3
2. React
3. Svelte

**选择**: Vue 3

**理由**:
- 组合式 API 适合状态管理
- 学习曲线低
- 类型支持好
- 生态成熟

---

### 11.2 为什么使用原生 CSS？

**决策日期**: 2026-04-05

**选项**:
1. 原生 CSS + CSS Variables
2. Tailwind CSS
3. Sass/Less

**选择**: 原生 CSS + CSS Variables

**理由**:
- 零依赖
- 运行时可定制
- 项目规模小，不需要大型框架
- CSS Variables 支持响应式主题

---

### 11.3 为什么数据用 JSON 而非数据库？

**决策日期**: 2026-04-05

**选项**:
1. JSON 文件
2. SQLite
3. 远程 API

**选择**: JSON 文件

**理由**:
- 零配置
- 易于版本控制
- 创作者可直接编辑
- 适合小型项目

---

## 12. 架构演进路线

### Phase 1 (v1.0)
- ✅ 基础架构搭建
- ✅ 核心组件实现
- ✅ 数据驱动设计

### Phase 2 (v1.1)
- [ ] 添加单元测试
- [ ] 添加 E2E 测试
- [ ] 性能优化

### Phase 3 (v1.2)
- [ ] 添加音效支持
- [ ] 添加角色立绘
- [ ] 添加动画效果

### Phase 4 (v2.0)
- [ ] 多语言支持
- [ ] 云端存档
- [ ] 创作者工具

---

## 13. 参考资料

- [Vue 3 架构最佳实践](https://vuejs.org/)
- [Composition API 设计模式](https://vuejs.org/guide/reusability/composables.html)
- [Vite 构建优化](https://vitejs.dev/guide/build.html)

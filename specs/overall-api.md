# 视觉小说游戏框架 - API 接口模型

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 接口概述

### 1.1 接口分类

本项目涉及两类接口：

1. **内部接口**: 前端组件之间的数据交互
2. **外部接口**: 与 bailian-image AI 服务的交互

### 1.2 设计原则

- **类型安全**: 所有接口必须有 TypeScript 类型定义
- **错误处理**: 所有接口必须处理异常情况
- **异步优先**: 所有 I/O 操作使用 Promise/async
- **缓存友好**: 接口设计支持缓存优化

---

## 2. 内部接口

### 2.1 小说数据接口

#### getBooksList()

**描述**: 获取小说列表

```typescript
/**
 * 获取小说列表
 * @returns 小说列表数据
 * @throws 当 books.json 不存在或格式错误时抛出错误
 */
async function getBooksList(): Promise<BooksList>
```

**实现位置**: `src/composables/useBooks.ts`

**错误码**:
- `BOOKS_FILE_NOT_FOUND`: books.json 文件不存在
- `BOOKS_INVALID_FORMAT`: books.json 格式错误

---

#### getBook(bookPath: string)

**描述**: 获取指定小说的框架数据

```typescript
/**
 * 获取小说框架
 * @param bookPath - 小说配置文件路径（相对路径）
 * @returns 小说框架数据
 * @throws 当文件不存在或格式错误时抛出错误
 */
async function getBook(bookPath: string): Promise<Book>
```

**实现位置**: `src/composables/useBooks.ts`

**错误码**:
- `BOOK_FILE_NOT_FOUND`: book.json 文件不存在
- `BOOK_INVALID_FORMAT`: book.json 格式错误

---

#### getPage(bookPath: string, pageJsonPath: string)

**描述**: 获取指定页面的内容

```typescript
/**
 * 获取页面内容
 * @param bookPath - 小说配置文件路径
 * @param pageJsonPath - 页面 JSON 文件路径（相对于 book.json 所在目录）
 * @returns 页面内容数据
 * @throws 当文件不存在或格式错误时抛出错误
 */
async function getPage(
  bookPath: string,
  pageJsonPath: string
): Promise<Page>
```

**实现位置**: `src/composables/useBooks.ts`

**错误码**:
- `PAGE_FILE_NOT_FOUND`: 页面 JSON 文件不存在
- `PAGE_INVALID_FORMAT`: 页面 JSON 格式错误

---

### 2.2 导航接口

#### navigateTo(pageId: string)

**描述**: 跳转到指定页面

```typescript
/**
 * 跳转到指定页面
 * @param pageId - 目标页面 ID
 * @returns 跳转后的页面数据
 * @throws 当目标页面不存在时抛出错误
 */
async function navigateTo(pageId: string): Promise<Page>
```

**实现位置**: `src/composables/useNavigation.ts`

**前置条件**: 
- 已加载 Book 数据
- 目标页面在 Book 结构中存在

**副作用**: 
- 更新当前页面状态
- 记录阅读历史

---

#### goBack()

**描述**: 返回上一页

```typescript
/**
 * 返回上一页
 * @returns 上一页的页面数据，如果没有历史则返回 null
 */
async function goBack(): Promise<Page | null>
```

**实现位置**: `src/composables/useNavigation.ts`

**返回值**: 
- `Page`: 成功返回上一页
- `null`: 没有历史记录

---

#### restart()

**描述**: 重新开始小说

```typescript
/**
 * 重新开始小说
 * @returns 小说第一页的数据
 */
async function restart(): Promise<Page>
```

**实现位置**: `src/composables/useNavigation.ts`

**副作用**: 
- 清空阅读历史
- 跳转到小说第一页

---

### 2.3 进度管理接口

#### saveProgress()

**描述**: 保存当前阅读进度

```typescript
/**
 * 保存阅读进度到 localStorage
 */
function saveProgress(): void
```

**实现位置**: `src/composables/useNavigation.ts`

**存储内容**:
- bookPath: 当前小说路径
- pageId: 当前页面 ID
- timestamp: 保存时间戳

---

#### loadProgress()

**描述**: 加载保存的阅读进度

```typescript
/**
 * 从 localStorage 加载阅读进度
 * @returns 阅读进度数据，如果没有保存的进度则返回 null
 */
function loadProgress(): ReadingProgress | null
```

**实现位置**: `src/composables/useNavigation.ts`

---

### 2.4 图片加载接口

#### loadImage(imagePath: string)

**描述**: 加载图片

```typescript
/**
 * 加载图片
 * @param imagePath - 图片路径（相对路径）
 * @returns 图片 URL（可以是 data URL 或 blob URL）
 * @throws 当图片加载失败时抛出错误
 */
async function loadImage(imagePath: string): Promise<string>
```

**实现位置**: `src/composables/useImageGeneration.ts`

**优化策略**:
- 已缓存的图片直接返回
- 支持懒加载
- 失败时返回默认占位图

---

#### preloadImages(imagePaths: string[])

**描述**: 预加载多张图片

```typescript
/**
 * 预加载图片列表
 * @param imagePaths - 图片路径列表
 * @returns 加载结果
 */
async function preloadImages(
  imagePaths: string[]
): Promise<Record<string, string>>
```

**实现位置**: `src/composables/useImageGeneration.ts`

**用途**: 预加载后续页面可能用到的背景图

---

## 3. 外部接口

### 3.1 bailian-image 接口

#### generateImage()

**描述**: 调用 bailian-image API 生成图片

```typescript
/**
 * 生成 AI 图片
 * @param prompt - 图片描述（不含 tags）
 * @param tags - 小说基础环境设定
 * @param options - 可选配置
 * @returns 生成的图片 URL
 * @throws 当生成失败时抛出错误
 */
async function generateImage(
  prompt: string,
  tags: string,
  options?: ImageGenerationOptions
): Promise<string>
```

**实现位置**: `src/composables/useImageGeneration.ts`

**请求参数**:

```typescript
interface ImageGenerationOptions {
  /** 图片尺寸，默认 "1328*1328" */
  size?: string
  
  /** 生成数量，默认 1 */
  n?: number
  
  /** 是否添加水印，默认 false */
  watermark?: boolean
  
  /** 是否启用 prompt 智能改写，默认 true */
  promptExtend?: boolean
  
  /** 反向提示词（不希望在画面中出现的内容） */
  negativePrompt?: string
}
```

**响应结构**:

```typescript
interface ImageGenerationResponse {
  /** 任务 ID */
  task_id: string
  
  /** 任务状态 */
  task_status: 'PENDING' | 'SUCCEEDED' | 'FAILED'
  
  /** 生成结果（仅当状态为 SUCCEEDED 时存在） */
  results?: Array<{
    /** 原始提示词 */
    orig_prompt: string
    
    /** 实际使用的提示词（可能经过智能改写） */
    actual_prompt: string
    
    /** 图片 URL */
    url: string
  }>
  
  /** 使用量统计 */
  usage?: {
    /** 生成的图片数量 */
    image_count: number
  }
}
```

**错误码**:
- `IMAGE_GENERATION_FAILED`: 生成失败
- `IMAGE_SERVICE_UNAVAILABLE`: 服务不可用
- `IMAGE_QUOTA_EXCEEDED`: 配额用尽

**实现示例**:

```typescript
async function generateImage(
  prompt: string,
  tags: string,
  options: ImageGenerationOptions = {}
): Promise<string> {
  // 组合完整提示词
  const fullPrompt = `${tags}, ${prompt}`
  
  // 调用 MCP 服务
  const task = await bailianImageGenerate({
    prompt: fullPrompt,
    size: options.size || '1328*1328',
    n: options.n || 1,
    watermark: options.watermark ?? false,
    prompt_extend: options.promptExtend ?? true,
    negative_prompt: options.negativePrompt || null
  })
  
  // 轮询任务状态
  const result = await pollTaskStatus(task.task_id)
  
  if (result.task_status !== 'SUCCEEDED') {
    throw new Error('Image generation failed')
  }
  
  // 返回图片 URL
  return result.results[0].url
}
```

---

#### pollTaskStatus()

**描述**: 轮询任务状态直到完成

```typescript
/**
 * 轮询任务状态
 * @param taskId - 任务 ID
 * @param options - 轮询配置
 * @returns 任务最终状态和结果
 * @throws 当轮询超时或失败时抛出错误
 */
async function pollTaskStatus(
  taskId: string,
  options?: PollOptions
): Promise<ImageGenerationResponse>
```

**实现位置**: `src/composables/useImageGeneration.ts`

**轮询配置**:

```typescript
interface PollOptions {
  /** 最大轮询次数，默认 30 */
  maxRetries?: number
  
  /** 轮询间隔（毫秒），默认 3000 */
  retryInterval?: number
  
  /** 超时时间（毫秒），默认 60000 */
  timeout?: number
}
```

---

## 4. 工具函数接口

### 4.1 路径工具

#### resolvePath()

**描述**: 解析相对路径

```typescript
/**
 * 解析相对路径
 * @param basePath - 基准文件路径
 * @param relativePath - 相对路径
 * @returns 解析后的绝对路径
 */
function resolvePath(basePath: string, relativePath: string): string
```

**实现位置**: `src/utils/path.ts`

**示例**:

```typescript
resolvePath(
  'public/data/doomsday/01/01/001.json',
  '../../images/bg001.jpg'
)
// 返回：'public/data/doomsday/images/bg001.jpg'
```

---

#### getBaseUrl()

**描述**: 获取基础 URL（用于开发/生产环境）

```typescript
/**
 * 获取基础 URL
 * @returns 基础 URL
 */
function getBaseUrl(): string
```

**实现位置**: `src/utils/path.ts`

**返回值**:
- 开发环境：`http://localhost:8002`
- 生产环境：相对路径（空字符串）

---

### 4.2 图片工具

#### compressImage()

**描述**: 压缩图片

```typescript
/**
 * 压缩图片
 * @param imageFile - 原始图片文件
 * @param options - 压缩配置
 * @returns 压缩后的图片 Blob
 */
async function compressImage(
  imageFile: File,
  options?: CompressOptions
): Promise<Blob>
```

**实现位置**: `src/utils/image.ts`

**压缩配置**:

```typescript
interface CompressOptions {
  /** 目标宽度，默认 1920 */
  maxWidth?: number
  
  /** 目标高度，默认 1080 */
  maxHeight?: number
  
  /** 压缩质量（0-1），默认 0.8 */
  quality?: number
  
  /** 输出格式，默认 'image/jpeg' */
  format?: string
}
```

---

## 5. 错误处理

### 5.1 错误类型定义

```typescript
// src/types/api.ts

/** 错误码枚举 */
export enum ErrorCode {
  // 数据错误
  BOOKS_FILE_NOT_FOUND = 'BOOKS_FILE_NOT_FOUND',
  BOOKS_INVALID_FORMAT = 'BOOKS_INVALID_FORMAT',
  BOOK_FILE_NOT_FOUND = 'BOOK_FILE_NOT_FOUND',
  BOOK_INVALID_FORMAT = 'BOOK_INVALID_FORMAT',
  PAGE_FILE_NOT_FOUND = 'PAGE_FILE_NOT_FOUND',
  PAGE_INVALID_FORMAT = 'PAGE_INVALID_FORMAT',
  
  // 导航错误
  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
  INVALID_PAGE_ID = 'INVALID_PAGE_ID',
  
  // 图片错误
  IMAGE_LOAD_FAILED = 'IMAGE_LOAD_FAILED',
  IMAGE_GENERATION_FAILED = 'IMAGE_GENERATION_FAILED',
  IMAGE_SERVICE_UNAVAILABLE = 'IMAGE_SERVICE_UNAVAILABLE',
  IMAGE_QUOTA_EXCEEDED = 'IMAGE_QUOTA_EXCEEDED',
  
  // 网络错误
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT'
}

/** 应用错误 */
export interface AppError {
  code: ErrorCode
  message: string
  details?: unknown
}
```

### 5.2 错误处理函数

```typescript
/**
 * 创建应用错误
 */
function createError(
  code: ErrorCode,
  message: string,
  details?: unknown
): AppError {
  return { code, message, details }
}

/**
 * 安全地执行异步操作
 */
async function safeExecute<T>(
  fn: () => Promise<T>,
  errorHandler: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    errorHandler(error as AppError)
    return null
  }
}
```

---

## 6. 接口使用示例

### 6.1 加载小说列表

```typescript
import { getBooksList } from '@/composables/useBooks'

try {
  const books = await getBooksList()
  console.log('可用小说:', books.books)
} catch (error) {
  console.error('加载小说列表失败:', error)
}
```

### 6.2 开始阅读

```typescript
import { getBook, getPage } from '@/composables/useBooks'

async function startReading(bookPath: string) {
  // 加载小说框架
  const book = await getBook(bookPath)
  
  // 获取第一页
  const firstPage = book.chapters[0].sections[0].pages[0]
  const pageData = await getPage(bookPath, firstPage.json)
  
  // 显示页面
  displayPage(pageData)
}
```

### 6.3 生成背景图

```typescript
import { generateImage } from '@/composables/useImageGeneration'

async function generateBackground(
  description: string,
  tags: string
): Promise<string> {
  try {
    const imageUrl = await generateImage(description, tags, {
      size: '1328*1328',
      negativePrompt: '文字，水印，签名'
    })
    return imageUrl
  } catch (error) {
    console.error('生成背景图失败:', error)
    // 返回默认背景图
    return '/images/default-bg.jpg'
  }
}
```

---

## 7. 接口变更历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-04-05 | 初始版本 |

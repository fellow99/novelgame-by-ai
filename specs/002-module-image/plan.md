# 图片模块实现方案

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 技术设计

### 1.1 Composable 设计

```typescript
// src/composables/useImageGeneration.ts
export function useImageGeneration() {
  const imageCache = new Map<string, string>()
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  async function generateImage(
    prompt: string,
    tags: string,
    options?: ImageOptions
  ): Promise<string> {
    // 1. 检查缓存
    const cacheKey = `${tags}_${prompt}`
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!
    }
    
    // 2. 调用 bailian-image
    const fullPrompt = `${tags}, ${prompt}`
    const task = await bailianImageGenerate({
      prompt: fullPrompt,
      size: options?.size || '1328*1328',
      n: options?.n || 1,
      watermark: false
    })
    
    // 3. 轮询任务状态
    const result = await pollTaskStatus(task.task_id)
    
    if (result.task_status !== 'SUCCEEDED') {
      throw new Error('Image generation failed')
    }
    
    // 4. 存入缓存
    const imageUrl = result.results[0].url
    imageCache.set(cacheKey, imageUrl)
    
    return imageUrl
  }
  
  async function pollTaskStatus(taskId: string) {
    // 轮询实现
  }
  
  return {
    generateImage,
    loading,
    error
  }
}
```

### 1.2 bailian-image MCP 调用

使用 skill_mcp 工具调用：

```typescript
import { skill_mcp } from '@/utils/mcp'

async function bailianImageGenerate(params: {
  prompt: string
  size: string
  n: number
  watermark: boolean
}) {
  const result = await skill_mcp({
    mcp_name: 'bailian-image',
    tool_name: 'generate_image',
    arguments: params
  })
  return JSON.parse(result)
}
```

---

## 2. 文件结构

```
src/
├── composables/
│   └── useImageGeneration.ts
├── components/
│   └── ImageViewer/
│       ├── ImageViewer.vue
│       └── ImageViewer.css
└── utils/
    └── image.ts
```

---

## 3. 实现步骤

### 3.1 创建 useImageGeneration.ts

1. 定义类型接口
2. 实现 generateImage 函数
3. 实现 pollTaskStatus 函数
4. 实现缓存逻辑
5. 实现错误处理

### 3.2 创建 ImageViewer 组件

1. 定义 props（src, alt, lazy）
2. 实现懒加载逻辑
3. 实现加载状态
4. 实现错误状态

### 3.3 集成到 App

1. 在 App.vue 中引入 useImageGeneration
2. 在 Reader 组件中使用 ImageViewer
3. 测试生图流程

---

## 4. 错误处理

### 4.1 错误类型

```typescript
enum ImageError {
  GENERATION_FAILED = 'GENERATION_FAILED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT'
}
```

### 4.2 降级方案

- 生图失败 → 显示默认背景色
- 加载失败 → 显示占位图
- 网络错误 → 提供重试按钮

---

## 5. 性能优化

### 5.1 缓存策略

- 内存缓存：Map 存储
- 会话持久化：localStorage（可选）

### 5.2 并发控制

- 最大并发：3 个任务
- 队列管理：FIFO

---

## 6. 测试计划

### 6.1 功能测试

- [ ] 生图功能正常
- [ ] 缓存命中正确
- [ ] 错误处理有效
- [ ] 懒加载工作

### 6.2 性能测试

- [ ] 首屏加载时间
- [ ] 缓存命中率
- [ ] 并发控制有效

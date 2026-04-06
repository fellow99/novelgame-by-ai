# 图片模块规格

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 模块概述

### 1.1 模块职责

图片模块负责：
- 调用 bailian-image MCP 服务生成图片
- 管理图片缓存
- 提供图片加载和显示功能
- 支持手动上传图片

### 1.2 核心功能

1. **AI 生图**: 根据描述和 tags 生成图片
2. **图片缓存**: 避免重复生成
3. **懒加载**: 优化首屏性能
4. **错误处理**: 生图失败时的降级方案

---

## 2. 功能需求

### 2.1 AI 生图

**FR-IMG-001**: 生成背景图
- 输入：图片描述 + 小说 tags
- 输出：图片 URL
- 要求：包含 tags 作为上下文

**FR-IMG-002**: 任务轮询
- 自动轮询任务状态
- 最大轮询 30 次
- 轮询间隔 3 秒

**FR-IMG-003**: 错误处理
- 生图失败时显示错误信息
- 提供重试按钮
- 降级到默认图片

### 2.2 图片缓存

**FR-IMG-004**: 内存缓存
- 使用 Map 存储已生成图片
- Key: prompt hash
- Value: 图片 URL

**FR-IMG-005**: 缓存验证
- 检查缓存是否有效
- 支持清除缓存

### 2.3 图片加载

**FR-IMG-006**: 懒加载
- 图片进入视域再加载
- 使用 IntersectionObserver

**FR-IMG-007**: 加载状态
- 显示加载占位符
- 显示加载进度（可选）

---

## 3. 接口设计

### 3.1 useImageGeneration

```typescript
interface UseImageGeneration {
  // 生成图片
  generateImage(
    prompt: string,
    tags: string,
    options?: ImageOptions
  ): Promise<string>
  
  // 加载图片
  loadImage(src: string): Promise<string>
  
  // 清除缓存
  clearCache(): void
}
```

### 3.2 ImageOptions

```typescript
interface ImageOptions {
  size?: string // "1328*1328"
  n?: number // 1
  watermark?: boolean // false
  negativePrompt?: string
}
```

---

## 4. 数据结构

### 4.1 生图请求

```typescript
interface GenerateRequest {
  prompt: string
  tags: string
  options: ImageOptions
}
```

### 4.2 生图响应

```typescript
interface GenerateResponse {
  task_id: string
  task_status: 'PENDING' | 'SUCCEEDED' | 'FAILED'
  results?: Array<{
    url: string
    prompt: string
  }>
}
```

---

## 5. 成功标准

- [ ] bailian-image 集成完成
- [ ] 生图功能正常工作
- [ ] 缓存机制有效
- [ ] 错误处理完善

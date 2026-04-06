# 图片模块规格

**版本**: v1.1.0  
**日期**: 2026-04-06  
**状态**: 已更新  

---

## 1. 模块概述

### 1.1 模块职责

图片模块负责：
- 使用「千问 - 文生图」Skill 生成图片（基于阿里云百炼 API）
- 管理图片存储和本地引用
- 提供图片加载和显示功能
- 支持手动上传图片作为替代方案

### 1.2 核心功能

1. **AI 生图**: 使用 Skill 根据描述和 tags 生成图片
2. **图片存储**: 生成的图片下载到本地项目目录
3. **懒加载**: 优化首屏性能
4. **错误处理**: 生图失败时的降级方案

---

## 2. 功能需求

### 2.1 AI 生图（使用 Skill）

**FR-IMG-001**: 生成背景图
- 输入：图片描述 + 小说 tags
- 输出：图片 URL（24 小时有效期）
- 要求：包含 tags 作为上下文
- 实现：通过「千问 - 文生图」Skill 调用阿里云百炼 API

**FR-IMG-002**: 图片下载与存储
- 生成的图片必须立即下载到本地
- 存储路径：`public/data/<小说名>/images/backgrounds/`
- 文件命名：使用描述性名称，如 `scene-<描述>-<序号>.png`
- 在 JSON 中引用本地路径而非远程 URL

**FR-IMG-003**: 错误处理
- 生图失败时显示错误信息（API 错误码）
- 提供重试按钮
- 降级到默认背景色或占位图
- URL 过期处理：检测到 403 时提示重新生成

### 2.2 图片存储管理

**FR-IMG-004**: 本地存储
- 生成的图片必须保存到项目本地
- 按小说分类存储
- 支持图片重命名和覆盖

**FR-IMG-005**: 存储验证
- 检查图片文件是否存在
- 文件不存在时提示重新生成或手动上传

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
  // 生成图片（调用 Skill）
  generateImage(
    prompt: string,
    tags: string,
    options?: ImageOptions
  ): Promise<{
    imageUrl: string  // 临时 URL（24 小时有效）
    localPath: string // 下载后的本地路径
  }>
  
  // 下载图片到本地
  downloadImage(url: string, localPath: string): Promise<void>
  
  // 加载本地图片
  loadLocalImage(src: string): Promise<string>
}
```

### 3.2 ImageOptions

```typescript
interface ImageOptions {
  model?: string // "qwen-image-2.0-pro"
  size?: string // "2048*2048"
  n?: number // 1
  watermark?: boolean // false
  promptExtend?: boolean // true
  negativePrompt?: string
}
```

### 3.3 Skill 调用方式

```bash
# 使用 curl 调用阿里云百炼 API
./skills/qwen-image/generate-image.sh "<prompt>" <model> <size> <n>
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

### 4.2 生图响应（阿里云百炼 API）

```typescript
interface GenerateResponse {
  request_id: string
  output: {
    choices: Array<{
      message: {
        content: Array<{
          image: string // 临时 URL
        }>
      }
    }>
  }
  usage: {
    width: number
    height: number
    image_count: number
  }
}
```

### 4.3 本地图片存储结构

```
public/data/<小说名>/images/
├── cover.jpg                    # 封面图
└── backgrounds/                 # 背景图目录
    ├── street-ruined-01.png     # 街道场景
    ├── building-interior-01.png # 建筑内部
    └── wilderness-01.png        # 荒野场景
```

---

## 5. 成功标准

- [ ] 千问 - 文生图 Skill 集成完成
- [ ] 生图功能正常工作（curl 调用）
- [ ] 图片下载并存储到本地
- [ ] 错误处理完善

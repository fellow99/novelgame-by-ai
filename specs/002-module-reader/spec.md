# 阅读器模块规格

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 模块概述

### 1.1 模块职责

阅读器模块负责：
- 显示小说页面内容
- 显示背景图片
- 显示文字内容
- 显示选择支面板
- 处理用户交互

### 1.2 核心组件

1. **Reader**: 主阅读器组件
2. **SelectionPanel**: 选择支面板
3. **ImageViewer**: 图片查看器

---

## 2. 功能需求

### 2.1 页面显示

**FR-READER-001**: 显示背景图
- 全屏幕背景
- 自适应屏幕尺寸
- 加载失败时显示默认背景色

**FR-READER-002**: 显示文字内容
- 支持多段落
- 支持换行
- 字体大小响应式

**FR-READER-003**: 显示页标题
- 可选显示
- 位于内容区顶部

### 2.2 交互功能

**FR-READER-004**: 选择支显示
- 显示所有可选选项
- 每个选项显示 icon 和 text
- 支持 hover 效果

**FR-READER-005**: 选择处理
- 点击选项触发事件
- 传递目标页 ID 给父组件

---

## 3. 接口设计

### 3.1 Reader Props

```typescript
interface ReaderProps {
  page: Page
}

interface ReaderEmits {
  (e: 'select', targetId: string): void
}
```

### 3.2 SelectionPanel Props

```typescript
interface SelectionPanelProps {
  selections: Selection[]
}

interface SelectionPanelEmits {
  (e: 'select', targetId: string): void
}
```

---

## 4. 样式要求

### 4.1 响应式

- **移动端**: 字体 14px，padding 16px
- **平板**: 字体 16px，padding 24px
- **桌面**: 字体 18px，最大宽度 800px

### 4.2 视觉风格

- 背景遮罩：rgba(0, 0, 0, 0.4)
- 文字颜色：白色
- 选择支按钮：半透明白色背景

---

## 5. 成功标准

- [ ] Reader 组件正常工作
- [ ] SelectionPanel 组件正常工作
- [ ] 响应式布局正确
- [ ] 交互流畅

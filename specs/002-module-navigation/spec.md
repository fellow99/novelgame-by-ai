# 导航模块规格

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 模块概述

### 1.1 模块职责

导航模块负责：
- 管理页面跳转
- 管理阅读历史
- 管理阅读进度
- 提供导航功能（前进、后退、重新开始）

### 1.2 核心功能

1. **页面跳转**: navigateTo(pageId)
2. **返回**: goBack()
3. **重新开始**: restart()
4. **进度保存**: saveProgress(), loadProgress()

---

## 2. 功能需求

### 2.1 导航功能

**FR-NAV-001**: 跳转到指定页
- 输入：目标页 ID
- 输出：目标页数据
- 要求：验证目标页存在

**FR-NAV-002**: 返回上一页
- 输出：上一页数据或 null
- 要求：维护历史栈

**FR-NAV-003**: 重新开始
- 输出：小说第一页
- 要求：清空历史

### 2.2 进度管理

**FR-NAV-004**: 保存进度
- 存储：localStorage
- 内容：bookPath, pageId, timestamp

**FR-NAV-005**: 加载进度
- 读取：localStorage
- 返回：进度数据或 null

---

## 3. 接口设计

### 3.1 useNavigation

```typescript
interface UseNavigation {
  currentPage: Ref<Page | null>
  history: Ref<string[]>
  
  navigateTo(pageId: string): Promise<Page | null>
  goBack(): Promise<Page | null>
  restart(): Promise<Page | null>
  saveProgress(): void
  loadProgress(): ReadingProgress | null
}
```

---

## 4. 数据结构

### 4.1 阅读进度

```typescript
interface ReadingProgress {
  bookPath: string
  pageId: string
  timestamp: number
}
```

---

## 5. 成功标准

- [ ] useNavigation composable 完成
- [ ] 导航功能正常
- [ ] 进度保存正常
- [ ] 历史记录正确

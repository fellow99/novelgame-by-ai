# 视觉小说游戏框架 - 架构实现任务

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 任务列表

### Phase 1: 基础架构搭建

- [ ] T001 创建 Vite + Vue3 + TypeScript 项目
- [ ] T002 配置 vite.config.ts（host: 0.0.0.0, port: 8002）
- [ ] T003 配置 tsconfig.json（严格模式）
- [ ] T004 创建目录结构（components, composables, types, styles, utils）
- [ ] T005 创建全局样式文件（main.css, responsive.css, variables.css）

### Phase 2: 类型定义

- [ ] T006 [P] 创建 book.ts 类型定义文件
- [ ] T007 [P] 创建 api.ts 类型定义文件

### Phase 3: 工具函数

- [ ] T008 [P] 实现 path.ts 路径工具（resolvePath, getBaseUrl）
- [ ] T009 [P] 实现 image.ts 图片工具（compressImage, loadImage）

### Phase 4: Composables

- [ ] T010 [useBooks] 实现 useBooks.ts（loadBooks, loadBook, loadPage）
- [ ] T011 [useNavigation] 实现 useNavigation.ts（navigateTo, goBack, restart）
- [ ] T012 [useImage] 实现 useImageGeneration.ts（generateImage, pollTaskStatus）

### Phase 5: 基础组件

- [ ] T013 [SelectionPanel] 创建 SelectionPanel.vue 组件
- [ ] T014 [ImageViewer] 创建 ImageViewer.vue 组件

### Phase 6: 核心组件

- [ ] T015 [BookList] 创建 BookList.vue 组件（封面背景、标题、副标题、开始按钮）
- [ ] T016 [Reader] 创建 Reader.vue 组件（背景图、文字内容、选择面板）

### Phase 7: 应用集成

- [ ] T017 创建 App.vue 根组件
- [ ] T018 创建 main.ts 入口文件
- [ ] T019 创建 index.html

### Phase 8: 数据文件

- [ ] T020 [P] 创建 public/data/books.json
- [ ] T021 [P] 创建 public/data/doomsday/book.json
- [ ] T022 [P] 创建 public/data/doomsday/01/01/*.json 页面文件
- [ ] T023 [P] 创建 public/data/doomsday/images/ 图片目录

### Phase 9: 测试验证

- [ ] T024 运行 npm run build 验证编译
- [ ] T024 运行 npm run dev 启动开发服务器
- [ ] T025 手动测试小说列表显示
- [ ] T026 手动测试点击"开始"进入游戏
- [ ] T027 手动测试页面阅读和选择跳转
- [ ] T028 手动测试响应式布局（PC、平板、移动端）

---

## 依赖关系

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9
```

---

## 并行执行机会

- T006, T007 可并行
- T008, T009 可并行
- T013, T014 可并行
- T020, T021, T022, T023 可并行

---

## 实施策略

1. **MVP 优先**: 先完成核心功能（BookList, Reader, SelectionPanel）
2. **增量交付**: 每个 Phase 完成后验证
3. **测试驱动**: 手动测试每个功能点

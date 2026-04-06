# 视觉小说游戏框架

一个基于 Vite + Vue3 的轻量级视觉小说游戏框架，支持 AI 图像生成。

## 特性

- 📖 **数据驱动**: 通过 JSON 文件创作小说，无需编程
- 🎨 **AI 生图**: 集成 bailian-image 服务，自动生成背景图
- 📱 **响应式**: 支持 PC、平板、移动端
- ⚡ **快速启动**: Vite 极速开发体验
- 🎯 **类型安全**: 完整的 TypeScript 类型定义

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
# 访问 http://localhost:8002
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
# 访问 http://localhost:8003
```

## 项目结构

```
novelgame/
├── public/data/          # 小说数据
│   ├── books.json        # 小说列表
│   └── doomsday/         # 《末日》小说
│       ├── book.json     # 小说框架
│       └── 01/01/        # 章节内容
├── src/
│   ├── components/       # Vue 组件
│   ├── composables/      # 组合式函数
│   ├── types/            # TypeScript 类型
│   └── styles/           # 样式文件
└── specs/                # 规范文档
```

## 创作小说

### 1. 复制示例

```bash
cp -r public/data/doomsday public/data/my-novel
```

### 2. 修改配置

编辑 `public/data/my-novel/book.json`，设置小说标题、tags 等。

### 3. 编写内容

在对应章节目录下创建 JSON 文件，格式参考示例。

### 4. 添加到列表

编辑 `public/data/books.json`，添加新小说信息。

## 数据结构

### 页面 JSON

```json
{
  "id": "01-01-001",
  "title": "页标题",
  "background": "背景图路径",
  "content": "文字内容",
  "selections": [
    {
      "icon": "🚪",
      "text": "打开门",
      "to": "01-01-002"
    }
  ]
}
```

## 技术栈

- **Vue 3** - 前端框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具
- **bailian-image** - AI 图像生成

## 文档

详细规范文档见 `specs/` 目录：

- `constitution.md` - 项目宪法
- `overall-spec.md` - 整体规格
- `overall-plan.md` - 技术方案
- `overall-data-model.md` - 数据模型
- `overall-api.md` - 接口模型

## 示例小说《末日》

框架包含一部示例小说《末日》，讲述末日生存环境中的抉择故事。

**已完成**:
- ✅ 完整故事大纲（50 页剧情 + 5 个结局）
- ✅ 第 1 章：觉醒 (32 页)
- ✅ 第 2 章：废土求生 (20 页)
- ✅ 多分支剧情设计
- ✅ 50+ 个页面内容

**剧情特色**:
- 📖 多分支叙事
- 🎯 关键抉择影响结局
- 5️⃣ 个不同结局（新生、孤独行者、牺牲、黑暗王者、希望之光）

## 开发计划

- [x] 完整的第一章内容（32 页）
- [x] 第二章内容（20 页）
- [ ] 第 3-5 章内容
- [ ] 5 个结局页面
- [ ] AI 生图功能集成
- [ ] 阅读进度保存

## License

MIT

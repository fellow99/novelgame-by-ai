# 视觉小说游戏框架 - 数据模型

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. 核心实体

### 1.1 BookInfo（小说信息）

**描述**: 小说列表中的单部小说信息

```typescript
interface BookInfo {
  /** 小说标题 */
  title: string
  
  /** 小说子标题 */
  subtitle: string
  
  /** 封面图片路径（相对路径） */
  cover: string
  
  /** 小说配置文件路径（相对路径） */
  path: string
}
```

**约束**:
- `title`: 必填，1-50 字符
- `subtitle`: 可选，0-100 字符
- `cover`: 必填，相对路径，指向图片文件
- `path`: 必填，相对路径，格式为 `<小说英文名>/book.json`

---

### 1.2 BooksList（小说列表）

**描述**: 小说列表索引文件

```typescript
interface BooksList {
  books: BookInfo[]
}
```

**存储位置**: `public/data/books.json`

---

### 1.3 Book（小说框架）

**描述**: 单部小说的完整结构定义

```typescript
interface Book {
  /** 小说标题 */
  title: string
  
  /** 小说子标题 */
  subtitle: string
  
  /** 封面图片路径（相对路径） */
  cover: string
  
  /** 小说基础环境设定（用于 AI 生图） */
  tags: string
  
  /** 章节列表 */
  chapters: Chapter[]
  
  /** 物品列表（全局物品定义） */
  items?: Item[]
}
```

**约束**:
- `title`: 必填，1-50 字符
- `subtitle`: 可选，0-100 字符
- `cover`: 必填，相对路径
- `tags`: 必填，用于 AI 生图的上下文描述，建议 10-100 字符
- `chapters`: 必填，至少包含 1 个章节

**存储位置**: `public/data/<小说英文名>/book.json`

---

### 1.4 Chapter（章）

**描述**: 小说的章节结构

```typescript
interface Chapter {
  /** 章 ID（格式：两位数字，如 "01"） */
  id: string
  
  /** 章标题 */
  title: string
  
  /** 节列表 */
  sections: Section[]
}
```

**约束**:
- `id`: 必填，格式为 `\d{2}`（两位数字）
- `title`: 必填，1-50 字符
- `sections`: 必填，至少包含 1 个节

---

### 1.5 Section（节）

**描述**: 章下的节结构

```typescript
interface Section {
  /** 节 ID（格式：章 ID-两位数字，如 "01-01"） */
  id: string
  
  /** 节标题 */
  title: string
  
  /** 页列表 */
  pages: PageRef[]
}
```

**约束**:
- `id`: 必填，格式为 `\d{2}-\d{2}`
- `title`: 必填，1-50 字符
- `pages`: 必填，至少包含 1 个页

---

### 1.6 PageRef（页引用）

**描述**: 节的页引用

```typescript
interface PageRef {
  /** 页 ID（格式：章 ID-节 ID-三位数字，如 "01-01-001"） */
  id: string
  
  /** 页标题 */
  title: string
  
  /** 页 JSON 文件路径（相对路径） */
  json: string
}
```

**约束**:
- `id`: 必填，格式为 `\d{2}-\d{2}-\d{3}`
- `title`: 必填，1-50 字符
- `json`: 必填，相对路径，格式为 `<章>/<节>/<页>.json`

---

### 1.7 Page（页内容）

**描述**: 小说的单页内容

```typescript
interface Page {
  /** 页 ID（格式：章 ID-节 ID-三位数字） */
  id: string
  
  /** 页标题 */
  title: string
  
  /** 背景图片路径（相对路径） */
  background: string
  
  /** 文字内容 */
  content: string
  
  /** 血量变化（可选，正数为加血，负数为扣血） */
  hp?: number
  
  /** 选择支列表 */
  selections: Selection[]
  
  /** 可拾取物品列表（可选） */
  items?: string[]
}
```

**约束**:
- `id`: 必填，与 PageRef.id 一致
- `title`: 必填，1-50 字符
- `background`: 必填，相对路径，指向背景图片
- `content`: 必填，1-10000 字符
- `hp`: 可选，整数，范围 -10 到 10
- `selections`: 必填，可以是空数组（表示本页无选择支）
- `items`: 可选，数组长度 0-2，每个元素必须是 Book.items 中存在的物品 ID

**约束**:
- `id`: 必填，与 PageRef.id 一致
- `title`: 必填，1-50 字符
- `background`: 必填，相对路径，指向背景图片
- `content`: 必填，1-10000 字符
- `selections`: 必填，可以是空数组（表示本页无选择支）

**存储位置**: `public/data/<小说英文名>/<章>/<节>/<页>.json`

---

### 1.8 Selection（选择支）

**描述**: 用户可做的选择

```typescript
interface Selection {
  /** 选项图标（emoji） */
  icon: string
  
  /** 选项描述文字 */
  text: string
  
  /** 目标页 ID（格式：章 ID-节 ID-三位数字） */
  to: string
  
  /** 所需物品 ID（可选，只有拥有该物品时才显示此选项） */
  use?: string
}
```

---

### 1.9 Item（物品）

**描述**: 小说中的物品定义

```typescript
interface Item {
  /** 物品唯一标识 */
  id: string
  
  /** 物品名称 */
  name: string
  
  /** 物品类型（可选） */
  type?: 'tool' | 'food' | 'weapon' | 'key' | 'other'
  
  /** 食用后恢复的血量（仅食物类物品） */
  hp?: number
  
  /** 物品图标（emoji，可选） */
  icon?: string
  
  /** 物品描述（可选） */
  description?: string
}
```

**约束**:
- `id`: 必填，全局唯一标识符
- `name`: 必填，1-50 字符
- `type`: 可选，默认值为 `'other'`
- `hp`: 可选，仅当 `type` 为 `'food'` 时有效，正整数
- `icon`: 可选，单个 emoji 字符
- `description`: 可选，0-200 字符

---

### 1.10 PageItem（页面物品）

**描述**: 页面中可拾取的物品

```typescript
interface PageItem {
  /** 物品 ID（必须在 Book.items 中定义） */
  id: string
  
  /** 是否已拾取（运行时状态，不持久化到 JSON） */
  picked?: boolean
}
```

**约束**:
- `id`: 必填，必须引用 Book.items 中存在的物品 ID

**约束**:
- `icon`: 必填，单个 emoji 字符
- `text`: 必填，1-50 字符
- `to`: 必填，必须是有效的页 ID 格式，且目标页存在

---

## 2. 实体关系图

```
BooksList
  └── books: BookInfo[]
        └── path → Book.path

Book
  └── chapters: Chapter[]
        └── sections: Section[]
              └── pages: PageRef[]
                    └── json → Page.id

Page
  └── selections: Selection[]
        └── to → Page.id (循环引用)
```

---

## 3. 路径规则

### 3.1 相对路径基准

所有 JSON 文件中的路径字段都是**相对于该 JSON 文件所在目录**的相对路径。

**示例**:
```
文件位置：public/data/doomsday/01/01/001.json
字段值：background: "../../images/bg001.jpg"
解析结果：public/data/doomsday/images/bg001.jpg
```

### 3.2 路径格式

- **目录分隔符**: 使用正斜杠 `/`
- **文件扩展名**: 必须包含（.jpg, .png, .json 等）
- **大小写**: 路径区分大小写

### 3.3 路径校验规则

```typescript
// 路径格式正则
const RELATIVE_PATH_PATTERN = /^(\.\.\/|[^/])+/

// 页 ID 格式正则
const PAGE_ID_PATTERN = /^\d{2}-\d{2}-\d{3}$/

// 章 ID 格式正则
const CHAPTER_ID_PATTERN = /^\d{2}$/

// 节 ID 格式正则
const SECTION_ID_PATTERN = /^\d{2}-\d{2}$/
```

---

## 4. 数据类型定义

### 4.1 完整类型定义文件

```typescript
// src/types/book.ts

/** 小说信息 */
export interface BookInfo {
  title: string
  subtitle: string
  cover: string
  path: string
}

/** 小说列表 */
export interface BooksList {
  books: BookInfo[]
}

/** 物品类型 */
export type ItemType = 'tool' | 'food' | 'weapon' | 'key' | 'other'

/** 物品 */
export interface Item {
  id: string
  name: string
  type?: ItemType
  hp?: number
  icon?: string
  description?: string
}

/** 小说框架 */
export interface Book {
  title: string
  subtitle: string
  cover: string
  tags: string
  chapters: Chapter[]
  items?: Item[]
}

/** 章 */
export interface Chapter {
  id: string
  title: string
  sections: Section[]
}

/** 节 */
export interface Section {
  id: string
  title: string
  pages: PageRef[]
}

/** 页引用 */
export interface PageRef {
  id: string
  title: string
  json: string
}

/** 页内容 */
export interface Page {
  id: string
  title: string
  background: string
  content: string
  hp?: number
  selections: Selection[]
  items?: string[]
}

/** 选择支 */
export interface Selection {
  icon: string
  text: string
  to: string
  use?: string
}

/** 阅读进度 */
export interface ReadingProgress {
  bookPath: string
  pageId: string
  timestamp: number
}
```

---

## 5. 数据验证

### 5.1 验证规则

所有数据文件在加载时必须通过以下验证：

1. **JSON 格式**: 必须是有效的 JSON
2. **必填字段**: 所有必填字段必须存在
3. **类型正确**: 字段类型必须匹配定义
4. **格式正确**: ID、路径等必须符合格式
5. **引用存在**: 所有引用必须指向有效的目标

### 5.2 验证函数示例

```typescript
// src/utils/validation.ts

export function validateBook(book: unknown): ValidationResult {
  const errors: string[] = []
  
  if (!isObject(book)) {
    return { valid: false, errors: ['Book must be an object'] }
  }
  
  // 检查必填字段
  if (!book.title) errors.push('Missing required field: title')
  if (!book.tags) errors.push('Missing required field: tags')
  if (!book.chapters) errors.push('Missing required field: chapters')
  
  // 验证章节结构
  if (Array.isArray(book.chapters)) {
    book.chapters.forEach((chapter, index) => {
      if (!/^\d{2}$/.test(chapter.id)) {
        errors.push(`Chapter ${index} has invalid id format`)
      }
      // ... 更多验证
    })
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## 6. 示例数据

### 6.1 books.json 示例

```json
{
  "books": [
    {
      "title": "末日",
      "subtitle": "生存与抉择",
      "cover": "doomsday/images/cover.jpg",
      "path": "doomsday/book.json"
    }
  ]
}
```

### 6.2 book.json 示例

```json
{
  "title": "末日",
  "subtitle": "生存与抉择",
  "cover": "images/cover.jpg",
  "tags": "末日废土风格，灰暗天空，破碎建筑，荒凉城市，生存挑战",
  "chapters": [
    {
      "id": "01",
      "title": "觉醒",
      "sections": [
        {
          "id": "01-01",
          "title": "陌生的清晨",
          "pages": [
            {
              "id": "01-01-001",
              "title": "睁开眼睛",
              "json": "01/01/001.json"
            },
            {
              "id": "01-01-002",
              "title": "走出房间",
              "json": "01/01/002.json"
            }
          ]
        }
      ]
    }
  ],
  "items": [
    {
      "id": "key-for-01-01-001",
      "name": "某个地方的门钥匙",
      "type": "key",
      "icon": "🔑",
      "description": "一把生锈的钥匙"
    },
    {
      "id": "gun",
      "name": "手枪",
      "type": "weapon",
      "icon": "🔫",
      "description": "一把还有几发子弹的手枪"
    },
    {
      "id": "bread",
      "name": "面包",
      "type": "food",
      "hp": 2,
      "icon": "🍞",
      "description": "一块还没过期的面包"
    }
  ]
}
```

### 6.3 页面 JSON 示例

```json
{
  "id": "01-01-001",
  "title": "睁开眼睛",
  "background": "../../images/bg001.jpg",
  "content": "你缓缓睁开眼睛，发现自己躺在一张破旧的床上。阳光透过破碎的窗帘缝隙照进来，在地板上投下斑驳的光影。空气中弥漫着灰尘和霉变的味道。\n\n这是哪里？你完全不记得了。",
  "hp": -1,
  "items": ["bread"],
  "selections": [
    {
      "icon": "🛏️",
      "text": "坐起来",
      "to": "01-01-002"
    },
    {
      "icon": "👀",
      "text": "再躺一会儿",
      "to": "01-01-003"
    },
    {
      "icon": "🔑",
      "text": "用钥匙打开门",
      "use": "key-for-01-01-001",
      "to": "01-01-004"
    }
  ]
}
```

**说明**:
- `hp: -1`: 进入此页面后扣 1 点血
- `items: ["bread"]`: 页面中有一个可拾取的面包
- `use`: 该选项需要拥有指定物品才显示

---

## 7. 状态管理模型

### 7.1 应用状态

```typescript
interface AppState {
  /** 当前阅读的小说 */
  currentBook: Book | null
  
  /** 当前阅读的页面 */
  currentPage: Page | null
  
  /** 阅读历史（用于返回功能） */
  history: string[]
  
  /** 当前所在书籍路径 */
  currentBookPath: string | null
}
```

---

### 7.2 游戏状态（HP 和物品）

```typescript
interface GameState {
  /** 当前血量，初始值为 10 */
  hp: number
  
  /** 最大血量 */
  maxHp: number
  
  /** 当前拥有的物品 ID 列表 */
  inventory: string[]
  
  /** 已拾取的物品（用于追踪页面物品拾取状态） */
  pickedItems: string[]
  
  /** 是否死亡 */
  isDead: boolean
}
```

**状态规则**:
- `hp`: 初始值为 10，范围 0-100
- `hp <= 0`: 触发死亡结局
- `inventory`: 存储已获得的物品 ID
- `pickedItems`: 存储已拾取的页面物品 ID（防止重复拾取）
- `isDead`: 当 `hp <= 0` 时设置为 `true`

---

### 7.3 游戏状态操作

```typescript
interface GameActions {
  /** 修改血量 */
  modifyHp(amount: number): void
  
  /** 拾取物品 */
  pickItem(itemId: string): void
  
  /** 使用物品（如食用食物） */
  useItem(itemId: string): void
  
  /** 检查是否拥有某物品 */
  hasItem(itemId: string): boolean
  
  /** 重置游戏状态 */
  reset(): void
}
```

### 7.2 状态变迁

```
初始状态: { currentBook: null, currentPage: null, history: [] }
↓ 选择小说
{ currentBook: Book, currentPage: null, history: [] }
↓ 加载第一页
{ currentBook: Book, currentPage: Page, history: [] }
↓ 做出选择
{ currentBook: Book, currentPage: NewPage, history: [oldPageId] }
```

---

## 8. 缓存模型

### 8.1 内存缓存

```typescript
interface Cache {
  /** 已加载的小说 */
  books: Map<string, Book>
  
  /** 已加载的页面 */
  pages: Map<string, Page>
  
  /** 已生成的图片 */
  images: Map<string, string> // prompt -> URL
}
```

### 8.2 持久化缓存（localStorage）

```typescript
interface PersistedState {
  /** 阅读进度 */
  progress: ReadingProgress
  
  /** 缓存的图片 URL */
  imageCache: Record<string, string>
}
```

---

## 9. 数据变更历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-04-05 | 初始版本 |
| v1.1.0 | 2026-04-05 | 增加 HP 和物品机制：添加 Item 类型、Page.hp 字段、Selection.use 字段、GameState 状态管理 |

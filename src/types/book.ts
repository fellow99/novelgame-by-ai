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

/** 游戏状态（HP 和物品） */
export interface GameState {
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

/** 游戏状态操作 */
export interface GameActions {
  /** 修改血量 */
  modifyHp: (amount: number) => void
  /** 拾取物品 */
  pickItem: (itemId: string) => void
  /** 使用物品（如食用食物） */
  useItem: (itemId: string) => void
  /** 检查是否拥有某物品 */
  hasItem: (itemId: string) => boolean
  /** 重置游戏状态 */
  reset: () => void
}

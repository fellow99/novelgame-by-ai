# 导航模块实现方案

**版本**: v1.0.0  
**日期**: 2026-04-05  
**状态**: 初稿  

---

## 1. Composable 设计

### 1.1 useNavigation.ts

```typescript
import { ref } from 'vue'
import type { Book, Page } from '@/types/book'

export function useNavigation(
  book: Ref<Book | null>,
  bookPath: Ref<string>,
  loadPage: (bookPath: string, pageJsonPath: string) => Promise<Page | null>
) {
  const currentPage = ref<Page | null>(null)
  const history = ref<string[]>([])
  
  async function navigateTo(pageId: string): Promise<Page | null> {
    if (!book.value) return null
    
    // 查找目标页
    const pageRef = findPageById(book.value, pageId)
    if (!pageRef) {
      console.error('Page not found:', pageId)
      return null
    }
    
    // 记录历史
    if (currentPage.value) {
      history.value.push(currentPage.value.id)
    }
    
    // 加载页面
    return await loadPage(bookPath.value, pageRef.json)
  }
  
  async function goBack(): Promise<Page | null> {
    if (history.value.length === 0) return null
    
    const prevId = history.value.pop()!
    return await navigateTo(prevId)
  }
  
  async function restart(): Promise<Page | null> {
    if (!book.value) return null
    
    history.value = []
    const firstPage = book.value.chapters[0].sections[0].pages[0]
    return await loadPage(bookPath.value, firstPage.json)
  }
  
  function saveProgress() {
    if (!currentPage.value) return
    
    const progress = {
      bookPath: bookPath.value,
      pageId: currentPage.value.id,
      timestamp: Date.now()
    }
    localStorage.setItem('novel-progress', JSON.stringify(progress))
  }
  
  function loadProgress() {
    const data = localStorage.getItem('novel-progress')
    return data ? JSON.parse(data) : null
  }
  
  return {
    currentPage,
    history,
    navigateTo,
    goBack,
    restart,
    saveProgress,
    loadProgress
  }
}

function findPageById(book: Book, pageId: string) {
  for (const chapter of book.chapters) {
    for (const section of chapter.sections) {
      for (const page of section.pages) {
        if (page.id === pageId) return page
      }
    }
  }
  return null
}
```

---

## 2. 实现步骤

1. 创建 useNavigation.ts
2. 实现 navigateTo 函数
3. 实现 goBack 函数
4. 实现 restart 函数
5. 实现进度管理函数
6. 集成到 App.vue

---

## 3. 测试计划

- [ ] 测试页面跳转
- [ ] 测试返回功能
- [ ] 测试重新开始
- [ ] 测试进度保存
- [ ] 测试进度加载

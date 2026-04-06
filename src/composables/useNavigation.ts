import { ref } from 'vue'
import type { Ref } from 'vue'
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
    
    // Find target page
    const pageRef = findPageById(book.value, pageId)
    if (!pageRef) {
      console.error('Page not found:', pageId)
      return null
    }
    
    // Record history
    if (currentPage.value) {
      history.value.push(currentPage.value.id)
    }
    
    // Load page
    currentPage.value = await loadPage(bookPath.value, pageRef.json)
    return currentPage.value
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
    currentPage.value = await loadPage(bookPath.value, firstPage.json)
    return currentPage.value
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

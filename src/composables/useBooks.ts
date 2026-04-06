import { ref } from 'vue'
import type { BooksList, Book, Page } from '@/types/book'
import { resolvePath } from '@/utils/path'

export function useBooks() {
  const books = ref<BooksList | null>(null)
  const currentBook = ref<Book | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadBooks(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('./data/books.json')
      if (!response.ok) {
        throw new Error('Failed to load books list')
      }
      books.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Error loading books:', error.value)
    } finally {
      loading.value = false
    }
  }

  async function loadBook(bookPath: string): Promise<Book | null> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`./data/${bookPath}`)
      if (!response.ok) {
        throw new Error('Failed to load book')
      }
      currentBook.value = await response.json()
      return currentBook.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Error loading book:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function loadPage(bookPath: string, pageJsonPath: string): Promise<Page | null> {
    loading.value = true
    error.value = null
    try {
      const bookDir = bookPath.substring(0, bookPath.lastIndexOf('/'))
      const pagePath = `./data/${bookDir}/${pageJsonPath}`
      const response = await fetch(pagePath)
      if (!response.ok) {
        throw new Error('Failed to load page')
      }
      const page = await response.json()
      return page
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Error loading page:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    currentBook,
    loading,
    error,
    loadBooks,
    loadBook,
    loadPage
  }
}

<template>
  <div id="app">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <book-list 
      v-else-if="currentView === 'list'" 
      :books="books?.books || []" 
      @start="handleStart" 
      @continue="handleContinue"
    />
    <reader 
      v-else-if="currentView === 'reader' && currentPage" 
      :page="currentPage" 
      :book="currentBook"
      :book-path="currentBookPath"
      @select="handleSelect"
      @death="handleDeath" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BookList from './components/BookList/BookList.vue'
import Reader from './components/Reader/Reader.vue'
import { useBooks } from './composables/useBooks'
import { useSaveSystem } from './composables/useSaveSystem'
import type { Book, Page } from './types/book'

const { books, loadBooks, loadBook, loadPage } = useBooks()
const { saveProgress, clearSave, getSave, hasSave } = useSaveSystem()
const loading = ref(true)
const error = ref<string | null>(null)
const currentView = ref<'list' | 'reader'>('list')
const currentBook = ref<Book | null>(null)
const currentPage = ref<Page | null>(null)
const currentBookPath = ref<string>('')
const savedState = ref<{ hp: number, inventory: string[] } | null>(null)

onMounted(async () => {
  await loadBooks()
  loading.value = false
})

async function handleStart(bookPath: string) {
  loading.value = true
  const book = await loadBook(bookPath)
  if (book) {
    currentBook.value = book
    currentBookPath.value = bookPath
    // 清除旧存档，开始新游戏
    clearSave(bookPath)
    const firstPage = book.chapters[0].sections[0].pages[0]
    currentPage.value = await loadPage(bookPath, firstPage.json)
    currentView.value = 'reader'
  }
  loading.value = false
}

async function handleContinue(bookPath: string) {
  loading.value = true
  try {
    const save = getSave(bookPath)
    console.log('Loading save:', save)
    
    if (!save) {
      error.value = '没有找到存档'
      loading.value = false
      return
    }
    
    if (!save.pageJsonPath) {
      console.error('Save data missing pageJsonPath:', save)
      error.value = '存档数据损坏'
      loading.value = false
      return
    }
    
    const book = await loadBook(bookPath)
    if (book) {
      currentBook.value = book
      currentBookPath.value = bookPath
      
      // 保存游戏状态（HP 和物品）供 Reader 恢复
      savedState.value = {
        hp: save.hp,
        inventory: save.inventory
      }
      
      // 确保 pageJsonPath 不以 / 开头
      const pageJsonPath = save.pageJsonPath.startsWith('/') 
        ? save.pageJsonPath.substring(1) 
        : save.pageJsonPath
      
      console.log('Loading page:', pageJsonPath)
      currentPage.value = await loadPage(bookPath, pageJsonPath)
      
      if (currentPage.value) {
        currentView.value = 'reader'
      } else {
        error.value = '无法加载存档页面'
        currentView.value = 'list'
      }
    }
  } catch (e) {
    console.error('Error continuing game:', e)
    error.value = e instanceof Error ? e.message : '加载存档失败'
  } finally {
    loading.value = false
  }
}

async function handleSelect(targetId: string) {
  if (!currentBook.value || !currentBookPath.value) return
  
  for (const chapter of currentBook.value.chapters) {
    for (const section of chapter.sections) {
      for (const pageRef of section.pages) {
        if (pageRef.id === targetId) {
          currentPage.value = await loadPage(currentBookPath.value, pageRef.json)
          // 自动保存进度
          if (currentBook.value && currentPage.value) {
            // 注意：这里需要在 Reader 组件中调用 saveProgress，因为需要 gameState
          }
          return
        }
      }
    }
  }
  
  console.error('Page not found:', targetId)
}

function handleDeath() {
  // Navigate to death ending or show game over screen
  console.log('Player died!')
  // TODO: Navigate to death ending page
  // For now, we could redirect to a game over screen or ending
  alert('你已死亡！游戏结束。')
  // Reset game state or navigate to ending
}
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
}

.error {
  color: #e74c3c;
}
</style>

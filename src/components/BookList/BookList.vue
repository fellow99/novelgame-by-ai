<template>
  <div class="book-list">
    <h1 class="title">视觉小说</h1>
    <div class="books-grid">
      <div 
        v-for="book in books" 
        :key="book.path" 
        class="book-card"
      >
        <div class="book-cover">
          <img 
            :src="resolveCoverPath(book.cover)" 
            :alt="book.title"
            class="cover-image"
            @load="book.loaded = true"
            @error="handleImageError"
          />
          <div class="cover-overlay" :class="{ loaded: book.loaded }">
            <div class="button-group">
              <button 
                class="start-btn" 
                @click.stop="$emit('start', book.path)"
              >
                开始
              </button>
              <button 
                v-if="hasSave(book.path)"
                class="continue-btn" 
                @click.stop="$emit('continue', book.path)"
              >
                继续
              </button>
            </div>
          </div>
          <div class="cover-loader" v-if="!book.loaded">加载中...</div>
        </div>
        <div class="book-info">
          <h2 class="book-title">{{ book.title }}</h2>
          <p class="book-subtitle">{{ book.subtitle }}</p>
          <p v-if="getSaveTime(book.path)" class="save-time">
            {{ getSaveTime(book.path) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookInfo } from '@/types/book'
import { useSaveSystem } from '@/composables/useSaveSystem'

interface BookInfoWithState extends BookInfo {
  loaded?: boolean
}

const props = defineProps<{
  books: BookInfoWithState[]
}>()

const emit = defineEmits<{
  (e: 'start', bookPath: string): void
  (e: 'continue', bookPath: string): void
}>()

const { getSave, hasSave, getAllSaves } = useSaveSystem()

function getSaveTime(bookPath: string): string {
  const save = getSave(bookPath)
  if (!save) return ''
  
  const date = new Date(save.timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 显示相对时间
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  // 超过一周显示具体日期
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function resolveCoverPath(cover: string): string {
  // 如果已经是相对路径（./ 或 ../），直接使用
  if (cover.startsWith('./') || cover.startsWith('../')) {
    return cover
  }
  // 如果是绝对路径，转换为相对路径
  if (cover.startsWith('/')) {
    return '.' + cover
  }
  return cover
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  const card = target.closest('.book-cover') as HTMLElement
  if (card) {
    card.classList.add('image-error')
    const loader = card.querySelector('.cover-loader')
    if (loader) {
      loader.textContent = '图片加载失败'
    }
  }
}
</script>

<style scoped>
.book-list {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: var(--font-size-xl);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.book-card {
  background: var(--color-bg);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.book-cover {
  position: relative;
  aspect-ratio: 16/9;
  background-color: var(--color-bg-secondary);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.book-card:hover .cover-image {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-overlay.loaded {
  opacity: 0;
}

.book-card:hover .cover-overlay.loaded {
  opacity: 1;
}

.button-group {
  display: flex;
  gap: var(--spacing-sm);
}

.start-btn, .continue-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: var(--font-size-lg);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
}

.start-btn:hover {
  background: #2980b9;
  transform: scale(1.05);
}

.continue-btn {
  background: #27ae60;
}

.continue-btn:hover {
  background: #2ecc71;
  transform: scale(1.05);
}

.cover-overlay.loaded {
  opacity: 0;
}

.book-card:hover .cover-overlay.loaded {
  opacity: 1;
}

.cover-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-lg);
  background: rgba(0, 0, 0, 0.5);
  animation: pulse 1.5s infinite;
}

.book-card.image-error .cover-loader {
  color: #ff6b6b;
  font-size: var(--font-size-sm);
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.start-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: var(--font-size-lg);
  transition: background 0.2s, transform 0.2s;
}

.start-btn:hover {
  background: #2980b9;
  transform: scale(1.05);
}

.book-info {
  padding: var(--spacing-md);
}

.book-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.book-subtitle {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.save-time {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
  font-weight: 500;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>

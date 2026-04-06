<template>
    <div class="reader">
      <div class="background" :style="{ backgroundImage: `url(${resolvedBackground})` }">
        <div class="image-loader" v-if="!imageLoaded">加载中...</div>
        <img 
          v-show="imageLoaded" 
          :src="resolvedBackground" 
          :alt="page.title"
          class="background-image"
          @load="imageLoaded = true"
          @error="handleImageError"
        />
      </div>
    <div class="content-overlay" @click="skipTyping">
      <!-- HP Display - Top Left -->
      <div class="hp-display">
        <span class="hp-heart">❤️</span>
        <span class="hp-text">{{ gameState.hp }}/{{ gameState.maxHp }}</span>
      </div>
      
      <!-- Items Inventory - Top Right -->
      <div class="inventory-display">
        <div 
          v-for="itemId in inventory" 
          :key="itemId"
          class="inventory-item"
          :class="{ 'is-food': isFoodItem(itemId) }"
          @click.stop="eatItem(itemId)"
          :title="getItemName(itemId)"
        >
          {{ getItemIcon(itemId) }}
        </div>
      </div>
      
      <div class="content-wrapper">
        <div class="content" :class="{ 'typing-complete': typingComplete }">
          <h2 v-if="page.title" class="title">{{ page.title }}</h2>
          <typewriter 
            :text="page.content" 
            :speed="50"
            :auto-start="true"
            @complete="typingComplete = true"
            ref="typewriterRef"
          />
        </div>
      </div>
      <selection-panel 
        v-if="page.selections && page.selections.length > 0"
        :class="['selection-panel', { visible: typingComplete }]"
        :selections="page.selections"
        :inventory="inventory"
        @select="$emit('select', $event)"
      />
      
      <!-- Item Pickup Dialog -->
      <item-pickup-dialog
        v-model="showPickupDialog"
        :items="unpickedItems"
        :book="book"
        @pickup="handlePickup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Page, Book } from '@/types/book'
import SelectionPanel from '@/components/SelectionPanel/SelectionPanel.vue'
import Typewriter from '@/components/Typewriter/Typewriter.vue'
import ItemPickupDialog from '@/components/ItemPickupDialog/ItemPickupDialog.vue'
import { useGameState } from '@/composables/useGameState'
import { useSaveSystem } from '@/composables/useSaveSystem'

const props = defineProps<{
  page: Page
  book: Book | null
  bookPath: string
  savedState?: { hp: number, inventory: string[] } | null
}>()

const emit = defineEmits<{
  (e: 'select', targetId: string): void
  (e: 'death'): void
}>()

const imageLoaded = ref(false)
const typingComplete = ref(false)
const typewriterRef = ref<InstanceType<typeof Typewriter> | null>(null)
const showPickupDialog = ref(false)
const unpickedItems = ref<string[]>([])

// Initialize game state and save system
const gameState = useGameState(computed(() => props.book))
const { saveProgress } = useSaveSystem()

// 恢复保存的游戏状态（仅首次加载时）
if (props.savedState) {
  console.log('Restoring saved state:', props.savedState)
  // 注意：useGameState 已经从 localStorage 加载了状态
  // 这里不需要额外操作，因为 saveProgress 已经保存了状态
}

// 页面切换时重置状态并自动保存
watch(() => props.page, (newPage, oldPage) => {
  typingComplete.value = false
  imageLoaded.value = false
  
  // Apply page HP effects
  if (newPage.hp && newPage.hp !== 0) {
    gameState.modifyHp(newPage.hp)
  }
  
  // Check for unpicked items and show dialog
  if (newPage.items && newPage.items.length > 0) {
    unpickedItems.value = newPage.items.filter(
      itemId => !gameState.pickedItems.value.includes(itemId)
    )
    if (unpickedItems.value.length > 0) {
      showPickupDialog.value = true
    }
  }
  
  // Check death state after page load
  if (gameState.isDead.value) {
    emit('death')
  }
  
  // Auto-save progress (after a short delay to ensure state is updated)
  if (props.book && props.page && props.bookPath) {
    setTimeout(() => {
      // 从 page.id 构建 pageJsonPath (格式：XX/YY/ZZ.json)
      const pageIdParts = props.page.id.split('-') // ["01", "01", "001"]
      const pageJsonPath = `${pageIdParts[0]}/${pageIdParts[1]}/${pageIdParts[2]}.json`
      
      console.log('Saving progress:', {
        bookPath: props.bookPath,
        pageId: props.page.id,
        pageJsonPath: pageJsonPath,
        hp: gameState.hp.value,
        inventory: gameState.inventory.value
      })
      
      saveProgress(props.bookPath, props.page.id, pageJsonPath, {
        hp: gameState.hp.value,
        inventory: gameState.inventory.value
      } as any)
    }, 100)
  }
}, { deep: true })

const resolvedBackground = computed(() => {
  if (!props.page.background) return ''
  const bg = props.page.background
  // 如果已经是相对路径（./ 或 ../），直接使用
  if (bg.startsWith('./') || bg.startsWith('../')) {
    return bg
  }
  // 如果是绝对路径，转换为相对路径
  if (bg.startsWith('/')) {
    return '.' + bg
  }
  // 其他情况，假设是相对于当前页面的路径，需要解析
  return bg
})

function skipTyping() {
  if (!typingComplete.value && typewriterRef.value) {
    typewriterRef.value.skip()
  }
}

function handleImageError() {
  console.error('Failed to load background:', props.page.background)
  imageLoaded.value = true
}

// Computed inventory for template (auto-unwrapped)
const inventory = computed(() => gameState.inventory.value)

// Item helper functions
function getItem(itemId: string) {
  return props.book?.items?.find(item => item.id === itemId)
}

function getItemIcon(itemId: string): string {
  const item = getItem(itemId)
  return item?.icon || '📦'
}

function getItemName(itemId: string): string {
  const item = getItem(itemId)
  return item?.name || itemId
}

function isFoodItem(itemId: string): boolean {
  const item = getItem(itemId)
  if (!item) return false
  return item.type === 'food' || (item.hp !== undefined && item.hp > 0)
}

function eatItem(itemId: string) {
  if (isFoodItem(itemId)) {
    gameState.useItem(itemId)
  }
}

function handlePickup(itemId: string | null) {
  if (itemId) {
    gameState.pickItem(itemId)
    console.log(`Picked up item: ${itemId}`)
  } else {
    console.log('Player chose not to pick up any items')
  }
}
</script>

<style scoped>
.reader {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: pointer;
}

.background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-loader {
  color: white;
  font-size: var(--font-size-lg);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.content-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-lg);
}

/* HP Display - Top Left */
.hp-display {
  position: fixed;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hp-heart {
  font-size: var(--font-size-lg);
}

.hp-text {
  font-size: var(--font-size-lg);
  color: #ef4444;
  font-weight: 600;
}

/* Items Inventory - Top Right */
.inventory-display {
  position: fixed;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 100;
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.inventory-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #6b7280;
}

.inventory-item.is-food {
  border: 2px solid #4ade80;
}

.inventory-item:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.inventory-item:active {
  transform: scale(0.95);
}

.content-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.content {
  max-width: var(--container-max-width);
  width: 100%;
  padding: var(--spacing-xl);
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  color: white;
  transition: opacity 0.5s ease;
}

.content.typing-complete {
  opacity: 0.5;
}

.content :deep(.typewriter),
.content :deep(.char) {
  color: white !important;
}

.selection-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.selection-panel.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.title {
  font-size: var(--font-size-xl);
  color: white;
  margin-bottom: var(--spacing-lg);
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

@media (max-width: 768px) {
  .content-overlay {
    padding: var(--spacing-md);
  }
  
  .hp-display {
    top: var(--spacing-sm);
    left: var(--spacing-sm);
  }
  
  .inventory-display {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }
  
  .inventory-item {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

.click-hint {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 0; }
  25%, 75% { opacity: 1; }
}
</style>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="item-pickup-overlay" @click.stop>
        <div class="item-pickup-dialog">
          <h2 class="dialog-title">发现物品</h2>
          
          <div class="items-container">
            <div
              v-for="itemId in items"
              :key="itemId"
              class="item-card"
              @click="handlePickItem(itemId)"
            >
              <div class="item-icon">
                {{ getItemIcon(itemId) }}
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ getItemName(itemId) }}</h3>
                <p class="item-description">{{ getItemDescription(itemId) }}</p>
                <p v-if="isFood(itemId)" class="item-hp-effect">
                  HP +{{ getItemHp(itemId) }}
                </p>
              </div>
            </div>
          </div>
          
          <button class="none-btn" @click="handlePickNone">
            都不拾取
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Book, Item } from '@/types/book'

const props = defineProps<{
  items: string[]
  book: Book | null
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'pickup', itemId: string | null): void
}>()

const itemsMap = computed(() => {
  if (!props.book?.items) return new Map<string, Item>()
  return new Map(props.book.items.map(item => [item.id, item]))
})

function getItem(itemId: string): Item | undefined {
  return itemsMap.value.get(itemId)
}

function getItemIcon(itemId: string): string {
  const item = getItem(itemId)
  return item?.icon ?? '📦'
}

function getItemName(itemId: string): string {
  const item = getItem(itemId)
  return item?.name ?? itemId
}

function getItemDescription(itemId: string): string {
  const item = getItem(itemId)
  return item?.description ?? ''
}

function getItemHp(itemId: string): number {
  const item = getItem(itemId)
  return item?.hp ?? 0
}

function isFood(itemId: string): boolean {
  const item = getItem(itemId)
  return item?.type === 'food' && (item?.hp ?? 0) > 0
}

function handlePickItem(itemId: string) {
  emit('pickup', itemId)
  emit('update:modelValue', false)
}

function handlePickNone() {
  emit('pickup', null)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.item-pickup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.item-pickup-dialog {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(52, 152, 219, 0.2);
}

.dialog-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin: 0 0 var(--spacing-lg) 0;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.item-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.item-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(52, 152, 219, 0.5);
  transform: translateX(8px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.item-card:active {
  transform: translateX(4px);
}

.item-icon {
  font-size: 40px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #fff;
  margin: 0 0 var(--spacing-xs) 0;
  letter-spacing: 1px;
}

.item-description {
  font-size: var(--font-size-sm);
  color: #9ca3af;
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.5;
}

.item-hp-effect {
  font-size: var(--font-size-sm);
  color: #10b981;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.none-btn {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(107, 114, 128, 0.3);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.5);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.none-btn:hover {
  background: rgba(107, 114, 128, 0.5);
  border-color: rgba(107, 114, 128, 0.8);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

.none-btn:active {
  transform: translateY(0);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .item-pickup-dialog,
.fade-leave-active .item-pickup-dialog {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.fade-enter-from .item-pickup-dialog,
.fade-leave-to .item-pickup-dialog {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .item-pickup-dialog {
    width: 95%;
    padding: var(--spacing-md);
  }

  .dialog-title {
    font-size: var(--font-size-lg);
    letter-spacing: 1px;
  }

  .item-icon {
    font-size: 32px;
  }

  .item-name {
    font-size: var(--font-size-base);
  }

  .item-description {
    font-size: var(--font-size-sm);
  }

  .none-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
  }
}

@media (max-width: 320px) {
  .item-card {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .item-icon {
    font-size: 28px;
  }

  .dialog-title {
    font-size: var(--font-size-base);
  }
}
</style>

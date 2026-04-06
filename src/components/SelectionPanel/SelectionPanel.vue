<template>
  <div class="selection-panel">
    <button
      v-for="(selection, index) in filteredSelections"
      :key="index"
      class="selection-btn"
      @click="$emit('select', selection.to)"
    >
      <span class="icon">{{ selection.icon }}</span>
      <span class="text">{{ selection.text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Selection } from '@/types/book'

const props = defineProps<{
  selections: Selection[]
  inventory?: string[]
}>()

defineEmits<{
  (e: 'select', targetId: string): void
}>()

const filteredSelections = computed(() => {
  if (!props.inventory || props.inventory.length === 0) {
    return props.selections.filter(s => !s.use)
  }
  return props.selections.filter(selection => {
    return !selection.use || props.inventory?.includes(selection.use)
  })
})
</script>

<style scoped>
.selection-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
  padding: var(--spacing-lg);
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.selection-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  border: 2px solid transparent;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: var(--font-size-lg);
  transition: all 0.2s;
  cursor: pointer;
}

.selection-btn:hover {
  background: white;
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.selection-btn:active {
  transform: translateY(0);
}

.icon {
  font-size: var(--font-size-xl);
}

.text {
  flex: 1;
  text-align: left;
}

@media (max-width: 768px) {
  .selection-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
  }
  
  .icon {
    font-size: var(--font-size-lg);
  }
}
</style>

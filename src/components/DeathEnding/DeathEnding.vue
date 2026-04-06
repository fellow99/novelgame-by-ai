<template>
  <div class="death-ending" @click.stop>
    <div class="death-content">
      <div class="death-icon">💀</div>
      <h1 class="death-title">你死了</h1>
      <p class="death-subtitle">你的旅程到此结束</p>
      <button class="restart-btn" @click="handleRestart">
        <span class="restart-icon">🔄</span>
        <span class="restart-text">重新开始</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameState } from '@/composables/useGameState'

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const gameState = useGameState()

function handleRestart() {
  gameState.reset()
  emit('restart')
}
</script>

<style scoped>
.death-ending {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0f0f0f 100%);
  animation: fade-in 0.8s ease-out forwards;
}

.death-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.death-icon {
  font-size: 80px;
  animation: icon-pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.5));
}

.death-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 4px;
  margin: 0;
}

.death-subtitle {
  font-size: var(--font-size-lg);
  color: #9ca3af;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  margin: 0;
  font-weight: 400;
}

.restart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  min-height: var(--touch-target-min);
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  border: 2px solid rgba(220, 38, 38, 0.5);
  border-radius: var(--border-radius);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  letter-spacing: 2px;
}

.restart-btn:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: rgba(220, 38, 38, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.6);
}

.restart-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(220, 38, 38, 0.5);
}

.restart-icon {
  font-size: var(--font-size-xl);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.5));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 30px rgba(220, 38, 38, 0.7));
  }
}

@media (max-width: 768px) {
  .death-icon {
    font-size: 60px;
  }

  .death-title {
    font-size: var(--font-size-lg);
    letter-spacing: 2px;
  }

  .death-subtitle {
    font-size: var(--font-size-base);
  }

  .restart-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-base);
    min-height: 48px;
    min-width: 100%;
  }
}

@media (max-width: 320px) {
  .death-content {
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .death-icon {
    font-size: 50px;
  }

  .death-title {
    font-size: var(--font-size-base);
  }
}
</style>

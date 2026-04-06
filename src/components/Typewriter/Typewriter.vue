<template>
  <div class="typewriter">
    <span v-for="(char, index) in displayedText" :key="index" class="char">{{ char }}</span>
    <span v-if="isTyping" class="cursor">|</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  text: string
  speed?: number
  autoStart?: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const displayedText = ref('')
const isTyping = ref(false)

async function typeText() {
  if (!props.text) return
  
  isTyping.value = true
  displayedText.value = ''
  
  const chars = props.text.split('')
  const speed = props.speed || 50
  
  for (let i = 0; i < chars.length; i++) {
    displayedText.value += chars[i]
    await new Promise(resolve => setTimeout(resolve, speed))
  }
  
  isTyping.value = false
  emit('complete')
}

watch(() => props.text, (newText) => {
  if (newText && props.autoStart) {
    typeText()
  }
}, { immediate: true })

defineExpose({
  skip: () => {
    if (props.text) {
      displayedText.value = props.text
      isTyping.value = false
      emit('complete')
    }
  }
})
</script>

<style scoped>
.typewriter {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}

.char {
  display: inline;
  opacity: 1;
}

.cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: var(--color-primary);
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>

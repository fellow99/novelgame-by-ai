import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Book, GameState as GameStateType } from '@/types/book'

const STORAGE_KEY = 'novel-game-state'

export interface GameState extends GameStateType {
  currentMaxHp: Ref<number>
}

export function useGameState(book: Ref<Book | null>) {
  const initialHp = 10
  const initialMaxHp = 10

  const hp = ref(initialHp)
  const maxHp = ref(initialMaxHp)
  const inventory = ref<string[]>([])
  const pickedItems = ref<string[]>([])
  const isDead = ref(false)

  const currentMaxHp = computed(() => maxHp.value)

  function saveState() {
    const state: GameStateType = {
      hp: hp.value,
      maxHp: maxHp.value,
      inventory: inventory.value,
      pickedItems: pickedItems.value,
      isDead: isDead.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function loadState(): boolean {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return false

    try {
      const state: GameStateType = JSON.parse(data)
      hp.value = state.hp ?? initialHp
      maxHp.value = state.maxHp ?? initialMaxHp
      inventory.value = state.inventory ?? []
      pickedItems.value = state.pickedItems ?? []
      isDead.value = state.isDead ?? false
      return true
    } catch (e) {
      console.error('Failed to load game state:', e)
      return false
    }
  }

  function checkDeath() {
    if (hp.value <= 0) {
      isDead.value = true
    }
  }

  function modifyHp(amount: number) {
    hp.value = Math.max(0, Math.min(hp.value + amount, maxHp.value))
    checkDeath()
    saveState()
  }

  function pickItem(itemId: string) {
    if (!inventory.value.includes(itemId)) {
      inventory.value.push(itemId)
    }
    if (!pickedItems.value.includes(itemId)) {
      pickedItems.value.push(itemId)
    }
    saveState()
  }

  function useItem(itemId: string) {
    const itemIndex = inventory.value.indexOf(itemId)
    if (itemIndex === -1) return

    const item = book.value?.items?.find(i => i.id === itemId)
    
    if (item?.hp) {
      modifyHp(item.hp)
    }

    inventory.value.splice(itemIndex, 1)
    saveState()
  }

  function hasItem(itemId: string): boolean {
    return inventory.value.includes(itemId)
  }

  function reset() {
    hp.value = initialHp
    maxHp.value = initialMaxHp
    inventory.value = []
    pickedItems.value = []
    isDead.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  loadState()

  return {
    hp,
    maxHp,
    currentMaxHp,
    inventory,
    pickedItems,
    isDead,
    modifyHp,
    pickItem,
    useItem,
    hasItem,
    reset,
    saveState,
    loadState
  }
}

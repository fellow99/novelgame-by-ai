import type { GameState } from './useGameState'

export interface SaveData {
  bookPath: string
  pageId: string
  pageJsonPath: string
  hp: number
  inventory: string[]
  timestamp: number
}

const STORAGE_PREFIX = 'novel-save-'

function getStorageKey(bookPath: string): string {
  return `${STORAGE_PREFIX}${bookPath}`
}

/**
 * Get save data for a specific book
 * @param bookPath - Path to the book (e.g., "doomsday/book.json")
 * @returns SaveData or null if no save exists
 */
export function getSave(bookPath: string): SaveData | null {
  const key = getStorageKey(bookPath)
  const saved = localStorage.getItem(key)
  
  if (!saved) {
    return null
  }
  
  try {
    return JSON.parse(saved) as SaveData
  } catch (error) {
    console.error(`Failed to parse save data for ${bookPath}:`, error)
    return null
  }
}

/**
 * Save game progress for a specific book
 * @param bookPath - Path to the book
 * @param pageId - Current page ID
 * @param pageJsonPath - Path to current page JSON
 * @param gameState - Current game state (hp, inventory)
 */
export function saveProgress(
  bookPath: string,
  pageId: string,
  pageJsonPath: string,
  gameState: GameState
): void {
  const saveData: SaveData = {
    bookPath,
    pageId,
    pageJsonPath,
    hp: gameState.hp,
    inventory: [...gameState.inventory],
    timestamp: Date.now()
  }
  
  const key = getStorageKey(bookPath)
  localStorage.setItem(key, JSON.stringify(saveData))
}

/**
 * Clear save data for a specific book (for new game)
 * @param bookPath - Path to the book
 */
export function clearSave(bookPath: string): void {
  const key = getStorageKey(bookPath)
  localStorage.removeItem(key)
}

/**
 * Check if a save exists for a specific book
 * @param bookPath - Path to the book
 * @returns true if save exists, false otherwise
 */
export function hasSave(bookPath: string): boolean {
  const key = getStorageKey(bookPath)
  return localStorage.getItem(key) !== null
}

/**
 * Get all saved games for all books
 * @returns Array of all save data
 */
export function getAllSaves(): SaveData[] {
  const saves: SaveData[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    
    if (!key || !key.startsWith(STORAGE_PREFIX)) {
      continue
    }
    
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const saveData = JSON.parse(saved) as SaveData
        saves.push(saveData)
      }
    } catch (error) {
      console.error(`Failed to parse save data for key ${key}:`, error)
    }
  }
  
  return saves
}

/**
 * Composable for managing game saves
 */
export function useSaveSystem() {
  return {
    getSave,
    saveProgress,
    clearSave,
    hasSave,
    getAllSaves
  }
}

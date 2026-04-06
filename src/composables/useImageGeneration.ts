import { ref } from 'vue'
import type { ImageGenerationOptions, ImageGenerationResponse } from '@/types/api'

const imageCache = new Map<string, string>()

export function useImageGeneration() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function generateImage(
    prompt: string,
    tags: string,
    options?: ImageGenerationOptions
  ): Promise<string> {
    loading.value = true
    error.value = null

    const cacheKey = `${tags}_${prompt}`
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!
    }

    try {
      const fullPrompt = `${tags}, ${prompt}`
      
      // Call bailian-image MCP service
      const taskResponse = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-to-image/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_BAILIAN_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'wanx-v1',
          input: {
            prompt: fullPrompt
          },
          parameters: {
            size: options?.size || '1328*1328',
            n: options?.n || 1
          }
        })
      })

      if (!taskResponse.ok) {
        throw new Error('Failed to start image generation task')
      }

      const taskData = await taskResponse.json()
      const taskId = taskData.output.task_id

      // Poll for completion
      const result = await pollTaskStatus(taskId)

      if (!result.results || result.results.length === 0) {
        throw new Error('No image generated')
      }

      const imageUrl = result.results[0].url
      imageCache.set(cacheKey, imageUrl)

      return imageUrl
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function pollTaskStatus(taskId: string, maxRetries = 30, interval = 3000): Promise<ImageGenerationResponse> {
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, interval))

      const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_BAILIAN_API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to poll task status')
      }

      const data = await response.json()

      if (data.output.task_status === 'SUCCEEDED') {
        return data.output
      }

      if (data.output.task_status === 'FAILED') {
        throw new Error('Image generation failed')
      }
    }

    throw new Error('Task polling timeout')
  }

  function clearCache() {
    imageCache.clear()
  }

  return {
    loading,
    error,
    generateImage,
    clearCache
  }
}

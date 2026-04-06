/** Image generation options */
export interface ImageGenerationOptions {
  size?: string
  n?: number
  watermark?: boolean
  negativePrompt?: string
}

/** Image generation response */
export interface ImageGenerationResponse {
  task_id: string
  task_status: 'PENDING' | 'SUCCEEDED' | 'FAILED'
  results?: Array<{
    url: string
    prompt: string
  }>
}

/** Image generation request */
export interface ImageGenerationRequest {
  prompt: string
  tags: string
  options?: ImageGenerationOptions
}

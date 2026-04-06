export function resolvePath(basePath: string, relativePath: string): string {
  if (relativePath.startsWith('/')) {
    return relativePath
  }
  
  const baseDir = basePath.substring(0, basePath.lastIndexOf('/'))
  const parts = baseDir.split('/')
  const relativeParts = relativePath.split('/')
  
  for (const part of relativeParts) {
    if (part === '..') {
      parts.pop()
    } else if (part !== '.' && part !== '') {
      parts.push(part)
    }
  }
  
  return parts.join('/')
}

export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/'
}

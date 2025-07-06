<template>
  <div class="assistant-message">
    <!-- Loading State -->
    <div v-if="message.isLoading">
      <ResponseLoadingSpinner />
    </div>

    <!-- Message Content -->
    <div v-else class="message-content">
      <!-- Error State -->
      <div v-if="message.error" class="error-message">
        <div class="error-header">
          <AlertIcon />
          <span class="error-title">Error</span>
        </div>
        <div class="error-text">{{ message.content }}</div>
        <button @click="handleRetry" class="retry-button">
          Try again
        </button>
      </div>

      <!-- Normal Message -->
      <div v-else class="formatted-content" v-html="formatMessageContent(message.content)"></div>

      <!-- Footer with timestamp and copy button -->
      <div class="message-footer">
        <div class="timestamp">
          {{ formatTime(message.timestamp) }}
        </div>

        <button @click="handleCopy" class="copy-button" title="Copy message">
          <CopyIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chat'
import ResponseLoadingSpinner from '@/components/prompt/ResponseLoadingSpinner.vue'
import { AlertIcon, CopyIcon } from '@/components/ui/icons'

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'copy-message': [messageId: string]
  'retry-message': []
}>()

const formatTime = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(timestamp)
}

const formatMessageContent = (content: string): string => {
  const lines = content.split('\n')
  let result = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (line.startsWith('• ')) {
      let bulletGroup = `<div class="bullet-group">`
      bulletGroup += `<div class="bullet-item"><span class="bullet-point">•</span><span>${line.substring(2)}</span></div>`

      i++
      while (i < lines.length) {
        const nextLine = lines[i].trim()
        const originalLine = lines[i]

        if (nextLine.startsWith('- ')) {
          const subItem = nextLine.substring(2)
          bulletGroup += `<div class="sub-item"><span class="sub-bullet">-</span><span>${subItem}</span></div>`
          i++
        } else if (originalLine.startsWith('  • ') || originalLine.startsWith('\t• ')) {
          const subItem = nextLine.substring(2)
          bulletGroup += `<div class="sub-item"><span class="bullet-point">•</span><span>${subItem}</span></div>`
          i++
        } else {
          break
        }
      }

      bulletGroup += `</div>`
      result.push(bulletGroup)
      continue
    } else if (line.startsWith('- ')) {
      let bulletGroup = `<div class="bullet-group">`
      bulletGroup += `<div class="bullet-item"><span class="main-bullet">•</span><span>${line.substring(2)}</span></div>`

      i++
      while (i < lines.length) {
        const nextLine = lines[i].trim()
        const originalLine = lines[i]

        if (nextLine.startsWith('- ') && (originalLine.startsWith('  ') || originalLine.startsWith('\t'))) {
          const subItem = nextLine.substring(2)
          bulletGroup += `<div class="nested-sub-item"><span class="sub-bullet">-</span><span>${subItem}</span></div>`
          i++
        } else if (originalLine.startsWith('  • ') || originalLine.startsWith('\t• ')) {
          const subItem = nextLine.substring(2)
          bulletGroup += `<div class="nested-sub-item"><span class="bullet-point">•</span><span>${subItem}</span></div>`
          i++
        } else {
          break
        }
      }

      bulletGroup += `</div>`
      result.push(bulletGroup)
      continue
    } else if (line) {
      result.push(`<p class="paragraph">${line}</p>`)
    }

    i++
  }

  return result
    .join('')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
}

const handleCopy = () => {
  emit('copy-message', props.message.id)
}

const handleRetry = () => {
  emit('retry-message')
}
</script>

<style scoped>
.assistant-message {
  width: 100%;
  padding: 0 1rem;
}

.message-content {
  color: #f3f4f6;
}

.error-message {
  color: #fca5a5;
  background-color: rgba(153, 27, 27, 0.2);
  border: 1px solid #7f1d1d;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}



.error-title {
  font-weight: 500;
}

.error-text {
  font-size: 0.875rem;
}

.retry-button {
  font-size: 0.75rem;
  color: #fca5a5;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
}

.retry-button:hover {
  color: #f3f4f6;
}

.formatted-content {
  max-width: none;
  color: #d1d5db;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
}

.copy-button {
  opacity: 0.6;
  transition: opacity 200ms;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
}

.copy-button:hover {
  opacity: 1;
  background-color: #4b5563;
}

/* Content formatting styles */
:deep(.paragraph) {
  margin-bottom: 0.75rem;
}

:deep(.bullet-group) {
  margin: 0.5rem 0;
}

:deep(.bullet-item) {
  display: flex;
  align-items: flex-start;
}

:deep(.sub-item) {
  display: flex;
  align-items: flex-start;
  margin-left: 1rem;
  margin-top: 0.25rem;
}

:deep(.nested-sub-item) {
  display: flex;
  align-items: flex-start;
  margin-left: 1.5rem;
  margin-top: 0.25rem;
}

:deep(.bullet-point) {
  color: #60a5fa;
  margin-right: 0.5rem;
}

:deep(.main-bullet) {
  color: #60a5fa;
  font-weight: bold;
  margin-right: 0.75rem;
}

:deep(.sub-bullet) {
  color: #9ca3af;
  margin-right: 0.5rem;
}

:deep(strong) {
  color: #f3f4f6;
  font-weight: 600;
}

:deep(em) {
  color: #d1d5db;
}

:deep(.inline-code) {
  background-color: #374151;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
}
</style>
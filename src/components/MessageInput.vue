<template>
  <div class="border-t border-chat-border bg-chat-surface p-3 sm:p-4">
    <div class="w-full sm:max-w-4xl sm:mx-auto">
      <div class="flex items-start space-x-2 sm:space-x-3">
        <div class="flex-1 relative">
          <textarea
            id="message-input"
            ref="textareaRef"
            v-model="message"
            :disabled="!canSend"
            :placeholder="placeholder"
            class="chat-input w-full rounded-lg border px-3 sm:px-4 py-3 resize-none overflow-hidden min-h-[52px] text-sm sm:text-base"
            rows="1"
            aria-label="Type your message"
            @keydown="handleKeydown"
            @input="adjustTextareaHeight"
          />
          
          <!-- Character count (optional) -->
          <div
            v-if="message.length > 500"
            class="absolute bottom-2 right-2 text-xs text-chat-text-secondary bg-chat-input px-1 rounded"
          >
            {{ message.length }}/1000
          </div>
        </div>
        
        <button
          @click="handleSend"
          :disabled="!canSend || !message.trim()"
          class="btn-primary flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 min-h-[52px] flex-shrink-0 self-start"
          :class="{ 'opacity-50 cursor-not-allowed': !canSend || !message.trim() }"
        >
          
          <!-- Send icon (pointing up/forward) -->
          <svg
            v-if="!isLoading"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          
          <!-- Loading spinner -->
          <div
            v-else
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
        </button>
      </div>
      
      <!-- Hint text -->
      <div class="mt-2 text-xs text-chat-text-secondary">
        Press Enter to send, Shift+Enter for new line
        <span v-if="!canSend"> • Please wait for the assistant to respond</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

interface Props {
  canSend: boolean
  isLoading: boolean
  placeholder?: string
}

interface Emits {
  (e: 'send-message', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Ask about game rules...'
})

const emit = defineEmits<Emits>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const handleSend = () => {
  if (!props.canSend || !message.value.trim()) return
  
  emit('send-message', message.value.trim())
  message.value = ''
  
  // Reset textarea height
  nextTick(() => {
    adjustTextareaHeight()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

const adjustTextareaHeight = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  // Reset height to calculate new height
  textarea.style.height = 'auto'
  
  // Set new height based on scroll height (max ~5 lines)
  const maxHeight = 140 // Approximately 5 lines
  const newHeight = Math.min(textarea.scrollHeight, maxHeight)
  textarea.style.height = `${newHeight}px`
  
  // Ensure no scrollbars appear
  if (textarea.scrollHeight <= maxHeight) {
    textarea.style.overflowY = 'hidden'
  } else {
    textarea.style.overflowY = 'auto'
  }
}

// Focus input on mount
onMounted(() => {
  textareaRef.value?.focus()
})

// Expose focus method for parent components
defineExpose({
  focus: () => textareaRef.value?.focus()
})
</script> 
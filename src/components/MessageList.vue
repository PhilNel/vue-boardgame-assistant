<template>
  <div class="flex-1 overflow-hidden">
    <div
      ref="messagesContainer"
      class="chat-messages chat-scroll h-full overflow-y-auto px-2 sm:px-4 py-4 sm:py-6"
    >
      <div class="w-full sm:max-w-4xl sm:mx-auto space-y-3 sm:space-y-4">
        <TransitionGroup name="message" tag="div">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message-container"
          >
            <!-- User Message -->
            <div
              v-if="message.role === 'user'"
              class="flex justify-end my-4"
            >
              <div class="message-bubble message-user max-w-3xl ml-12">
                <div class="whitespace-pre-wrap">{{ message.content }}</div>
                <div class="flex items-center justify-between mt-3">
                  <div class="text-xs opacity-70">
                    {{ formatTime(message.timestamp) }}
                  </div>
                  
                  <button
                    @click="copyMessage(message.id)"
                    class="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-white hover:bg-opacity-20 rounded"
                    title="Copy message"
                  >
                    <CopyIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Assistant Message -->
            <div
              v-else-if="message.role === 'assistant'"
              class="group w-full"
            >
              <div class="message-assistant w-full px-4 sm:px-2">
                <!-- Loading State -->
                <div v-if="message.isLoading">
                  <LoadingSpinner/>
                </div>
                
                <!-- Message Content -->
                <div v-else>
                  <div
                    v-if="message.error"
                    class="text-red-400 bg-red-900 bg-opacity-20 border border-red-800 rounded p-3 mb-3"
                  >
                    <div class="flex items-center space-x-2 mb-1">
                      <AlertIcon class="w-4 h-4" />
                      <span class="font-medium">Error</span>
                    </div>
                    <div class="text-sm">{{ message.content }}</div>
                    <button
                      @click="retryMessage"
                      class="text-xs text-red-300 hover:text-red-100 underline mt-2"
                    >
                      Try again
                    </button>
                  </div>
                  
                  <div
                    v-else
                    class="prose prose-invert max-w-none mb-3"
                    v-html="formatMessageContent(message.content)"
                  ></div>
                  
                  <!-- Bottom row with timestamp and copy button -->
                  <div class="flex items-center space-x-2 mt-3">
                    <div class="text-xs text-chat-text-secondary">
                      {{ formatTime(message.timestamp) }}
                    </div>
                    
                    <button
                      @click="copyMessage(message.id)"
                      class="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-gray-600 rounded"
                      title="Copy message"
                    >
                      <CopyIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Message -->
            <div
              v-else-if="message.role === 'system'"
              class="flex justify-center"
            >
              <div class="message-bubble message-system max-w-lg">
                <div class="text-sm">{{ message.content }}</div>
                <div class="text-xs opacity-70 mt-1">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
        
        <!-- Empty State -->
        <div
          v-if="messages.length === 0"
          class="text-center py-12"
        >
          <div class="w-16 h-16 mx-auto mb-4">
            <WizardAvatar class="w-16 h-16" />
          </div>
          <h3 class="text-lg font-medium text-chat-text mb-2">
            Welcome to Boardgame Wiz
          </h3>
          <p class="text-chat-text-secondary">
            Ready to conjure up some game rule magic? Ask me anything!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, h } from 'vue'
import type { ChatMessage } from '@/types/chat'
import LoadingSpinner from './LoadingSpinner.vue'
import WizardAvatar from './WizardAvatar.vue'

const CopyIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
      h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
    ])
  }
}

const AlertIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    }, [
      h('path', { d: 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z' })
    ])
  }
}

interface Props {
  messages: ChatMessage[]
}

interface Emits {
  (e: 'copy-message', messageId: string): void
  (e: 'retry-message'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const messagesContainer = ref<HTMLElement>()

const copyMessage = (messageId: string) => {
  emit('copy-message', messageId)
}

const retryMessage = () => {
  emit('retry-message')
}

const formatTime = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(timestamp)
}

const formatMessageContent = (content: string): string => {
  // Simple markdown-like formatting for assistant messages
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>') // Inline code
    .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>') // Bullet points
    .replace(/\n/g, '<br>') // Line breaks
}

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Expose scroll method for parent components
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-leave-active {
  transition: all 0.3s ease-in;
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom prose styles for assistant messages */
:deep(.prose) {
  color: inherit;
}

:deep(.prose strong) {
  color: #f3f4f6;
  font-weight: 600;
}

:deep(.prose em) {
  color: #d1d5db;
}

:deep(.prose li) {
  color: inherit;
  margin: 0.25rem 0;
}

:deep(.prose code) {
  font-family: 'Courier New', monospace;
}
</style> 
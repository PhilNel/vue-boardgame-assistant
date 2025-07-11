<template>
  <div class="message-list-container">
    <div ref="messagesContainer" class="messages-scroll">
      <div class="messages-content">
        <TransitionGroup name="message" tag="div">
          <div v-for="message in messages" :key="message.id" class="message-wrapper">
            <UserMessage v-if="message.role === 'user'" :message="message" @copy-message="handleCopyMessage" />

            <AssistantMessage v-else-if="message.role === 'assistant'" :message="message"
              @copy-message="handleCopyMessage" @retry-message="handleRetryMessage" />

            <SystemMessage v-else-if="message.role === 'system'" :message="message" />
          </div>
        </TransitionGroup>

        <EmptyState v-if="messages.length === 0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import type { ChatMessage } from '@/types/chat'
import UserMessage from '@/components/chat/UserMessage.vue'
import AssistantMessage from '@/components/chat/AssistantMessage.vue'
import SystemMessage from '@/components/chat/SystemMessage.vue'
import EmptyState from '@/components/chat/EmptyState.vue'

interface Props {
  messages: ChatMessage[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'copy-message': [messageId: string]
  'retry-message': []
}>()

const messagesContainer = ref<HTMLElement>()

const handleCopyMessage = (messageId: string) => {
  emit('copy-message', messageId)
}

const handleRetryMessage = () => {
  emit('retry-message')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })

onMounted(async () => {
  await nextTick()
  scrollToBottom()
})

// Expose scroll method for parent components
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.message-list-container {
  flex: 1;
  overflow: hidden;
  /* Ensure proper mobile scrolling */
  -webkit-overflow-scrolling: touch;
}

.messages-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 1rem 0.5rem 1.5rem;
  /* Improve mobile scrolling */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.messages-content {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1rem;
  /* Add safe area padding for mobile */
  padding-left: max(1rem, env(safe-area-inset-left) + 1rem);
  padding-right: max(1rem, env(safe-area-inset-right) + 1rem);
}

.message-wrapper {
  width: 100%;
}

/* Message animations */
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

/* Custom scrollbar */
.messages-scroll::-webkit-scrollbar {
  width: 6px;
}

.messages-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.messages-scroll::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.messages-scroll::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

@media (min-width: 640px) {
  .messages-scroll {
    padding: 1.5rem 1rem;
  }

  .messages-content {
    gap: 1rem;
    padding: 0 3rem;
    padding-left: max(3rem, env(safe-area-inset-left) + 3rem);
    padding-right: max(3rem, env(safe-area-inset-right) + 3rem);
  }
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
  .messages-scroll {
    padding: 0.75rem 0.5rem 1rem;
  }

  .messages-content {
    gap: 0.5rem;
    padding: 0 0.75rem;
    padding-left: max(0.75rem, env(safe-area-inset-left) + 0.75rem);
    padding-right: max(0.75rem, env(safe-area-inset-right) + 0.75rem);
  }

  /* Hide scrollbar on mobile for cleaner look */
  .messages-scroll::-webkit-scrollbar {
    display: none;
  }

  .messages-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
</style>
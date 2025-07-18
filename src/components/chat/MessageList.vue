<template>
  <div class="message-list-container">
    <div ref="messagesContainer" class="messages-scroll" :class="{ 'show-scrollbar': showScrollbar }">
      <div class="messages-content">
        <TransitionGroup name="message" tag="div">
          <div v-for="message in messages" :key="message.id" class="message-wrapper">
            <UserMessage v-if="message.role === 'user'" :message="message" @copy-message="handleCopyMessage" />

            <AssistantMessage v-else-if="message.role === 'assistant'" :message="message"
              @copy-message="handleCopyMessage" @retry-message="handleRetryMessage" @feedback="handleFeedback" />

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
import type { FeedbackIssue, FeedbackType } from '@/types/feedback'
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
  'feedback': [data: {
    messageId: string
    feedbackType: FeedbackType
    issues?: FeedbackIssue[]
    description?: string
  }]
}>()

const messagesContainer = ref<HTMLElement>()
const showScrollbar = ref(false)

const handleCopyMessage = (messageId: string) => {
  emit('copy-message', messageId)
}

const handleRetryMessage = () => {
  emit('retry-message')
}

const handleFeedback = (data: {
  messageId: string
  feedbackType: FeedbackType
  issues?: FeedbackIssue[]
  description?: string
}) => {
  emit('feedback', data)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    const container = messagesContainer.value
    // Calculate precise scroll position to avoid over-scrolling
    const maxScroll = container.scrollHeight - container.clientHeight
    container.scrollTop = Math.max(0, maxScroll)
  }
}

const scrollDownSlightly = () => {
  if (messagesContainer.value) {
    const container = messagesContainer.value
    container.scrollTop += 256
  }
}

const isNearBottom = () => {
  if (!messagesContainer.value) return true
  const container = messagesContainer.value
  const threshold = 100 // pixels from bottom
  return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold
}

const checkScrollbar = () => {
  if (messagesContainer.value) {
    const { scrollHeight, clientHeight } = messagesContainer.value
    showScrollbar.value = scrollHeight > clientHeight
  }
}

// Auto-scroll to bottom when new messages arrive - smart behavior
watch(() => props.messages, async (newMessages) => {
  await nextTick();
  if (newMessages.length === 0) return

  const lastMessage = newMessages[newMessages.length - 1]
  if (lastMessage.role === 'user') {
    scrollToBottom()
  }
  else if (lastMessage.role === 'assistant') {
    if (isNearBottom()) {
      scrollToBottom()
    } else {
      scrollDownSlightly()
    }
  }

  checkScrollbar()
}, { deep: true })

onMounted(async () => {
  await nextTick()
  scrollToBottom()
  checkScrollbar()
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
  overflow-y: hidden;
  overflow-x: hidden;
  padding: 1rem 0.5rem 1.5rem;
  /* Improve mobile scrolling */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Only show scrollbar when content overflows */
.messages-scroll.show-scrollbar {
  overflow-y: auto;
  /* Better scrollbar behavior */
  scrollbar-width: thin;
  scrollbar-color: #4b5563 transparent;
}

/* Custom scrollbar for webkit browsers - only when scrollbar is shown */
.messages-scroll.show-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.messages-scroll.show-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.messages-scroll.show-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
  /* Make scrollbar more subtle */
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.messages-scroll.show-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
  opacity: 1;
}

/* Show scrollbar on hover/scroll */
.messages-scroll.show-scrollbar:not(:hover)::-webkit-scrollbar-thumb {
  opacity: 0.3;
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
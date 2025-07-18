<template>
  <div class="assistant-message">
    <div v-if="message.isLoading">
      <ResponseLoadingSpinner />
    </div>

    <div v-else class="message-content">
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

      <AssistantMessageFooter :message-id="message.id" :timestamp="message.timestamp" :existing-feedback="message.user_feedback" @copy="handleCopy"
        @feedback="handleFeedback" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chat'
import ResponseLoadingSpinner from '@/components/prompt/ResponseLoadingSpinner.vue'
import { AlertIcon } from '@/components/ui/icons'
import { formatMessageContent } from '@/utils/messageFormatter'
import AssistantMessageFooter from './AssistantMessageFooter.vue'
import type { FeedbackIssue, FeedbackType } from '@/types/feedback'

interface Props {
  message: ChatMessage
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

const handleCopy = () => {
  emit('copy-message', props.message.id)
}

const handleRetry = () => {
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
</script>

<style scoped>
.assistant-message {
  width: 100%;
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

/* Content formatting styles */
:deep(.paragraph) {
  margin-bottom: 0.5rem;
}

:deep(.bullet-group) {
  margin: 0.5rem;
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

:deep(.numbered-group) {
  margin: 0.5rem 0;
}

:deep(.numbered-item) {
  margin-bottom: 0.25rem;
}

:deep(.numbered-sub-item) {
  display: flex;
  align-items: flex-start;
  margin-left: 1rem;
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

:deep(.numbered-marker) {
  color: #9ca3af;
  margin-right: 0.5rem;
  font-weight: 500;
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
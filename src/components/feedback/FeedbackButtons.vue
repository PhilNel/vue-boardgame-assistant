<template>
    <div class="feedback-buttons">
        <button @click="handlePositiveFeedback"
            :class="['feedback-button', 'positive-button', { 'active': feedbackState === 'positive' }]"
            title="This answer was helpful">
            <ThumbsUpIcon />
        </button>

        <button @click="handleNegativeFeedback"
            :class="['feedback-button', 'negative-button', { 'active': feedbackState === 'negative' }]"
            title="This answer needs improvement">
            <ThumbsDownIcon />
        </button>

        <FeedbackModal :show="showModal" :feedback-type="currentFeedbackType" @close="handleModalClose"
            @submit="handleModalSubmit" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThumbsUpIcon, ThumbsDownIcon } from '@/components/ui/icons'
import FeedbackModal from './FeedbackModal.vue'
import type { FeedbackIssue, FeedbackType } from '@/types/feedback'

interface Props {
    messageId: string
    disabled?: boolean
}

interface Emits {
    (e: 'feedback', data: {
        messageId: string
        feedbackType: FeedbackType
        issues?: FeedbackIssue[]
        description?: string
    }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const feedbackState = ref<FeedbackType | null>(null)
const showModal = ref(false)
const currentFeedbackType = ref<FeedbackType>('positive')

const handlePositiveFeedback = () => {
    currentFeedbackType.value = 'positive'
    showModal.value = true
}

const handleNegativeFeedback = () => {
    currentFeedbackType.value = 'negative'
    showModal.value = true
}

const handleModalClose = () => {
    showModal.value = false
}

const handleModalSubmit = (data: {
    issues?: FeedbackIssue[]
    description?: string
}) => {
    feedbackState.value = currentFeedbackType.value
    emit('feedback', {
        messageId: props.messageId,
        feedbackType: currentFeedbackType.value,
        issues: data.issues,
        description: data.description
    })
}
</script>

<style scoped>
.feedback-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.feedback-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  color: #f9fafb;
}

.feedback-button:hover {
  background-color: #374151;
  color: #ffffff;
}

.positive-button.active {
    background-color: #065f46;
    color: #10b981;
    border-color: #059669;
}

.negative-button.active {
    background-color: #7f1d1d;
    color: #f87171;
    border-color: #dc2626;
}

.feedback-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
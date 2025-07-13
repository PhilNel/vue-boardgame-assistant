<template>
    <div class="message-footer">
        <div class="footer-actions">
            <FeedbackButtons :message-id="messageId" @feedback="handleFeedback" />
            <CopyButton @copy="handleCopy" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FeedbackButtons from '@/components/feedback/FeedbackButtons.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import type { FeedbackIssue, FeedbackType } from '@/types/feedback'

interface Props {
    messageId: string
    timestamp: Date
}

interface Emits {
    (e: 'copy'): void
    (e: 'feedback', data: {
        messageId: string
        feedbackType: FeedbackType
        issues?: FeedbackIssue[]
        description?: string
    }): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleCopy = () => {
    emit('copy')
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
.message-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 0rem;
}

.footer-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}
</style>
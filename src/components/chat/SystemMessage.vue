<template>
    <div class="system-message">
        <div class="message-bubble">
            <div class="message-content">{{ message.content }}</div>
            <div class="timestamp">
                {{ formatTime(message.timestamp) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chat'

interface Props {
    message: ChatMessage
}

defineProps<Props>()

const formatTime = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(timestamp)
}
</script>

<style scoped>
.system-message {
    display: flex;
    justify-content: center;
}

.message-bubble {
    max-width: 32rem;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #2d2d2d;
    color: #9ca3af;
    text-align: center;
    font-size: 0.875rem;
}

.message-content {
    margin-bottom: 0.25rem;
}

.timestamp {
    font-size: 0.75rem;
    opacity: 0.7;
}
</style>
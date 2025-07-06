<template>
    <div class="user-message">
        <div class="message-bubble">
            <div class="message-content">{{ message.content }}</div>
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
import { CopyIcon } from '@/components/ui/icons'

interface Props {
    message: ChatMessage
}

const props = defineProps<Props>()

const emit = defineEmits<{ 'copy-message': [messageId: string] }>()

const formatTime = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(timestamp)
}

const handleCopy = () => {
    emit('copy-message', props.message.id)
}
</script>

<style scoped>
.user-message {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
}

.message-bubble {
    max-width: 48rem;
    margin-left: 3rem;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #2563eb;
    color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content {
    white-space: pre-wrap;
}

.message-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.timestamp {
    font-size: 0.75rem;
    opacity: 0.7;
}

.copy-button {
    opacity: 0.6;
    transition: opacity 200ms;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
}

.copy-button:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.2);
}

</style>
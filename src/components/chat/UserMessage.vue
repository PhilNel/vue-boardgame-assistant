<template>
    <div class="user-message">
        <div class="message-bubble">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-footer">
                <CopyButton variant="user" @copy="handleCopy" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chat'
import CopyButton from '@/components/ui/CopyButton.vue'

interface Props {
    message: ChatMessage
}

const props = defineProps<Props>()

const emit = defineEmits<{ 'copy-message': [messageId: string] }>()

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
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
}
</style>
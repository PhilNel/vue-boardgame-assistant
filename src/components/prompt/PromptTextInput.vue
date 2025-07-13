<template>
    <div class="prompt-input-container">
        <textarea id="prompt-input" ref="textareaRef" v-model="message" :disabled="disabled" placeholder="Ask Ernest anything..."
            class="prompt-input" rows="1" @keydown="handleKeydown" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

interface Props {
    modelValue: string
    disabled?: boolean
}

interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'send'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const message = ref(props.modelValue)
const textareaRef = ref<HTMLTextAreaElement>()

watch(() => props.modelValue, (newValue) => {
    message.value = newValue
    nextTick(() => adjustHeight())
})

watch(message, (newValue) => {
    emit('update:modelValue', newValue)
    nextTick(() => adjustHeight())
})

const adjustHeight = () => {
    if (textareaRef.value) {
        const textarea = textareaRef.value
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto'
        
        // Calculate line height and max height (3 lines)
        const lineHeight = 24 // 1.5rem line height
        const padding = 24 // 0.75rem top + 0.75rem bottom
        const maxHeight = (lineHeight * 3) + padding
        
        // Set height based on content, but cap at max height
        const newHeight = Math.min(textarea.scrollHeight, maxHeight)
        textarea.style.height = `${newHeight}px`
        
        // Only show scrollbar when we've reached max height and there's more content
        if (textarea.scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto'
        } else {
            textarea.style.overflowY = 'hidden'
        }
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        emit('send')
    }
}

const focus = () => {
    textareaRef.value?.focus()
}

const clear = () => {
    message.value = ''
    nextTick(() => adjustHeight())
}

onMounted(() => {
    focus()
    adjustHeight()
})

defineExpose({
    focus,
    clear
})
</script>

<style scoped>
.prompt-input-container {
    align-items: center;
    position: relative;
    flex: 1;
}

.prompt-input {
    width: 100%;
    min-height: 52px;
    max-height: 104px; /* 3 lines max */
    border-radius: 0.5rem;
    border: 1px solid #404040;
    padding: 0.75rem 1rem;
    resize: none;
    font-size: 16px; /* Prevent mobile zoom */
    background-color: #374151;
    color: #f3f4f6;
    line-height: 1.5;
    vertical-align: top;
    box-sizing: border-box;
    overflow-y: hidden; /* Start hidden, show dynamically */
    /* Prevent mobile zoom on focus */
    -webkit-appearance: none;
    appearance: none;
    /* Custom scrollbar for when content exceeds 3 lines */
    scrollbar-width: thin;
    scrollbar-color: #4b5563 transparent;
}

.prompt-input::-webkit-scrollbar {
    width: 4px;
}

.prompt-input::-webkit-scrollbar-track {
    background: transparent;
}

.prompt-input::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 2px;
}

.prompt-input::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}

.prompt-input:focus {
    outline: none;
    border-color: transparent;
}

.prompt-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
    .prompt-input {
        min-height: 48px;
        max-height: 84px; /* 3 lines max on mobile */
        padding: 0.625rem 0.75rem;
        font-size: 16px; /* Ensure no zoom on mobile */
    }
}
</style>
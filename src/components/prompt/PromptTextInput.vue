<template>
    <div class="prompt-input-container">
        <textarea ref="textareaRef" v-model="message" :disabled="disabled" placeholder="Ask about game rules..."
            class="prompt-input" rows="1" @keydown="handleKeydown" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

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
})

watch(message, (newValue) => {
    emit('update:modelValue', newValue)
})

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
}

onMounted(() => {
    focus()
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
    height: 52px;
    border-radius: 0.5rem;
    border: 1px solid #404040;
    padding: 0.75rem 1rem;
    resize: none;
    font-size: 0.875rem;
    background-color: #374151;
    color: #f3f4f6;
    line-height: 1.75;
    vertical-align: top;
    box-sizing: border-box;
    /* Prevent mobile zoom on focus */
    font-size: 16px; /* iOS won't zoom if font-size is 16px or larger */
    -webkit-appearance: none;
    appearance: none;
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
        height: 48px;
        padding: 0.625rem 0.75rem;
        font-size: 16px; /* Ensure no zoom on mobile */
    }
}
</style>
<template>
    <div class="input-container">
        <div class="input-wrapper">
            <div class="input-row">
                <PromptTextInput ref="promptInputRef" v-model="message" :disabled="!canSend" @send="handleSend" />
                <SendButton :disabled="!canSend || !message.trim()" :is-loading="isLoading" @click="handleSend" />
            </div>
            <InputHint />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PromptTextInput from '@/components/prompt/PromptTextInput.vue'
import SendButton from '@/components/prompt/SendButton.vue'
import InputHint from '@/components/prompt/InputHint.vue'

interface Props {
    canSend: boolean
    isLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{ 'send-message': [message: string] }>()

const message = ref('')
const promptInputRef = ref()

const handleSend = () => {
    const cannotSend = !props.canSend
    const messageIsEmpty = !message.value.trim()
    
    if (cannotSend || messageIsEmpty) return

    emit('send-message', message.value.trim())
    message.value = ''
    promptInputRef.value?.clear()
}

const focus = () => {
    promptInputRef.value?.focus()
}

// Expose focus method for parent components
defineExpose({
    focus
})
</script>

<style scoped>
.input-container {
    background-color: #2d2d2d;
    padding: 0.25rem;
    padding-left: 0.15rem;

}

.input-wrapper {
    width: 100%;
    max-width: 56rem;
    margin: 0 auto;
    padding: 0.75rem;
}

.input-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

@media (min-width: 640px) {
    .input-container {
        padding-top: 0.5rem;
    }
}
</style>
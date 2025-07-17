<template>
    <div class="input-container">
        <div class="input-wrapper">
            <div class="input-row">
                <PromptTextInput ref="promptInputRef" v-model="message" :disabled="!canSend" @send="handleSend" />
                <div class="button-container">
                    <Transition name="fade" mode="out-in">
                        <RecordButton v-if="!message.trim()" key="record" :disabled="!canSend"
                            @transcript="handleTranscript" @error="handleVoiceError" />
                        <SendButton v-else key="send" :disabled="!canSend || !message.trim()" :is-loading="isLoading"
                            @click="handleSend" />
                    </Transition>
                </div>
            </div>
            <div class="hint-text">
                Type your message or click the microphone to speak.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PromptTextInput from '@/components/prompt/PromptTextInput.vue'
import SendButton from '@/components/prompt/SendButton.vue'
import RecordButton from '@/components/prompt/RecordButton.vue'

interface Props {
    canSend: boolean
    isLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'send-message': [message: string]
    'voice-error': [error: { type: string, message: string }]
}>()

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

const handleTranscript = (transcript: string) => {
    message.value = transcript
    promptInputRef.value?.focus()
}

const handleVoiceError = (error: { type: string, message: string }) => {
    emit('voice-error', error)
}

const focus = () => {
    promptInputRef.value?.focus()
}

defineExpose({
    focus
})
</script>

<style scoped>
.input-container {
    background-color: #2d2d2d;
    padding: 0.25rem;
    padding-left: 0.15rem;
    /* Ensure input stays above mobile keyboard */
    position: relative;
    z-index: 10;
    /* Add safe area padding for mobile */
    padding-bottom: max(0.25rem, env(safe-area-inset-bottom));
}

.input-wrapper {
    width: 100%;
    max-width: 56rem;
    margin: 0 auto;
    padding: 0.5rem;
    padding-bottom: 0.75rem;
    /* Ensure minimum padding on mobile */
    padding-left: max(0.75rem, env(safe-area-inset-left) + 0.75rem);
    padding-right: max(0.75rem, env(safe-area-inset-right) + 0.75rem);
}

.input-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.button-container {
    position: relative;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.hint-text {
    font-size: 0.8rem;
    color: #9ca3af;
    text-align: center;
    margin-top: 0.5rem;
    opacity: 0.8;
}

@media (min-width: 640px) {
    .input-container {
        padding-top: 0.5rem;
    }
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
    .input-wrapper {
        padding: 0.5rem;
        padding-left: max(0.5rem, env(safe-area-inset-left) + 0.5rem);
        padding-right: max(0.5rem, env(safe-area-inset-right) + 0.5rem);
    }

    .input-row {
        gap: 0.5rem;
    }

    .button-container {
        width: 48px;
        height: 48px;
    }
}
</style>
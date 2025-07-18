<template>
    <button @click="handleClick" :disabled="disabled || !isSupported" class="record-button" :class="{
        'recording': isRecording,
        'processing': isProcessing,
        'disabled': disabled || !isSupported
    }" :aria-label="buttonLabel" :title="tooltipText">
        <MicrophoneIcon v-if="!isRecording && !isProcessing" />
        <StopIcon v-else-if="isRecording" />
        <div v-else-if="isProcessing" class="loading-spinner"></div>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MicrophoneIcon, StopIcon } from '@/components/ui/icons'
import { useVoiceRecognition } from '@/composables/useVoiceRecognition'

interface Props {
    disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'transcript': [text: string]
    'error': [error: { type: string, message: string }]
}>()

const {
    isRecording,
    isProcessing,
    isSupported,
    startRecording,
    stopRecording,
    clearError,
} = useVoiceRecognition()

const buttonLabel = computed(() => {
    if (isRecording.value) return 'Stop recording'
    if (isProcessing.value) return 'Processing speech'
    return 'Start voice recording'
})

const tooltipText = computed(() => {
    if (!isSupported.value) return 'Voice recognition not supported in this browser'
    if (props.disabled) return 'Voice recording disabled'
    return buttonLabel.value
})

const handleClick = async () => {
    if (props.disabled || !isSupported.value) return

    if (isRecording.value) {
        // Stop recording when clicked during recording
        stopRecording()
        return
    }

    clearError()

    try {
        const result = await startRecording()
        emit('transcript', result.transcript)
    } catch (err: any) {
        emit('error', err)
    }
}
</script>

<style scoped>
.record-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border: none;
    border-radius: 50%;
    background-color: #374151;
    color: #f3f4f6;
    cursor: pointer;
    flex-shrink: 0;
    outline: none;
    transition: background-color 100ms, transform 100ms;
    /* Prevent mobile text selection and touch callouts */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}

.record-button:focus:not(:focus-visible) {
    box-shadow: none;
}

.record-button:hover:not(.disabled):not(.recording):not(.processing) {
    background-color: #4b5563;
    border-color: #6b7280;
}

.record-button.recording {
    background-color: #dc2626;
    border-color: #ef4444;
    animation: pulse 1.5s ease-in-out infinite;
}

.record-button.recording:hover {
    background-color: #dc2626;
    border-color: #ef4444;
}

.record-button.processing {
    background-color: #2563eb;
    border-color: #3b82f6;
}

.record-button.processing:hover {
    background-color: #2563eb;
    border-color: #3b82f6;
}

.record-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid #f3f4f6;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 8px rgba(220, 38, 38, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
    .record-button {
        width: 48px;
        height: 48px;
    }
}
</style>
<template>
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <slot name="header">
                    <h3 class="modal-title">{{ title }}</h3>
                </slot>
                <button @click="handleClose" class="close-button">
                    <CloseIcon />
                </button>
            </div>

            <div class="modal-body">
                <slot name="body" />
            </div>

            <div class="modal-footer">
                <slot name="footer">
                    <button @click="handleClose" class="cancel-button">Cancel</button>
                    <button @click="handleSubmit" :disabled="submitDisabled" class="submit-button">
                        {{ submitText }}
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CloseIcon } from '@/components/ui/icons'

interface Props {
    show: boolean
    title?: string
    submitText?: string
    submitDisabled?: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'submit'): void
}

withDefaults(defineProps<Props>(), {
    title: 'Modal',
    submitText: 'Submit',
    submitDisabled: false
})

const emit = defineEmits<Emits>()

const handleClose = () => {
    emit('close')
}

const handleOverlayClick = () => {
    handleClose()
}

const handleSubmit = () => {
    emit('submit')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background-color: #2d2d2d;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 32rem;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #374151;
    margin-bottom: 0.75rem;
}

.modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #f9fafb;
    margin: 0;
}

.close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s;
}

.close-button:hover {
    background-color: #374151;
    color: #f9fafb;
}

.modal-body {
    padding: 0 1.5rem;
}

.modal-footer {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid #374151;
    margin-top: 1.5rem;
}

.cancel-button {
    padding: 0.5rem 1rem;
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    background-color: transparent;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.cancel-button:hover {
    background-color: #374151;
    border-color: #6b7280;
}

.submit-button {
    padding: 0.5rem 1rem;
    border: 1px solid #3b82f6;
    border-radius: 0.375rem;
    background-color: #3b82f6;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.submit-button:hover:not(:disabled) {
    background-color: #2563eb;
    border-color: #2563eb;
}

.submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
<template>
    <div v-if="show" class="modal-overlay" :class="{ 'no-overlay': !showOverlay }" @click="handleOverlayClick">
        <div class="bottom-sheet" @click.stop>
            <div class="bottom-sheet-header">
                <h3 class="modal-title">{{ title }}</h3>
                <button @click="handleClose" class="close-button">
                    <CloseIcon />
                </button>
            </div>
            <div class="bottom-sheet-content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CloseIcon } from '@/components/ui/icons'

interface Props {
    show: boolean
    title: string
    showOverlay?: boolean
}

interface Emits {
    (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
    showOverlay: true
})
const emit = defineEmits<Emits>()

const handleClose = () => {
    emit('close')
}

const handleOverlayClick = () => {
    if (props.showOverlay) {
        handleClose()
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
}

.modal-overlay.no-overlay {
    background-color: transparent;
    pointer-events: none;
}

.modal-overlay.no-overlay .bottom-sheet {
    pointer-events: auto;
}

.bottom-sheet {
    background-color: #2d2d2d;
    border-radius: 1rem 1rem 0 0;
    width: 100%;
    max-width: 100vw;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease-out;
}

.bottom-sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #404040;
}

.modal-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f3f4f6;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
}

.close-button:hover {
    color: #f3f4f6;
}

.bottom-sheet-content {
    padding: 1.5rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .bottom-sheet {
        max-height: 90vh;
    }

    .bottom-sheet-content {
        padding: 1rem;
    }
}
</style>
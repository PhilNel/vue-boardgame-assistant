<template>
    <Transition name="toast">
        <div v-if="show" class="toast">
            <div class="toast-content" :class="variantClass">
                <span class="toast-message">{{ message }}</span>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    show: boolean
    message: string
    variant?: 'success' | 'error'
}

const props = defineProps<Props>()

const variantClass = computed(() => {
    return props.variant === 'error' ? 'toast-error' : 'toast-success'
})
</script>

<style scoped>
.toast {
    position: fixed;
    top: 5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    pointer-events: none;
}

.toast-content {
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
}

.toast-success {
    background-color: #065f46;
    color: #10b981;
    border: 1px solid #059669;
}

.toast-error {
    background-color: #7f1d1d;
    color: #f87171;
    border: 1px solid #dc2626;
}

.toast-message {
    display: block;
}

/* Transition animations */
.toast-enter-active {
    transition: all 0.3s ease-out;
}

.toast-leave-active {
    transition: all 0.3s ease-in;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
}

@media (max-width: 640px) {
    .toast {
        top: 4rem;
        left: max(1rem, env(safe-area-inset-left) + 1rem);
        right: max(1rem, env(safe-area-inset-right) + 1rem);
        transform: none;
        max-width: calc(100vw - 2rem);
    }

    .toast-content {
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        max-width: 100%;
        line-height: 1.4;
    }
}
</style>
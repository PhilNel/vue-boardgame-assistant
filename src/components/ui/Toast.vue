<template>
    <Transition name="toast">
        <div v-if="show" class="toast">
            <div class="toast-content">
                <span class="toast-message">{{ message }}</span>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
interface Props {
    show: boolean
    message: string
}

defineProps<Props>()
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
    background-color: #065f46;
    color: #10b981;
    border: 1px solid #059669;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
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
        left: 1rem;
        right: 1rem;
        transform: none;
    }

    .toast-content {
        text-align: center;
    }
}
</style>
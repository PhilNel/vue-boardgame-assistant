<template>
    <div class="loading-container">
        <!-- Avatar with subtle pulse animation -->
        <div class="avatar-container">
            <Avatar class="avatar" />
        </div>

        <!-- Thinking dots -->
        <div class="content">
            <div class="dots-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
</script>

<style scoped>
.loading-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
}

.avatar-container {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.avatar {
    width: 1.5rem;
    height: 1.5rem;
}

.content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dots-container {
    display: flex;
    gap: 0.25rem;
}

.dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #9ca3af;
    border-radius: 50%;
    animation: loadingDots 1.4s infinite;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

.message {
    color: #9ca3af;
    font-size: 0.875rem;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

@keyframes loadingDots {

    0%,
    20% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    80%,
    100% {
        opacity: 0;
    }
}
</style>
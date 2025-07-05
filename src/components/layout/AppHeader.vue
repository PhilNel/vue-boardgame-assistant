<template>
    <header class="app-header">
        <div class="header-content">
            <div class="app-title">
                <div class="avatar-container">
                    <WizardAvatar class="wizard-avatar" />
                </div>
                <h1 class="title-text">
                    Boardgame Wiz
                </h1>
            </div>

            <div class="header-actions">
                <ClearChatButton :show-button="showClearButton" @clear-chat="$emit('clear-chat')" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import WizardAvatar from '@/components/ui/WizardAvatar.vue'
import ClearChatButton from '@/components/chat/ClearChatButton.vue'

interface Props {
    showClearButton: boolean
}

defineProps<Props>()

defineEmits<{ 'clear-chat': [] }>()
</script>

<style scoped>
.app-header {
    background-color: #2d2d2d;
    border-bottom: 1px solid #404040;
    padding: 0.75rem 1rem;
}

.header-content {
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.app-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
}

.avatar-container {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.wizard-avatar {
    width: 2rem;
    height: 2rem;
}

.title-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #f3f4f6;
    flex-shrink: 0;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .title-text {
        font-size: 1.25rem;
    }
}
</style>
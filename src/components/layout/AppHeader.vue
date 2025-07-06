<template>
    <header class="app-header">
        <div class="header-content">
            <div class="app-title">
                <div class="avatar-container">
                    <Avatar class="avatar" />
                </div>
                <h1 class="title-text">
                    Boardgame Warlock
                </h1>
            </div>

            <div class="header-actions">
                <button @click="handleSettingsClick" class="settings-button" title="Settings">
                    <SettingsIcon />
                </button>
                <ClearChatButton :show-button="showClearButton" @clear-chat="$emit('clear-chat')" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
import ClearChatButton from '@/components/chat/ClearChatButton.vue'
import { SettingsIcon } from '@/components/ui/icons'

interface Props {
    showClearButton: boolean
}

defineProps<Props>()

const emit = defineEmits<{ 
    'clear-chat': []
    'open-settings': []
}>()

const handleSettingsClick = () => {
    emit('open-settings')
}
</script>

<style scoped>
.app-header {
    background-color: #2d2d2d;
    border-bottom: 1px solid #404040;
    padding: 0.75rem 1rem;
    /* Add safe area padding for mobile devices */
    padding-top: max(0.75rem, env(safe-area-inset-top) + 0.75rem);
    padding-left: max(1rem, env(safe-area-inset-left) + 1rem);
    padding-right: max(1rem, env(safe-area-inset-right) + 1rem);
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

.avatar {
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

.settings-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background-color: #2d2d2d;
    color: #f3f4f6;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 200ms;
}

.settings-button:hover {
    background-color: #4b5563;
}

@media (min-width: 640px) {
    .title-text {
        font-size: 1.25rem;
    }
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
    .app-header {
        padding: 0.5rem 0.75rem;
        padding-top: max(0.5rem, env(safe-area-inset-top) + 0.5rem);
        padding-left: max(0.75rem, env(safe-area-inset-left) + 0.75rem);
        padding-right: max(0.75rem, env(safe-area-inset-right) + 0.75rem);
    }
    
    .title-text {
        font-size: 1rem;
    }
    
    .header-actions {
        gap: 0.25rem;
    }
}
</style>
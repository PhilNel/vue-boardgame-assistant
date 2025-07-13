<template>
    <BaseModal :show="settingsStore.isModalOpen" title="Settings" submit-text="Save"
        :submit-disabled="!apiKeyInput.trim()" @close="handleClose" @submit="handleSave">
        <template #body>
            <div class="setting-section">
                <label for="api-key-input" class="setting-label">
                    API Key
                </label>
                <p class="setting-description">
                    Enter your API key to access the boardgame assistant.
                </p>
                <div class="input-group">
                    <input id="api-key-input" v-model="apiKeyInput" type="password" placeholder="Enter your API key"
                        class="api-key-input" @keyup.enter="handleSave" />
                    <button @click="toggleShowKey" class="toggle-visibility-button" title="Toggle visibility">
                        <EyeIcon v-if="showKey" />
                        <EyeOffIcon v-else />
                    </button>
                </div>
                <div v-if="settingsStore.hasApiKey" class="current-key-status">
                    <span class="status-text">✓ API key is set</span>
                    <button @click="handleClear" class="clear-button">
                        Clear
                    </button>
                </div>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons'
import BaseModal from '@/components/ui/BaseModal.vue'

const settingsStore = useSettingsStore()

const apiKeyInput = ref('')
const showKey = ref(false)

// Watch for modal opening to populate current API key
watch(() => settingsStore.isModalOpen, (isOpen) => {
    if (isOpen) {
        apiKeyInput.value = settingsStore.apiKey
        showKey.value = false
    }
})

const toggleShowKey = () => {
    showKey.value = !showKey.value
    const input = document.getElementById('api-key-input') as HTMLInputElement
    if (input) {
        input.type = showKey.value ? 'text' : 'password'
    }
}

const handleSave = () => {
    const key = apiKeyInput.value.trim()
    if (key) {
        settingsStore.setApiKey(key)
        settingsStore.closeModal()
    }
}

const handleClear = () => {
    if (confirm('Are you sure you want to clear your API key?')) {
        settingsStore.clearApiKey()
        apiKeyInput.value = ''
        settingsStore.closeModal()
    }
}

const handleClose = () => {
    settingsStore.closeModal()
}
</script>

<style scoped>
.setting-section {
    margin-bottom: 1.5rem;
}

.setting-label {
    display: block;
    font-weight: 500;
    color: #f3f4f6;
    margin-bottom: 0.5rem;
}

.setting-description {
    color: #9ca3af;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    line-height: 1.5;
}

.input-group {
    display: flex;
    align-items: center;
    position: relative;
}

.api-key-input {
    background-color: #374151;
    border: 1px solid #404040;
    border-radius: 0.5rem;
    padding: 0.75rem;
    padding-right: 3rem;
    color: #f3f4f6;
    width: 100%;
    font-size: 0.875rem;
}

.api-key-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #2563eb;
    border-color: transparent;
}

.api-key-input:placeholder {
    color: #9ca3af;
}

.toggle-visibility-button {
    position: absolute;
    right: 0.75rem;
    padding: 0.25rem;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    transition: color 200ms;
}

.toggle-visibility-button:hover {
    color: #f3f4f6;
}

.current-key-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    background-color: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 0.375rem;
}

.status-text {
    color: #22c55e;
    font-size: 0.875rem;
    font-weight: 500;
}

.clear-button {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 0.875rem;
    text-decoration: underline;
    transition: color 200ms;
}

.clear-button:hover {
    color: #f3f4f6;
}
</style>
<template>
  <div class="chat-interface">
    <AppHeader :show-clear-button="messages.length > 1" @clear-chat="handleClearChat"
      @open-settings="handleOpenSettings" />

    <GameSelector :selected-game="selectedGameId" :available-games="availableGames" :current-game-info="currentGameInfo"
      :has-messages="messages.length > 1" @change-game="handleGameChange" />

    <MessageList ref="messageListRef" :messages="messages" @copy-message="handleCopyMessage"
      @retry-message="handleRetryMessage" />

    <PromptInput ref="messageInputRef" :can-send="canSendMessage" :is-loading="isLoading"
      @send-message="handleSendMessage" />

    <SettingsModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChat } from '@/composables/useChat'
import { useGame } from '@/composables/useGame'
import { useSettingsStore } from '@/stores/settings'
import GameSelector from '@/components/game/GameSelector.vue'
import MessageList from '@/components/chat/MessageList.vue'
import PromptInput from '@/components/layout/PromptInput.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import SettingsModal from '@/components/settings/SettingsModal.vue'

const {
  messages,
  isLoading,
  canSendMessage,
  sendMessage,
  clearChat,
  retryLastMessage,
  copyMessage,
} = useChat()

const {
  selectedGame: currentGameInfo,
  selectedGameId,
  availableGames,
  changeGame,
} = useGame()

const settingsStore = useSettingsStore()

const messageListRef = ref()
const messageInputRef = ref()

const showToast = ref(false)
const toastMessage = ref('')

const handleSendMessage = async (message: string) => {
  await sendMessage(message)
}

const handleGameChange = (gameId: string) => {
  changeGame(gameId)
}

const handleClearChat = () => {
  clearChat()
  messageInputRef.value?.focus()
}

const handleCopyMessage = async (messageId: string) => {
  const success = await copyMessage(messageId)
  if (success) {
    showToast.value = true
    toastMessage.value = 'Message copied to clipboard'
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
}

const handleRetryMessage = async () => {
  await retryLastMessage()
}

const handleOpenSettings = () => {
  settingsStore.openModal()
}

onMounted(() => {
  messageInputRef.value?.focus()
})
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  background-color: #1a1a1a;
  /* Ensure proper stacking and no overflow */
  position: relative;
  overflow: hidden;
}
</style>
<template>
  <div class="chat-interface">
    <AppHeader :show-clear-button="messages.length > 1" @clear-chat="handleClearChat" />

    <GameSelector :selected-game="selectedGame" :available-games="availableGames" :current-game-info="currentGameInfo"
      :has-messages="messages.length > 1" @change-game="handleGameChange" />

    <MessageList ref="messageListRef" :messages="messages" @copy-message="handleCopyMessage"
      @retry-message="handleRetryMessage" />

    <PromptInput ref="messageInputRef" :can-send="canSendMessage" :is-loading="isLoading"
      @send-message="handleSendMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChat } from '@/composables/useChat'
import GameSelector from '@/components/game/GameSelector.vue'
import MessageList from '@/components/chat/MessageList.vue'
import PromptInput from '@/components/layout/PromptInput.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

// Chat composable
const {
  messages,
  selectedGame,
  currentGameInfo,
  isLoading,
  canSendMessage,
  sendMessage,
  changeGame,
  clearChat,
  retryLastMessage,
  copyMessage,
  availableGames,
} = useChat()

// Component refs
const messageListRef = ref()
const messageInputRef = ref()

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')

// Handlers
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

// Focus input on mount
onMounted(() => {
  messageInputRef.value?.focus()
})
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1a1a1a;
}
</style>
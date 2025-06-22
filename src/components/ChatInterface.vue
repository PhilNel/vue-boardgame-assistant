<template>
  <div class="flex flex-col h-screen bg-chat-bg">
    <!-- Header -->
    <header class="bg-chat-surface border-b border-chat-border px-4 py-3">
      <div class="w-full sm:max-w-4xl sm:mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-3 min-w-0 flex-1">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <WizardAvatar class="w-8 h-8" />
            </div>
            <h1 class="text-lg sm:text-xl font-semibold text-chat-text flex-shrink-0">
              Boardgame Wiz
            </h1>
          </div>
        </div>
        
        <div class="flex items-center space-x-2 flex-shrink-0">
          <!-- Clear Chat Button -->
          <button
            v-if="messages.length > 1"
            @click="handleClearChat"
            class="btn-secondary text-xs sm:text-sm px-2 sm:px-3 py-1 hidden sm:flex items-center"
            title="Clear chat history"
          >
            <ClearIcon class="w-4 h-4 mr-1" />
            Clear Chat
          </button>
          <!-- Mobile Clear Button -->
          <button
            v-if="messages.length > 1"
            @click="handleClearChat"
            class="btn-secondary p-2 sm:hidden"
            title="Clear chat history"
          >
            <ClearIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Game Selector -->
    <div class="bg-chat-surface border-b border-chat-border px-4 py-3">
      <div class="w-full sm:max-w-4xl sm:mx-auto">
        <GameSelector
          :selected-game="selectedGame"
          :available-games="availableGames"
          :current-game-info="currentGameInfo"
          :has-messages="messages.length > 1"
          @change-game="handleGameChange"
        />
      </div>
    </div>

    <!-- Messages -->
    <MessageList
      ref="messageListRef"
      :messages="messages"
      @copy-message="handleCopyMessage"
      @retry-message="handleRetryMessage"
    />

    <!-- Input -->
    <MessageInput
      ref="messageInputRef"
      :can-send="canSendMessage"
      :is-loading="isLoading"
      @send-message="handleSendMessage"
    />

    <!-- Toast Notifications -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-chat-surface border border-chat-border rounded-lg px-4 py-2 shadow-lg z-50"
    >
      <div class="flex items-center space-x-2 text-chat-text text-sm">
        <CheckIcon class="w-4 h-4 text-green-400" />
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import { useChat } from '@/composables/useChat'
import GameSelector from './GameSelector.vue'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import WizardAvatar from './WizardAvatar.vue'

// Simple SVG icons
const ClearIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', { d: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6' })
    ])
  }
}

const CheckIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', { d: 'M20 6L9 17l-5-5' })
    ])
  }
}

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
  if (confirm('Are you sure you want to clear the chat history?')) {
    clearChat()
    messageInputRef.value?.focus()
  }
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

// Keyboard shortcuts
const handleKeyboardShortcuts = (event: KeyboardEvent) => {
  // Ctrl/Cmd + K to focus input
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    messageInputRef.value?.focus()
  }
  
  // Ctrl/Cmd + Shift + C to clear chat
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
    event.preventDefault()
    handleClearChat()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboardShortcuts)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>
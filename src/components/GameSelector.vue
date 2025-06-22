<template>
  <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
    <div class="flex items-center space-x-3">
      <label for="game-select" class="text-chat-text font-medium flex-shrink-0">
        Game:
      </label>
      <div class="relative flex-1 sm:flex-none">
        <select
          id="game-select"
          :value="selectedGame"
          @change="handleGameChange"
          class="bg-chat-input border border-chat-border rounded-lg px-3 pr-8 py-2 text-chat-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full sm:w-32"
        >
          <option
            v-for="game in availableGames"
            :key="game.id"
            :value="game.id"
            :disabled="!game.isAvailable"
          >
            {{ game.name }}
            <span v-if="!game.isAvailable"> (Coming Soon)</span>
          </option>
        </select>
        
        <!-- Custom dropdown arrow -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="w-4 h-4 text-chat-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="text-chat-text-secondary text-xs sm:text-sm sm:flex-1">
      {{ currentGameInfo?.description }}
    </div>
  </div>
  
  <!-- Game change confirmation modal -->
  <div
    v-if="showConfirmation"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="cancelGameChange"
  >
    <div
      class="bg-chat-surface border border-chat-border rounded-lg p-6 max-w-md mx-4"
      @click.stop
    >
      <h3 class="text-lg font-semibold text-chat-text mb-3">
        Change Game?
      </h3>
      <p class="text-chat-text-secondary mb-4">
        Changing games will clear your current chat history. Are you sure you want to continue?
      </p>
      <div class="flex space-x-3 justify-end">
        <button
          @click="cancelGameChange"
          class="btn-secondary"
        >
          Cancel
        </button>
        <button
          @click="confirmGameChange"
          class="btn-primary"
        >
          Change Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GameInfo } from '@/types/chat'

interface Props {
  selectedGame: string
  availableGames: GameInfo[]
  currentGameInfo?: GameInfo
  hasMessages: boolean
}

interface Emits {
  (e: 'change-game', gameId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showConfirmation = ref(false)
const pendingGameId = ref<string>('')

const handleGameChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newGameId = target.value
  
  if (newGameId === props.selectedGame) return
  
  // If there are messages, show confirmation
  if (props.hasMessages) {
    pendingGameId.value = newGameId
    showConfirmation.value = true
  } else {
    // No messages, change immediately
    emit('change-game', newGameId)
  }
}

const confirmGameChange = () => {
  emit('change-game', pendingGameId.value)
  showConfirmation.value = false
  pendingGameId.value = ''
}

const cancelGameChange = () => {
  showConfirmation.value = false
  pendingGameId.value = ''
  // Reset select to current game
  const select = document.getElementById('game-select') as HTMLSelectElement
  if (select) {
    select.value = props.selectedGame
  }
}
</script> 
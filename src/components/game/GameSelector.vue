<template>
  <div class="game-selector-container">
    <div class="game-selector-content">
      <div class="game-selector-row">
        <div class="game-input-section">
          <label for="game-select" class="game-label">
            Game:
          </label>
          <div class="select-wrapper">
            <select id="game-select" :value="selectedGame" @change="handleGameChange" class="game-select">
              <option v-for="game in availableGames" :key="game.id" :value="game.id" :disabled="!game.isAvailable">
                {{ game.name }}
                <span v-if="!game.isAvailable"> (Coming Soon)</span>
              </option>
            </select>

            <!-- Custom dropdown arrow -->
            <div class="select-arrow">
              <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="game-description">
          {{ currentGameInfo?.description }}
        </div>
      </div>
    </div>
  </div>

  <!-- Game change confirmation modal -->
  <div v-if="showConfirmation" class="modal-overlay" @click="cancelGameChange">
    <div class="confirmation-modal" @click.stop>
      <h3 class="modal-title">
        Change Game?
      </h3>
      <p class="modal-text">
        Changing games will clear your current chat history. Are you sure you want to continue?
      </p>
      <div class="modal-actions">
        <button @click="cancelGameChange" class="modal-button secondary">
          Cancel
        </button>
        <button @click="confirmGameChange" class="modal-button primary">
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

<style scoped>
.game-selector-container {
  background-color: #2d2d2d;
  border-bottom: 1px solid #404040;
  padding: 0.75rem 1rem;
}

.game-selector-content {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
}

.game-selector-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-input-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.game-label {
  color: #f3f4f6;
  font-weight: 500;
  flex-shrink: 0;
}

.select-wrapper {
  position: relative;
  flex: 1;
}

.game-select {
  background-color: #374151;
  border: 1px solid #404040;
  border-radius: 0.5rem;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  color: #f3f4f6;
  width: 100%;
  appearance: none;
  cursor: pointer;
}

.game-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #2563eb;
  border-color: transparent;
}

.select-arrow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-right: 0.5rem;
  pointer-events: none;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.game-description {
  color: #9ca3af;
  font-size: 0.75rem;
  flex: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.confirmation-modal {
  background-color: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 28rem;
  margin: 1rem;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f3f4f6;
  margin-bottom: 0.75rem;
}

.modal-text {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.modal-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms;
}

.modal-button.secondary {
  background-color: #2d2d2d;
  color: #f3f4f6;
  border: 1px solid #404040;
}

.modal-button.secondary:hover {
  background-color: #4b5563;
}

.modal-button.primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.modal-button.primary:hover {
  background-color: #1d4ed8;
}

@media (min-width: 640px) {
  .game-selector-row {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }

  .game-input-section {
    flex: none;
  }

  .select-wrapper {
    flex: none;
    width: 8rem;
  }

  .game-description {
    font-size: 0.875rem;
  }
}
</style>
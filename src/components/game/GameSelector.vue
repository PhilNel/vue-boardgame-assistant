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

            <div class="select-arrow">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GameChangeConfirmationModal :show="showConfirmation" @confirm="confirmGameChange" @cancel="cancelGameChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GameInfo } from '@/types/chat'
import ChevronDownIcon from '@/components/ui/icons/ChevronDownIcon.vue'
import GameChangeConfirmationModal from './GameChangeConfirmationModal.vue'

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
  /* Add safe area padding for mobile devices */
  padding-left: max(1rem, env(safe-area-inset-left) + 1rem);
  padding-right: max(1rem, env(safe-area-inset-right) + 1rem);
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
  /* Prevent mobile zoom on focus */
  font-size: 16px;
  -webkit-appearance: none;
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
  color: #9ca3af;
}

.game-description {
  color: #9ca3af;
  font-size: 0.75rem;
  flex: 1;
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

/* Mobile-specific adjustments */
@media (max-width: 640px) {
  .game-selector-container {
    padding: 0.5rem 0.75rem;
    padding-left: max(0.75rem, env(safe-area-inset-left) + 0.75rem);
    padding-right: max(0.75rem, env(safe-area-inset-right) + 0.75rem);
  }

  .game-input-section {
    gap: 0.5rem;
  }

  .game-select {
    padding: 0.5rem 1.75rem 0.5rem 0.625rem;
    font-size: 16px;
    /* Ensure no zoom on mobile */
  }
}
</style>
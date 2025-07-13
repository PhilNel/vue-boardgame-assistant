<template>
  <div class="game-selector-container">
    <div class="game-selector-content">
      <div class="game-selector-row">
        <div class="game-input-section">
          <label for="game-select" class="game-label">
            Game:
          </label>
          <Select id="game-select" :model-value="selectedGame" @update:model-value="handleGameChange">
            <option v-for="game in availableGames" :key="game.id" :value="game.id" :disabled="!game.isAvailable">
              {{ game.name }}
              <span v-if="!game.isAvailable"> (Coming Soon)</span>
            </option>
          </Select>
        </div>
      </div>
    </div>
  </div>

  <GameChangeConfirmationModal :show="showConfirmation" @confirm="confirmGameChange" @cancel="cancelGameChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GameInfo } from '@/types/chat'
import Select from '@/components/ui/Select.vue'
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

const handleGameChange = (newGameId: string) => {
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

}
</style>
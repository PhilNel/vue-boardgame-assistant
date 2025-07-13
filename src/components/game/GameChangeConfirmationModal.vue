<template>
  <div v-if="show" class="modal-overlay" @click="$emit('cancel')">
    <div class="confirmation-modal" @click.stop>
      <h3 class="modal-title">
        Change Game?
      </h3>
      <p class="modal-text">
        Changing games will clear your current chat history. Are you sure you want to continue?
      </p>
      <div class="modal-actions">
        <button @click="$emit('cancel')" class="modal-button secondary">
          Cancel
        </button>
        <button @click="$emit('confirm')" class="modal-button primary">
          Change Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
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
  /* Add safe area padding for mobile */
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
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

/* Mobile-specific adjustments */
@media (max-width: 640px) {
  .confirmation-modal {
    margin: 0.75rem;
    padding: 1.25rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 
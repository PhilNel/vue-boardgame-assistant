<template>
  <button @click="handleClick" :disabled="disabled" class="send-button" :class="{ 'disabled': disabled }"
    aria-label="Send message">
    <SendIcon v-if="!isLoading" />
    <div v-else class="loading-spinner"></div>
  </button>
</template>

<script setup lang="ts">
import { SendIcon } from '@/components/ui/icons'

interface Props {
  disabled?: boolean
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{ click: [] }>()

const handleClick = () => {
  const isNotDisabled = !props.disabled
  const isNotLoading = !props.isLoading

  if (isNotDisabled && isNotLoading) {
    emit('click')
  }
}
</script>

<style scoped>
.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  outline: none;
  transition: background-color 200ms;
}

.send-button:hover:not(.disabled) {
  background-color: #1d4ed8;
}

.send-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
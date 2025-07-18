<template>
  <button @click="handleCopy" :class="buttonClass" title="Copy message">
    <CopyIcon />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CopyIcon } from '@/components/ui/icons'

interface Props {
  variant?: 'assistant' | 'user'
}

interface Emits {
  (e: 'copy'): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'assistant'
})

const emit = defineEmits<Emits>()

const buttonClass = computed(() => {
  return props.variant === 'user' ? 'copy-button user-copy-button' : 'copy-button assistant-copy-button'
})

const handleCopy = () => {
  emit('copy')
}
</script>

<style scoped>
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
}

/* Assistant message copy button - white icons */
.assistant-copy-button {
  color: #f9fafb;
}

.assistant-copy-button:hover {
  background-color: #374151;
  color: #ffffff;
}

/* User message copy button - fits the blue bubble */
.user-copy-button {
  color: #ffffff;
  opacity: 0.7;
  padding: 0.25rem;
}

.user-copy-button:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}
</style> 
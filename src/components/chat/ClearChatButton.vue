<template>
  <button 
    v-if="showButton" 
    @click="handleClearChat" 
    class="clear-button"
    title="Clear chat history"
  >
    <ClearIcon class="clear-icon" />
    <span class="clear-text">Clear Chat</span>
  </button>
</template>

<script setup lang="ts">
import { h } from 'vue'

interface Props {
    showButton: boolean
}

defineProps<Props>()

const emit = defineEmits<{ 'clear-chat': [] }>()

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

const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
        emit('clear-chat')
    }
}
</script>

<style scoped>
.clear-button {
  display: flex;
  align-items: center;
  background-color: #2d2d2d;
  color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms;
  padding: 0.5rem;
}

.clear-button:hover {
  background-color: #4b5563;
}

.clear-icon {
  width: 1rem;
  height: 1rem;
}

.clear-text {
  display: none;
  font-size: 0.875rem;
  margin-left: 0.25rem;
}

@media (min-width: 640px) {
  .clear-button {
    padding: 0.25rem 0.75rem;
  }
  
  .clear-text {
    display: inline;
  }
}
</style>
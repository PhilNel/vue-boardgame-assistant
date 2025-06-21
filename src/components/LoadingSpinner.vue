<template>
  <div class="flex items-center space-x-1 p-2">
    <div class="flex space-x-1">
      <div class="w-2 h-2 bg-chat-text-secondary rounded-full loading-dot"></div>
      <div class="w-2 h-2 bg-chat-text-secondary rounded-full loading-dot"></div>
      <div class="w-2 h-2 bg-chat-text-secondary rounded-full loading-dot"></div>
    </div>
    <span class="text-chat-text-secondary text-sm ml-2">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Thinking...'
})
</script> 
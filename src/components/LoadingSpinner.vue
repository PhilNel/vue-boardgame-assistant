<template>
  <div class="flex items-center space-x-3 p-2">
    <!-- Wizard Avatar with subtle pulse animation -->
    <div class="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden animate-pulse">
      <WizardAvatar class="w-6 h-6" />
    </div>
    
    <!-- Thinking dots -->
    <div class="flex items-center space-x-1">
      <div class="flex space-x-1">
        <div class="w-2 h-2 bg-chat-text-secondary rounded-full loading-dot"></div>
        <div class="w-2 h-2 bg-chat-text-secondary rounded-full loading-dot"></div>
        <div class="w-2 h-2 bg-chat-text-secondary rounded-full loading-dot"></div>
      </div>
      <span class="text-chat-text-secondary text-sm ml-2">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import WizardAvatar from './WizardAvatar.vue'

interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: ''
})
</script> 
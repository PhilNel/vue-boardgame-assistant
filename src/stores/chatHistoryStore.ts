import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { ChatMessage } from '@/types/chat'
import { chatHistoryService } from '@/services/chatHistoryService'
import { CHAT_HISTORY } from '@/constants/chat'
import { applySlidingWindow } from '@/utils/messageUtils'

export const useChatHistoryStore = defineStore('chatHistory', () => {
  const history = ref<ChatMessage[]>([])

  const historyContext = computed(() => {
    return history.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  })

  function loadHistory(gameId: string) {
    history.value = chatHistoryService.getHistory(gameId)
  }

  function saveMessage(gameId: string, message: ChatMessage) {
    const shouldAddMessageToHistory = message.role === 'user' || message.role === 'assistant';
    if (shouldAddMessageToHistory) {
      chatHistoryService.saveMessage(gameId, message)
      history.value.push(message)
      history.value = applySlidingWindow(history.value, CHAT_HISTORY.MAX_MESSAGES)
    } else {
      console.warn('Skipping message in history:', message)
    }
  }

  function clearHistory(gameId: string) {
    chatHistoryService.clearHistory(gameId)
    history.value = []
  }

  return {
    history: readonly(history),
    historyContext,
    loadHistory,
    saveMessage,
    clearHistory
  }
}) 
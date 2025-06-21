import { reactive, computed, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage, ChatSession, ChatState, LoadingState } from '@/types/chat'
import { ApiService, AVAILABLE_GAMES } from '@/services/api'

// Global state (persists across component unmounts)
const chatState = reactive<ChatState>({
  currentSession: null,
  selectedGame: 'nemesis', // Default to Nemesis
  isLoading: false,
  error: null,
})

const loadingState = reactive<LoadingState>({
  isTyping: false,
  isSending: false,
  hasError: false,
})

export function useChat() {
  // Create a new chat session
  const createSession = (gameId: string): ChatSession => {
    const session: ChatSession = {
      id: uuidv4(),
      game: gameId,
      messages: [],
      createdAt: new Date(),
    }
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      content: `Welcome to Boardgame Wiz! \nI'm Ernest, your magical assistant for ${AVAILABLE_GAMES.find(g => g.id === gameId)?.name || 'board game'} rules. \nHow can I help you today?`,
      role: 'assistant',
      timestamp: new Date(),
    }
    
    session.messages.push(welcomeMessage)
    return session
  }

  // Initialize or get current session
  const initializeSession = () => {
    if (!chatState.currentSession || chatState.currentSession.game !== chatState.selectedGame) {
      chatState.currentSession = createSession(chatState.selectedGame)
    }
  }

  // Send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return
    
    initializeSession()
    if (!chatState.currentSession) return

    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    // Create loading message for assistant response
    const loadingMessage: ChatMessage = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    }

    // Add messages to session
    chatState.currentSession.messages.push(userMessage, loadingMessage)
    
    // Update loading state
    loadingState.isSending = true
    loadingState.hasError = false
    chatState.error = null

    try {
      // Scroll to bottom after adding messages
      await nextTick()
      scrollToBottom()

      // Call API
      const response = await ApiService.sendMessage({
        message: content,
        sessionId: chatState.currentSession.id,
        game: chatState.selectedGame,
      })

      // Remove loading message
      const messageIndex = chatState.currentSession.messages.findIndex(m => m.id === loadingMessage.id)
      if (messageIndex !== -1) {
        chatState.currentSession.messages.splice(messageIndex, 1)
      }

      if (response.success && response.data) {
        // Add successful response
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          content: response.data.message,
          role: 'assistant',
          timestamp: new Date(response.data.timestamp),
        }
        chatState.currentSession.messages.push(assistantMessage)
      } else {
        // Add error message
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          content: response.error?.message || 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
          error: response.error?.code,
        }
        chatState.currentSession.messages.push(errorMessage)
        loadingState.hasError = true
        chatState.error = response.error?.message || 'An error occurred'
      }

    } catch (error) {
      // Remove loading message on error
      const messageIndex = chatState.currentSession.messages.findIndex(m => m.id === loadingMessage.id)
      if (messageIndex !== -1) {
        chatState.currentSession.messages.splice(messageIndex, 1)
      }

      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, I\'m having trouble connecting. Please check your connection and try again.',
        role: 'assistant',
        timestamp: new Date(),
        error: 'CONNECTION_ERROR',
      }
      chatState.currentSession.messages.push(errorMessage)
      
      loadingState.hasError = true
      chatState.error = 'Connection error'
      console.error('Chat error:', error)
    } finally {
      loadingState.isSending = false
      
      // Scroll to bottom after response
      await nextTick()
      scrollToBottom()
    }
  }

  // Change selected game
  const changeGame = (gameId: string) => {
    chatState.selectedGame = gameId
    chatState.currentSession = createSession(gameId)
    chatState.error = null
    loadingState.hasError = false
  }

  // Clear current chat
  const clearChat = () => {
    if (chatState.currentSession) {
      chatState.currentSession = createSession(chatState.selectedGame)
    }
    chatState.error = null
    loadingState.hasError = false
  }

  // Retry last message (in case of error)
  const retryLastMessage = () => {
    if (!chatState.currentSession) return
    
    const messages = chatState.currentSession.messages
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    
    if (lastUserMessage) {
      // Remove any assistant messages after the last user message
      const lastUserIndex = messages.findIndex(m => m.id === lastUserMessage.id)
      chatState.currentSession.messages = messages.slice(0, lastUserIndex + 1)
      
      // Resend the message
      sendMessage(lastUserMessage.content)
    }
  }

  // Scroll to bottom utility
  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  // Copy message content
  const copyMessage = async (messageId: string) => {
    if (!chatState.currentSession) return false
    
    const message = chatState.currentSession.messages.find(m => m.id === messageId)
    if (!message) return false
    
    try {
      await navigator.clipboard.writeText(message.content)
      return true
    } catch (error) {
      console.error('Failed to copy message:', error)
      return false
    }
  }

  // Computed properties
  const messages = computed(() => chatState.currentSession?.messages || [])
  const selectedGame = computed(() => chatState.selectedGame)
  const currentGameInfo = computed(() => 
    AVAILABLE_GAMES.find(game => game.id === chatState.selectedGame)
  )
  const isLoading = computed(() => loadingState.isSending)
  const hasError = computed(() => loadingState.hasError)
  const canSendMessage = computed(() => !loadingState.isSending)

  // Initialize session on first use
  initializeSession()

  return {
    // State
    messages,
    selectedGame,
    currentGameInfo,
    isLoading,
    hasError,
    canSendMessage,
    error: computed(() => chatState.error),
    
    // Actions
    sendMessage,
    changeGame,
    clearChat,
    retryLastMessage,
    copyMessage,
    scrollToBottom,
    
    // Available games
    availableGames: AVAILABLE_GAMES,
  }
} 
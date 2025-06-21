export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  isLoading?: boolean
  error?: string
}

export interface ChatSession {
  id: string
  game: string
  messages: ChatMessage[]
  createdAt: Date
}

export interface GameInfo {
  id: string
  name: string
  description: string
  isAvailable: boolean
}

export interface ApiResponse {
  success: boolean
  data?: {
    message: string
    timestamp: string
  }
  error?: {
    code: string
    message: string
  }
}

export interface SendMessageRequest {
  message: string
  sessionId: string
  game: string
}

export interface ChatState {
  currentSession: ChatSession | null
  selectedGame: string
  isLoading: boolean
  error: string | null
}

export type MessageRole = ChatMessage['role']

export interface LoadingState {
  isTyping: boolean
  isSending: boolean
  hasError: boolean
} 
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  isLoading?: boolean
  error?: string
  token_count?: number // For future use with token counting
}

export interface ChatSession {
  id: string
  game: string
  messages: ChatMessage[]
  createdAt: Date
}

export interface ConversationContext {
  session_id: string
  game: string
  messages: ChatMessage[] // Max 4 messages
  created_at: Date
  last_updated: Date
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
  conversation_history?: ChatMessage[] // For future backend integration
}

export interface ContextualChatRequest {
  question: string
  game: string
  session_id: string
  conversation_history?: ChatMessage[] // Last 4 messages
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
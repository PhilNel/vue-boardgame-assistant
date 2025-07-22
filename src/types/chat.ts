export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface ReferenceInfo {
  id: number
  title: string
  section: string
  page: string
  url: string
}

export interface ChatMessage {
  id: string
  content: string
  role: MessageRole
  timestamp: Date
  isLoading?: boolean
  error?: string
  references?: ReferenceInfo[]
  user_feedback?: {
    type: 'positive' | 'negative'
    submitted_at: string
  }
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

export interface ApiResponseData {
  message: string
  references?: ReferenceInfo[]
  timestamp: string
}

export interface ApiResponse {
  success: boolean
  data?: ApiResponseData
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

export interface LoadingState {
  isTyping: boolean
  isSending: boolean
  hasError: boolean
}
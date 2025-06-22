import type { ApiResponse, SendMessageRequest, GameInfo } from '@/types/chat'

// Runtime configuration
const getConfig = () => {
  // @ts-ignore - window.APP_CONFIG is loaded from config.js
  return window.APP_CONFIG || {
    API_BASE_URL: 'https://7i699s4dxh.execute-api.eu-west-1.amazonaws.com/dev/api/v1',
    API_KEY: (import.meta as any).env?.VITE_API_KEY || '', // Fallback to build-time env var
    ENVIRONMENT: 'development'
  }
}

const config = getConfig()

// Available games
export const AVAILABLE_GAMES: GameInfo[] = [
  {
    id: 'nemesis',
    name: 'Nemesis',
    description: 'A semi-cooperative survival horror board game',
    isAvailable: true,
  },
]

// API configuration
const API_BASE_URL = config.API_BASE_URL
const API_KEY = config.API_KEY

function handleApiError(error: any): ApiResponse {
  console.error('API Error:', error)
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your internet connection.',
      }
    }
  }
  
  return {
    success: false,
    error: {
      code: 'API_ERROR',
      message: error.message || 'An unexpected error occurred. Please try again.',
    }
  }
}

export class ApiService {
  static async sendMessage(request: SendMessageRequest): Promise<ApiResponse> {
    try {
      // Validate input
      if (!request.message.trim()) {
        return {
          success: false,
          error: {
            code: 'EMPTY_MESSAGE',
            message: 'Please enter a question about the game rules.',
          }
        }
      }

      console.log('🚀 Sending request to API:', { game: request.game, question: request.message })

      // Make API call to your AWS API Gateway
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          gameName: request.game,
          question: request.message,
          session_id: request.sessionId || undefined,
        }),
      })

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'API key is invalid or missing. Please check your configuration.',
            }
          }
        }
        
        if (response.status === 429) {
          return {
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests. Please wait a moment before trying again.',
            }
          }
        }
        
        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: errorData.message || `Server error: ${response.status}`,
          }
        }
      }

      // Parse successful response
      const data = await response.json()
      console.log('✅ API Response received:', data)
      
      return {
        success: true,
        data: {
          message: data.answer,
          timestamp: new Date().toISOString(),
        }
      }
      
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  static async getAvailableGames(): Promise<GameInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        headers: {
          'x-api-key': API_KEY,
        },
      })

      if (!response.ok) {
        console.warn('Failed to fetch games from API, using fallback')
        return AVAILABLE_GAMES
      }

      const data = await response.json()
      
      // Transform API response to GameInfo format
      if (data.games && Array.isArray(data.games)) {
        return data.games.map((game: string) => ({
          id: game,
          name: game.charAt(0).toUpperCase() + game.slice(1),
          description: `Rules assistant for ${game}`,
          isAvailable: true,
        }))
      }
      
      return AVAILABLE_GAMES
      
    } catch (error) {
      console.warn('Failed to fetch games from API, using fallback:', error)
      return AVAILABLE_GAMES
    }
  }
} 
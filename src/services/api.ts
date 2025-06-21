import type { ApiResponse, SendMessageRequest, GameInfo } from '@/types/chat'

// Mock game data
export const AVAILABLE_GAMES: GameInfo[] = [
  {
    id: 'nemesis',
    name: 'Nemesis',
    description: 'Semi-cooperative survival horror board game',
    isAvailable: true,
  },
  // Future games can be added here
  {
    id: 'gloomhaven',
    name: 'Gloomhaven',
    description: 'Tactical combat and RPG elements',
    isAvailable: false,
  },
]

// Mock responses for different types of questions
const MOCK_RESPONSES: Record<string, string> = {
  movement: `**Movement in Nemesis:**

Movement is one of the core mechanics in Nemesis. Here's how it works:

• **Movement Points**: Each character has a Movement value (usually 2-3) that determines how many rooms they can move through per turn.

• **Room-to-Room**: You move from room to room, not spaces within rooms. Each connected room costs 1 Movement point.

• **Doors**: Moving through a closed door costs 1 additional Movement point (so 2 total to move through a closed door to an adjacent room).

• **Crawling**: If you're in a room with a Malfunction token, movement costs +1 additional point.

• **No Diagonal Movement**: You can only move through connected corridors and rooms as shown on the board.

**Important**: You cannot end your movement in a corridor - you must end in a room!`,

  victory: `**Victory Conditions in Nemesis:**

Nemesis has multiple victory conditions depending on your character's objectives:

**Corporate Objectives:**
• Each player has 2 Corporate Objective cards
• You need to complete at least 1 to have a chance at victory
• Common objectives include: reaching specific rooms, scanning aliens, destroying eggs, etc.

**Survival Requirements:**
• You must survive until the end of the game
• This means not dying from wounds, contamination, or alien attacks

**Ship Status:**
• The ship must reach Earth (or your objective destination)
• Some objectives require the ship to be destroyed instead

**Winning Priority:**
1. Players who completed Corporate Objectives AND survived
2. If multiple players qualify, compare who completed more objectives
3. If tied, compare contamination levels (lower wins)

Remember: Nemesis is semi-cooperative - you want others to help you survive, but only YOU need to win!`,

  reload: `**Reloading Weapons in Nemesis:**

Weapon reloading follows these rules:

**Automatic Weapons** (like Pulse Rifle):
• Show ammo tokens on the weapon card
• After firing, remove 1 ammo token
• **Reload Action**: Spend 1 Action to restore all ammo tokens

**Single-Shot Weapons** (like Shotgun):
• No ammo tokens - each shot requires a reload
• After firing, the weapon is "empty"
• **Reload Action**: Spend 1 Action to reload (flip card back to ready)

**Malfunction Effects:**
• If you roll a Malfunction while shooting, the weapon jams
• Place a Malfunction token on the weapon
• You must spend 1 Action to remove the Malfunction before the weapon can be used again

**Action Economy Tip**: Try to reload during safe moments, not when aliens are in your room!`,

  contamination: `**Contamination in Nemesis:**

Contamination represents alien infection and is a major threat:

**Gaining Contamination:**
• Being in the same room as certain aliens
• Failing some Event cards
• Some room effects
• Alien attacks (depending on the alien type)

**Contamination Cards:**
• When you gain contamination, draw a Contamination card
• Keep it secret from other players
• Some are immediate effects, others trigger later

**Contamination Bag:**
• Contains both Contamination cards and Infection cards
• As the game progresses, more dangerous Infection cards are added
• This makes contamination increasingly deadly

**Death by Contamination:**
• If you draw an Infection card, you may die instantly
• The more contaminated you are, the higher the risk

**Managing Contamination:**
• Some items and actions can remove contamination
• The Medic character has special contamination abilities
• Prevention is better than cure - avoid contaminated areas when possible!`,

  default: `🧙‍♂️ **Welcome to the magical realm of Nemesis rules!** 

I'm here to help you master the arcane arts of this cosmic horror game. My spellbook contains knowledge about:

✨ **Movement and Actions** - Navigate the ship like a true space wizard
⚔️ **Combat** - Battle aliens with magical precision  
🏆 **Victory Conditions** - Learn the secret paths to triumph
🧪 **Contamination** - Understand the dark magic of infection
🎭 **Character Abilities** - Harness each character's unique powers
⏰ **Game Flow** - Master the mystical turn sequence
🔮 **Equipment** - Wield items and weapons with expertise

What magical knowledge shall I conjure for you today?`,
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Simple keyword matching for mock responses
function getResponseForQuestion(question: string, game: string): string {
  const lowerQuestion = question.toLowerCase()
  
  if (game !== 'nemesis') {
    return `🧙‍♂️ My magical powers are currently focused on Nemesis! Support for ${game} is brewing in my cauldron and will be ready soon! ✨`
  }
  
  if (lowerQuestion.includes('movement') || lowerQuestion.includes('move')) {
    return MOCK_RESPONSES.movement
  }
  
  if (lowerQuestion.includes('victory') || lowerQuestion.includes('win') || lowerQuestion.includes('objective')) {
    return MOCK_RESPONSES.victory
  }
  
  if (lowerQuestion.includes('reload') || lowerQuestion.includes('weapon') || lowerQuestion.includes('ammo')) {
    return MOCK_RESPONSES.reload
  }
  
  if (lowerQuestion.includes('contamination') || lowerQuestion.includes('infection') || lowerQuestion.includes('contaminated')) {
    return MOCK_RESPONSES.contamination
  }
  
  return MOCK_RESPONSES.default
}

export class ApiService {
  static async sendMessage(request: SendMessageRequest): Promise<ApiResponse> {
    // Simulate realistic API delay
    const delayTime = Math.random() * 2000 + 1000 // 1-3 seconds
    await delay(delayTime)
    
    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: {
          code: 'TEMPORARY_ERROR',
          message: 'Service temporarily unavailable. Please try again.',
        }
      }
    }
    
    // Simulate empty message error
    if (!request.message.trim()) {
      return {
        success: false,
        error: {
          code: 'EMPTY_MESSAGE',
          message: 'Please enter a question about the game rules.',
        }
      }
    }
    
    const response = getResponseForQuestion(request.message, request.game)
    
    return {
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      }
    }
  }
  
  static async getAvailableGames(): Promise<GameInfo[]> {
    await delay(500) // Simulate API call
    return AVAILABLE_GAMES
  }
} 
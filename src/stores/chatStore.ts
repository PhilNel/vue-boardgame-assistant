import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage, ChatSession } from "@/types/chat";
import { useGameStore } from "./gameStore";
import { createAssistantMessage } from "@/utils/messageUtils";

export const useChatStore = defineStore("chat", {
  state: () => ({
    sessions: new Map<string, ChatSession>(),
    currentSessionId: null as string | null,
    isLoading: false,
    error: null as string | null,
    isSending: false,
    hasError: false,
  }),

  getters: {
    currentSession: (state) =>
      state.currentSessionId
        ? state.sessions.get(state.currentSessionId)
        : null,

    messages: (state) => {
      const session = state.currentSessionId
        ? state.sessions.get(state.currentSessionId)
        : null;
      return session?.messages || [];
    },

    canSendMessage: (state) => !state.isSending,
  },

  actions: {
    createSession(gameId: string): ChatSession {
      const gameStore = useGameStore();
      const game = gameStore.availableGames.find((g) => g.id === gameId);

      const session: ChatSession = {
        id: uuidv4(),
        game: gameId,
        messages: [],
        createdAt: new Date(),
      };

      const welcomeMessage = createAssistantMessage(
        `Welcome to Boardgame Warlock! \nI'm Ernest, your magical assistant for ${
          game?.name || "board game"
        } rules. \nHow can I help you today?`
      );

      session.messages.push(welcomeMessage);
      this.sessions.set(session.id, session);

      return session;
    },

    initializeSession() {
      const gameStore = useGameStore();
      const currentGame = gameStore.selectedGameId;

      const hasCurrentSessionId = !!this.currentSessionId
      const sessionExists = hasCurrentSessionId && this.sessions.has(this.currentSessionId!)
      const sessionMatchesSelectedGame = sessionExists && this.sessions.get(this.currentSessionId!)?.game === currentGame

      if (!sessionExists || !sessionMatchesSelectedGame) {
        const newSession = this.createSession(currentGame);
        this.currentSessionId = newSession.id;
      }
    },

    addMessage(message: ChatMessage) {
      if (!this.currentSessionId) return;

      const session = this.sessions.get(this.currentSessionId);
      if (session) {
        session.messages.push(message);
      }
    },

    removeMessage(messageId: string) {
      if (!this.currentSessionId) return;

      const session = this.sessions.get(this.currentSessionId);
      if (session) {
        const index = session.messages.findIndex((m) => m.id === messageId);
        if (index !== -1) {
          session.messages.splice(index, 1);
        }
      }
    },

    updateMessage(messageId: string, updates: Partial<ChatMessage>) {
      if (!this.currentSessionId) return;

      const session = this.sessions.get(this.currentSessionId);
      if (session) {
        const message = session.messages.find((m) => m.id === messageId);
        if (message) {
          Object.assign(message, updates);
        }
      }
    },

    clearCurrentSession() {
      const gameStore = useGameStore();
      if (this.currentSessionId) {
        this.sessions.delete(this.currentSessionId);
      }
      const newSession = this.createSession(gameStore.selectedGameId);
      this.currentSessionId = newSession.id;
      this.clearError();
    },

    setLoading(loading: boolean) {
      this.isSending = loading;
    },

    setError(error: string | null) {
      this.error = error;
      this.hasError = !!error;
    },

    clearError() {
      this.error = null;
      this.hasError = false;
    },

    // Remove messages after a specific user message (for retry functionality)
    removeMessagesAfterUserMessage(userMessageId: string) {
      if (!this.currentSessionId) return;

      const session = this.sessions.get(this.currentSessionId);
      if (session) {
        const userMessageIndex = session.messages.findIndex(
          (m) => m.id === userMessageId
        );
        if (userMessageIndex !== -1) {
          session.messages = session.messages.slice(0, userMessageIndex + 1);
        }
      }
    },

    getLastUserMessage(): ChatMessage | null {
      if (!this.currentSessionId) return null;

      const session = this.sessions.get(this.currentSessionId);
      if (!session) return null;

      return (
        [...session.messages].reverse().find((m) => m.role === "user") || null
      );
    },
  },
});

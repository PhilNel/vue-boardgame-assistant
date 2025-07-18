import { defineStore } from "pinia";
import type { ChatMessage } from "@/types/chat";
import { useChatHistoryStore } from "./chatHistoryStore";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [] as ChatMessage[],
    currentGame: null as string | null,
    isLoading: false,
    error: null as string | null,
    isSending: false,
    hasError: false,
  }),

  getters: {
    canSendMessage: (state) => !state.isSending,
  },

  actions: {
    initializeForGame(gameId: string) {
      if (this.currentGame !== gameId) {
        this.currentGame = gameId;

        const historyStore = useChatHistoryStore();
        historyStore.loadHistory(gameId);

        if (historyStore.history.length > 0) {
          this.messages = [...historyStore.history];
        } else {
          this.messages = [];
        }
      }
    },

    addMessage(message: ChatMessage) {
      this.messages.push(message);

      if (this.currentGame) {
        const historyStore = useChatHistoryStore();
        historyStore.saveMessage(this.currentGame, message);
      }
    },

    removeMessage(messageId: string) {
      const index = this.messages.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    },

    updateMessage(messageId: string, updates: Partial<ChatMessage>) {
      const message = this.messages.find((m) => m.id === messageId);
      if (message) {
        Object.assign(message, updates);
        
        if (this.currentGame) {
          const historyStore = useChatHistoryStore();
          historyStore.saveMessage(this.currentGame, message);
        }
      }
    },

    clearMessages() {
      if (this.currentGame) {
        const historyStore = useChatHistoryStore();
        historyStore.clearHistory(this.currentGame);
      }

      this.messages = [];
      this.clearError();
    },

    startNewConversation() {
      this.clearMessages();
    },

    removeMessagesAfterUserMessage(userMessageId: string) {
      const userMessageIndex = this.messages.findIndex(
        (m) => m.id === userMessageId
      );
      if (userMessageIndex !== -1) {
        this.messages = this.messages.slice(0, userMessageIndex + 1);
      }
    },

    getLastUserMessage(): ChatMessage | null {
      return (
        [...this.messages].reverse().find((m) => m.role === "user") || null
      );
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
  },
});

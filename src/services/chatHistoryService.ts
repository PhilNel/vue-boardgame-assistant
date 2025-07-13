import type { ChatMessage } from "@/types/chat";
import { CHAT_HISTORY } from "@/constants/chat";
import { applySlidingWindow } from "@/utils/messageUtils";

class ChatHistoryService {
  saveMessage(gameId: string, message: ChatMessage): void {
    try {
      const isLoadingMessage = message.isLoading || message.role === "system";
      if (isLoadingMessage) {
        return;
      }

      const messages = this.getHistory(gameId);
      messages.push(message);

      const trimmedMessages = applySlidingWindow(
        messages,
        CHAT_HISTORY.MAX_MESSAGES
      );

      this.saveHistory(gameId, trimmedMessages);
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  }

  getHistory(gameId: string): ChatMessage[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(gameId));
      if (!stored) return [];

      const messages = JSON.parse(stored) as ChatMessage[];
      return messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error("Failed to get history:", error);
      return [];
    }
  }

  clearHistory(gameId: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(gameId));
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  }

  private saveHistory(gameId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(
        this.getStorageKey(gameId),
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  }

  private getStorageKey(gameId: string): string {
    return `${CHAT_HISTORY.STORAGE_PREFIX}_${gameId}`;
  }
}

export const chatHistoryService = new ChatHistoryService();

import { computed, nextTick } from "vue";
import { useChatStore } from "@/stores/chatStore";
import { useGameStore } from "@/stores/gameStore";
import { createUserMessage, createLoadingMessage } from "@/utils/messageUtils";
import {
  handleApiResponse,
  handleApiError,
  sendChatMessage,
} from "@/utils/chatUtils";

export function useChat() {
  
  const chatStore = useChatStore();
  const gameStore = useGameStore();
  chatStore.initializeForGame(gameStore.selectedGameId);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage = createUserMessage(content);
    chatStore.addMessage(userMessage);

    await sendMessageWithLoading(content);
  };

  const clearChat = () => {
    chatStore.clearMessages();
  };

  const startNewConversation = () => {
    chatStore.startNewConversation();
  };

  const retryLastMessage = async () => {
    const lastUserMessage = chatStore.getLastUserMessage();
    if (!lastUserMessage) return;

    chatStore.removeMessagesAfterUserMessage(lastUserMessage.id);
    await sendMessageWithLoading(lastUserMessage.content);
  };

  const copyMessage = async (messageId: string) => {
    const message = chatStore.messages.find((m) => m.id === messageId);
    if (!message) return false;

    try {
      await navigator.clipboard.writeText(message.content);
      return true;
    } catch (error) {
      console.error("Failed to copy message:", error);
      return false;
    }
  };


  const sendMessageWithLoading = async (content: string) => {
    const loadingMessage = createLoadingMessage();
    chatStore.addMessage(loadingMessage);
    chatStore.setLoading(true);
    chatStore.clearError();

    try {
      await nextTick();

      const response = await sendChatMessage(
        content,
        crypto.randomUUID(),
        gameStore.selectedGameId
      );

      await handleApiResponse(response, loadingMessage, chatStore);
    } catch (error) {
      handleApiError(error, loadingMessage, chatStore);
    } finally {
      chatStore.setLoading(false);
      await nextTick();
    }
  };

  return {
    messages: computed(() => chatStore.messages),
    isLoading: computed(() => chatStore.isSending),
    hasError: computed(() => chatStore.hasError),
    canSendMessage: computed(() => chatStore.canSendMessage),
    error: computed(() => chatStore.error),
    sendMessage,
    clearChat,
    startNewConversation,
    retryLastMessage,
    copyMessage,
  };
}

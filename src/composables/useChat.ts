import { computed, nextTick } from "vue";
import { useChatStore } from "@/stores/chatStore";
import { useGameStore } from "@/stores/gameStore";
import { createUserMessage, createLoadingMessage } from "@/utils/messageUtils";
import {
  scrollToBottom,
  handleApiResponse,
  handleApiError,
  sendChatMessage,
} from "@/utils/chatUtils";

export function useChat() {
  const chatStore = useChatStore();
  const gameStore = useGameStore();

  chatStore.initializeSession();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    chatStore.initializeSession();

    const userMessage = createUserMessage(content);
    const loadingMessage = createLoadingMessage();

    chatStore.addMessage(userMessage);
    chatStore.addMessage(loadingMessage);
    chatStore.setLoading(true);
    chatStore.clearError();

    try {
      await nextTick();
      scrollToBottom();

      const response = await sendChatMessage(
        content,
        chatStore.currentSessionId!,
        gameStore.selectedGameId
      );

      await handleApiResponse(response, loadingMessage, chatStore);
    } catch (error) {
      handleApiError(error, loadingMessage, chatStore);
    } finally {
      chatStore.setLoading(false);
      await nextTick();
      scrollToBottom();
    }
  };

  const clearChat = () => {
    chatStore.clearCurrentSession();
  };

  const retryLastMessage = async () => {
    const lastUserMessage = chatStore.getLastUserMessage();
    if (!lastUserMessage) return;

    chatStore.removeMessagesAfterUserMessage(lastUserMessage.id);

    const loadingMessage = createLoadingMessage();
    chatStore.addMessage(loadingMessage);
    chatStore.setLoading(true);
    chatStore.clearError();

    try {
      await nextTick();
      scrollToBottom();

      const response = await sendChatMessage(
        lastUserMessage.content,
        chatStore.currentSessionId!,
        gameStore.selectedGameId
      );

      await handleApiResponse(response, loadingMessage, chatStore);
    } catch (error) {
      handleApiError(error, loadingMessage, chatStore);
    } finally {
      chatStore.setLoading(false);
      await nextTick();
      scrollToBottom();
    }
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

  return {
    messages: computed(() => chatStore.messages),
    isLoading: computed(() => chatStore.isSending),
    hasError: computed(() => chatStore.hasError),
    canSendMessage: computed(() => chatStore.canSendMessage),
    error: computed(() => chatStore.error),
    sendMessage,
    clearChat,
    retryLastMessage,
    copyMessage,
    scrollToBottom,
  };
}

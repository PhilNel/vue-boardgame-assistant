import type { ChatMessage } from "@/types/chat";
import { chatService } from "@/services";
import { useChatStore } from "@/stores/chatStore";
import {
  createAssistantMessage,
  createErrorMessage,
  getErrorMessage,
  CONNECTION_ERROR_MESSAGE,
} from "./messageUtils";

export const scrollToBottom = () => {
  const chatContainer = document.querySelector(".chat-messages");
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

export const handleApiResponse = async (
  response: any,
  loadingMessage: ChatMessage,
  chatStore: ReturnType<typeof useChatStore>
) => {
  chatStore.removeMessage(loadingMessage.id);

  if (response.success && response.data) {
    const assistantMessage = createAssistantMessage(
      response.data.message,
      new Date(response.data.timestamp)
    );
    chatStore.addMessage(assistantMessage);
  } else {
    const errorContent = getErrorMessage(response.error);
    const errorMessage = createErrorMessage(errorContent, response.error?.code);
    chatStore.addMessage(errorMessage);
    chatStore.setError(response.error?.message || "An error occurred");
  }
};

export const handleApiError = (
  error: any,
  loadingMessage: ChatMessage,
  chatStore: ReturnType<typeof useChatStore>
) => {
  chatStore.removeMessage(loadingMessage.id);

  const errorMessage = createErrorMessage(
    CONNECTION_ERROR_MESSAGE,
    "CONNECTION_ERROR"
  );
  chatStore.addMessage(errorMessage);
  chatStore.setError("Connection error");
  console.error("Chat error:", error);
};

export const sendChatMessage = async (
  content: string,
  sessionId: string,
  gameId: string
) => {
  return await chatService.sendMessage({
    message: content,
    sessionId,
    game: gameId,
  });
};

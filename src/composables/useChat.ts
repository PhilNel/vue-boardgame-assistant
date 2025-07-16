import { computed, nextTick } from "vue";
import { useChatStore } from "@/stores/chatStore";
import { useGameStore } from "@/stores/gameStore";
import { createUserMessage, createLoadingMessage } from "@/utils/messageUtils";
import {
  handleApiResponse,
  handleApiError,
  sendChatMessage,
} from "@/utils/chatUtils";
import { feedbackService } from "@/services";
import type { FeedbackIssue, FeedbackType } from "@/types/feedback";

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

  const submitFeedback = async (data: {
    messageId: string;
    feedbackType: FeedbackType;
    issues?: FeedbackIssue[];
    description?: string;
  }) => {
    try {
      const conversationContext = getConversationContext();

      const response = await feedbackService.submitFeedback({
        message_id: data.messageId,
        game_name: gameStore.selectedGameId,
        feedback_type: data.feedbackType,
        issues: data.issues,
        description: data.description,
        conversation_context: conversationContext,
      });

      if (response.success) {
        console.log("✅ Feedback submitted successfully");
        
        chatStore.updateMessage(data.messageId, {
          user_feedback: {
            type: data.feedbackType,
            submitted_at: new Date().toISOString()
          }
        });
        
        return true;
      } else {
        console.error("❌ Failed to submit feedback:", response.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      return false;
    }
  };

  const getConversationContext = () => {
    const recentMessages = chatStore.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6) // Last 6 messages (3 Q&A pairs)
      .reduce(
        (
          pairs: Array<{ question: string; answer: string; timestamp: string }>,
          message,
          index,
          array
        ) => {
          if (
            message.role === "user" &&
            index + 1 < array.length &&
            array[index + 1].role === "assistant"
          ) {
            pairs.push({
              question: message.content,
              answer: array[index + 1].content,
              timestamp: message.timestamp.toISOString(),
            });
          }
          return pairs;
        },
        []
      );

    return {
      recent_qa: recentMessages.slice(-3), // Last 3 Q&A pairs
    };
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
    submitFeedback,
  };
}

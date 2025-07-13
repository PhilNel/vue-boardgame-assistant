import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "@/types/chat";

export const createUserMessage = (content: string): ChatMessage => ({
  id: uuidv4(),
  content: content.trim(),
  role: "user",
  timestamp: new Date(),
});

export const createLoadingMessage = (): ChatMessage => ({
  id: uuidv4(),
  content: "",
  role: "assistant",
  timestamp: new Date(),
  isLoading: true,
});

export const createAssistantMessage = (
  content: string,
  timestamp?: Date
): ChatMessage => ({
  id: uuidv4(),
  content,
  role: "assistant",
  timestamp: timestamp || new Date(),
});

export const createErrorMessage = (
  content: string,
  errorCode?: string
): ChatMessage => ({
  id: uuidv4(),
  content,
  role: "assistant",
  timestamp: new Date(),
  error: errorCode,
});

export const applySlidingWindow = (
  messages: ChatMessage[],
  maxMessages: number
): ChatMessage[] => {
  if (messages.length <= maxMessages) {
    return messages;
  }

  const messagesToRemove = messages.length - maxMessages;
  const removeCount =
    messagesToRemove % 2 === 0 ? messagesToRemove : messagesToRemove + 1;

  const result = [...messages];
  result.splice(0, removeCount);
  return result;
};

export const getErrorMessage = (error: any): string => {
  if (error?.code === "RATE_LIMITED") {
    return "⏳ The AI service is temporarily overloaded. Please wait 30-60 seconds before trying again. You can also try asking a more specific question to reduce processing time.";
  }
  return error?.message || "Sorry, I encountered an error. Please try again.";
};

export const CONNECTION_ERROR_MESSAGE =
  "Sorry, I'm having trouble connecting. Please check your connection and try again.";

import { v4 as uuidv4 } from "uuid";
import type { ChatMessage, ReferenceInfo } from "@/types/chat";
import { MessageRole } from "@/types/chat";

export const createUserMessage = (content: string): ChatMessage => ({
  id: uuidv4(),
  content: content.trim(),
  role: MessageRole.USER,
  timestamp: new Date(),
});

export const createLoadingMessage = (): ChatMessage => ({
  id: uuidv4(),
  content: "",
  role: MessageRole.ASSISTANT,
  timestamp: new Date(),
  isLoading: true,
});

export const createAssistantMessage = (
  content: string,
  timestamp?: Date,
  references?: ReferenceInfo[]
): ChatMessage => ({
  id: uuidv4(),
  content,
  role: MessageRole.ASSISTANT,
  timestamp: timestamp || new Date(),
  references,
});

export const createErrorMessage = (
  content: string,
  errorCode?: string
): ChatMessage => ({
  id: uuidv4(),
  content,
  role: MessageRole.ASSISTANT,
  timestamp: new Date(),
  error: errorCode || "UNKNOWN_ERROR",
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

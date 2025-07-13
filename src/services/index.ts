export * from "./chatService";
export * from "./gamesService";
export * from "./httpClient";
export * from "./feedbackService";

import { httpClient } from "@/config/api";
import { ChatService } from "./chatService";
import { GamesService } from "./gamesService";
import { FeedbackService } from "./feedbackService";

export const chatService = new ChatService(httpClient);
export const gamesService = new GamesService(httpClient);
export const feedbackService = new FeedbackService(httpClient);

export { AVAILABLE_GAMES } from "./gamesService";

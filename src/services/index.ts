export * from "./chatService";
export * from "./gamesService";
export * from "./httpClient";
export * from "./feedbackService";

import { apiHttpClient, feedbackHttpClient } from "@/config/api";
import { ChatService } from "./chatService";
import { GamesService } from "./gamesService";
import { FeedbackService } from "./feedbackService";

export const chatService = new ChatService(apiHttpClient);
export const gamesService = new GamesService(apiHttpClient);
export const feedbackService = new FeedbackService(feedbackHttpClient);

export { AVAILABLE_GAMES } from "./gamesService";

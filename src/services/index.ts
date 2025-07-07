export * from "./chatService";
export * from "./gamesService";
export * from "./httpClient";

import { httpClient } from "@/config/api";
import { ChatService } from "./chatService";
import { GamesService } from "./gamesService";

export const chatService = new ChatService(httpClient);
export const gamesService = new GamesService(httpClient);

export { AVAILABLE_GAMES } from "./gamesService";

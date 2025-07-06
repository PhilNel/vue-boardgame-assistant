import type { GameInfo } from "@/types/chat";
import { getApiKey } from "@/utils/httpUtils";
import type { HttpClient } from "./httpClient";

export const AVAILABLE_GAMES: GameInfo[] = [
  {
    id: "nemesis",
    name: "Nemesis",
    description: "A semi-cooperative survival horror board game",
    isAvailable: true,
  },
];

export class GamesService {
  constructor(private httpClient: HttpClient) {}

  async getAvailableGames(): Promise<GameInfo[]> {
    this.httpClient.setHeader("x-api-key", getApiKey());

    const response = await this.httpClient.get("/games");

    if (response.success) {
      // Transform API response to GameInfo format
      if (response.data.games && Array.isArray(response.data.games)) {
        return response.data.games.map((game: string) => ({
          id: game,
          name: game.charAt(0).toUpperCase() + game.slice(1),
          description: `Rules assistant for ${game}`,
          isAvailable: true,
        }));
      }
    } else {
      console.warn(
        "Failed to fetch games from API, using fallback:",
        response.error
      );
    }

    return AVAILABLE_GAMES;
  }
}

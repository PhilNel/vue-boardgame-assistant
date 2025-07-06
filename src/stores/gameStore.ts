import { defineStore } from "pinia";
import { AVAILABLE_GAMES } from "@/services";

export const useGameStore = defineStore("game", {
  state: () => ({
    selectedGameId: "nemesis" as string, // Default to Nemesis
  }),

  getters: {
    selectedGame: (state) =>
      AVAILABLE_GAMES.find((game) => game.id === state.selectedGameId),

    availableGames: () => AVAILABLE_GAMES,
  },

  actions: {
    selectGame(gameId: string) {
      const game = AVAILABLE_GAMES.find((g) => g.id === gameId);
      if (game) {
        this.selectedGameId = gameId;
      }
    },
  },
});

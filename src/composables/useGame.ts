import { computed } from "vue";
import { useGameStore } from "@/stores/gameStore";
import { useChatStore } from "@/stores/chatStore";

export function useGame() {
  const gameStore = useGameStore();
  const chatStore = useChatStore();

  const changeGame = (gameId: string) => {
    gameStore.selectGame(gameId);
    chatStore.initializeForGame(gameId);
    chatStore.clearError();
  };

  return {
    // State
    selectedGame: computed(() => gameStore.selectedGame),
    selectedGameId: computed(() => gameStore.selectedGameId),
    availableGames: computed(() => gameStore.availableGames),

    // Actions
    changeGame,
  };
}

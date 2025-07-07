export const deployConfig = {
  production: {
    apiBaseUrl:
      process.env.VITE_API_BASE_URL ||
      "https://api.boardgamewarlock.com/api/v1",
    appTitle: "Boardgame Warlock",
    appDescription:
      "Your magical AI assistant for board game rules and gameplay",
  },
};

export default deployConfig;
 
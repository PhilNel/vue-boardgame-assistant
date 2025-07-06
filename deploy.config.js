export const deployConfig = {
  production: {
    apiBaseUrl:
      process.env.VITE_API_BASE_URL ||
      "https://7i699s4dxh.execute-api.eu-west-1.amazonaws.com/dev/api/v1",
    appTitle: "Boardgame Wiz",
    appDescription:
      "Your magical AI assistant for board game rules and gameplay",
  },
};

export default deployConfig;

import type { ApiResponse } from "@/types/chat";
import { useSettingsStore } from "@/stores/settings";

export const getApiKey = (): string => {
  const settingsStore = useSettingsStore();
  return settingsStore.apiKey;
};

export const convertToApiResponse = (
  httpResponse: any,
  customAuthMessage?: string
): ApiResponse => {
  if (httpResponse.success) {
    return {
      success: true,
      data: httpResponse.data,
    };
  }

  if (httpResponse.error?.code === "UNAUTHORIZED" && customAuthMessage) {
    return {
      success: false,
      error: {
        code: httpResponse.error.code,
        message: customAuthMessage,
      },
    };
  }

  return {
    success: false,
    error: httpResponse.error,
  };
};

export const validateApiKey = (): ApiResponse | null => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: {
        code: "NO_API_KEY",
        message:
          "Please set your API key in the settings to use the assistant.",
      },
    };
  }
  return null;
};

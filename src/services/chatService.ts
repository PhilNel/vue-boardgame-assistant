import type { ApiResponse, SendMessageRequest } from "@/types/chat";
import {
  getApiKey,
  convertToApiResponse,
  validateApiKey,
} from "@/utils/httpUtils";
import type { HttpClient } from "./httpClient";

export class ChatService {
  constructor(private httpClient: HttpClient) {}

  async sendMessage(request: SendMessageRequest): Promise<ApiResponse> {
    console.log("🚀 Sending request to API:", {
      game: request.game,
      question: request.message,
    });

    const validationError = this.validateRequest(request);
    if (validationError) {
      return validationError;
    }

    this.httpClient.setHeader("x-api-key", getApiKey());

    const response = await this.httpClient.post("/chat", {
      gameName: request.game,
      question: request.message,
      session_id: request.sessionId || undefined,
    });

    if (response.success) {
      console.log("✅ API Response received:", response.data);

      return {
        success: true,
        data: {
          message: response.data.answer,
          timestamp: new Date().toISOString(),
        },
      };
    }

    return convertToApiResponse(
      response,
      "API key is invalid or missing. Please set your API key in the settings."
    );
  }

  private validateRequest(request: SendMessageRequest): ApiResponse | null {
    const apiKeyError = validateApiKey();
    if (apiKeyError) {
      return apiKeyError;
    }

    const isRequestEmpty = !request.message.trim();
    if (isRequestEmpty) {
      return {
        success: false,
        error: {
          code: "EMPTY_MESSAGE",
          message: "Please enter a question about the game rules.",
        },
      };
    }

    return null;
  }
}

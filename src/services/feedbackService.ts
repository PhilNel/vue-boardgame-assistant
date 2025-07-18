import type { FeedbackSubmission, FeedbackApiResponse } from "@/types/feedback";
import { FEEDBACK_TYPES } from "@/types/feedback";
import type { HttpClient } from "./httpClient";
import { getApiKey } from "@/utils/httpUtils";

export class FeedbackService {
  constructor(private httpClient: HttpClient) {}

  async submitFeedback(
    submission: FeedbackSubmission
  ): Promise<FeedbackApiResponse> {
    console.log("🚀 Submitting feedback:", {
      messageId: submission.message_id,
      feedbackType: submission.feedback_type,
      game: submission.game_name,
      hasIssues: submission.issues?.length || 0,
      hasDescription: !!submission.description,
    });

    const validationError = this.validateRequest(submission);
    if (validationError) {
      return validationError;
    }

    const apiKey = getApiKey();
    if (apiKey) {
      // Generate user hash from API key for anonymous identification
      submission.user_hash = await this.generateUserHash(apiKey);
    }

    const response = await this.httpClient.post("/feedback", {
      message_id: submission.message_id,
      game_name: submission.game_name,
      feedback_type: submission.feedback_type,
      user_hash: submission.user_hash,
      issues: submission.issues,
      description: submission.description,
      conversation_context: submission.conversation_context,
      timestamp: new Date().toISOString(),
    });

    if (response.success) {
      return {
        success: true,
        data: {
          feedback_id: response.data.feedback_id || "unknown",
          message: response.data.message || "Feedback submitted successfully",
        },
      };
    }

    return {
      success: false,
      error: {
        code: response.error?.code || "FEEDBACK_ERROR",
        message:
          response.error?.message ||
          "Failed to submit feedback. Please try again later.",
      },
    };
  }

  private validateRequest(
    submission: FeedbackSubmission
  ): FeedbackApiResponse | null {
    if (!submission.message_id?.trim()) {
      return {
        success: false,
        error: {
          code: "INVALID_MESSAGE_ID",
          message: "Message ID is required",
        },
      };
    }

    if (!submission.game_name?.trim()) {
      return {
        success: false,
        error: {
          code: "INVALID_GAME_NAME",
          message: "Game name is required",
        },
      };
    }

    if (!FEEDBACK_TYPES.includes(submission.feedback_type as any)) {
      return {
        success: false,
        error: {
          code: "INVALID_FEEDBACK_TYPE",
          message: `Feedback type must be one of: ${FEEDBACK_TYPES.join(", ")}`,
        },
      };
    }

    // Validate negative feedback requirements
    if (
      submission.feedback_type === "negative" &&
      (!submission.issues || submission.issues.length === 0)
    ) {
      return {
        success: false,
        error: {
          code: "MISSING_ISSUES",
          message: "Issues are required for negative feedback",
        },
      };
    }

    // Validate field lengths
    if (submission.description && submission.description.length > 256) {
      return {
        success: false,
        error: {
          code: "DESCRIPTION_TOO_LONG",
          message: "Description must be 256 characters or less",
        },
      };
    }

    return null;
  }

  private async generateUserHash(apiKey: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(apiKey);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (error) {
      console.warn("Failed to generate user hash:", error);
      return "unknown";
    }
  }
}

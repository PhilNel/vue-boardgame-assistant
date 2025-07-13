export const FEEDBACK_TYPES = [
  "positive",
  "negative",
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export interface FeedbackRecord {
  feedback_id: string;
  message_id: string;
  game_name: string;
  feedback_type: FeedbackType;
  timestamp: string; // ISO timestamp
  user_hash?: string; // SHA256 hash of API key (if available)

  issues?: string[]; // ['incorrect_info', 'missing_info', 'unclear', 'wrong_game', 'other']
  description?: string; // User description (max 256 chars)

  conversation_context?: {
    recent_qa: Array<{
      question: string;
      answer: string;
      timestamp: string;
    }>; // Last 3 Q&As from current session
  };
}

export interface FeedbackSubmission {
  message_id: string;
  game_name: string;
  feedback_type: FeedbackType;
  user_hash?: string;

  // Optional fields for negative feedback
  issues?: string[];
  description?: string;

  conversation_context?: {
    recent_qa: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface FeedbackApiResponse {
  success: boolean;
  data?: {
    feedback_id: string;
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const FEEDBACK_ISSUES = [
  "incorrect_info",
  "missing_info",
  "unclear",
  "wrong_game",
  "other",
] as const;

export type FeedbackIssue = (typeof FEEDBACK_ISSUES)[number];

export const FEEDBACK_ISSUE_LABELS: Record<FeedbackIssue, string> = {
  incorrect_info: "Incorrect information",
  missing_info: "Missing information",
  unclear: "Unclear or confusing",
  wrong_game: "Wrong game rules",
  other: "Other issue",
};

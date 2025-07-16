import { HttpClient } from "@/services/httpClient";

const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL ||
  "https://api.boardgamewarlock.com/api/v1";

const FEEDBACK_API_BASE_URL =
  (import.meta as any).env.VITE_FEEDBACK_API_BASE_URL ||
  "https://feedback.boardgamewarlock.com/api/v1";

export const apiHttpClient = new HttpClient({
  baseURL: API_BASE_URL,
});

export const feedbackHttpClient = new HttpClient({
  baseURL: FEEDBACK_API_BASE_URL,
});

export const config = {
  API_BASE_URL,
  FEEDBACK_API_BASE_URL,
  ENVIRONMENT: (import.meta as any).env.MODE || "development",
};

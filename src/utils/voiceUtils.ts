import type { VoiceRecognitionError } from "@/types/voice";
import { VoiceRecognitionErrorType } from "@/types/voice";

const ERROR_MESSAGES: Record<VoiceRecognitionErrorType, string> = {
  [VoiceRecognitionErrorType.NOT_SUPPORTED]:
    "Something is limiting my magic - your browser doesn't support voice recognition",
  [VoiceRecognitionErrorType.PERMISSION_DENIED]:
    "I need microphone access to hear you - please allow it in your browser",
  [VoiceRecognitionErrorType.NETWORK_ERROR]:
    "Network hiccup - check your connection and try again",
  [VoiceRecognitionErrorType.NO_SPEECH]:
    "I didn't hear anything - try speaking closer to your microphone",
  [VoiceRecognitionErrorType.RECOGNITION_FAILED]:
    "Something went wrong with voice recognition - please try again",
  [VoiceRecognitionErrorType.NO_SPEECH_LOUD]:
    "I didn't catch that - try speaking a bit louder",
};

export const createVoiceError = (
  type: VoiceRecognitionErrorType,
  message: string
): VoiceRecognitionError => {
  return { type, message };
};

export const buildVoiceError = (
  type: VoiceRecognitionErrorType,
  customMessage?: string
): VoiceRecognitionError => {
  const message =
    customMessage ||
    ERROR_MESSAGES[type] ||
    ERROR_MESSAGES[VoiceRecognitionErrorType.RECOGNITION_FAILED];
  return createVoiceError(type, message);
};

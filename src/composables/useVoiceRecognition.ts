import { ref, computed } from "vue";
import type {
  VoiceRecognitionResult,
  VoiceRecognitionError,
} from "@/types/voice";
import { VoiceRecognitionErrorType } from "@/types/voice";
import { buildVoiceError } from "@/utils/voiceUtils";

export const useVoiceRecognition = () => {
  const isRecording = ref(false);
  const isProcessing = ref(false);
  const error = ref<VoiceRecognitionError | null>(null);
  const currentRecognition = ref<any>(null);

  const isSupported = computed(() => {
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  });

  const buildError = (
    type: VoiceRecognitionErrorType,
    customMessage?: string
  ): VoiceRecognitionError => {
    const voiceError = buildVoiceError(type, customMessage);
    error.value = voiceError;
    return voiceError;
  };

  const createRecognitionInstance = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    return recognition;
  };

  const createStartHandler = () => {
    return () => {
      isRecording.value = true;
      isProcessing.value = false;
    };
  };

  const createResultHandler = (
    resolve: (value: VoiceRecognitionResult) => void,
    reject: (error: VoiceRecognitionError) => void
  ) => {
    return (event: SpeechRecognitionEvent) => {
      isRecording.value = false;
      isProcessing.value = true;

      const result = event.results[0];
      if (result && result[0]) {
        const transcript = result[0].transcript.trim();
        const confidence = result[0].confidence;

        // Accept any non-empty transcript, even with low confidence
        if (transcript.length > 0) {
          isProcessing.value = false;
          resolve({ transcript, confidence });
          return;
        }
      }

      const errorObj = buildError(VoiceRecognitionErrorType.NO_SPEECH_LOUD);
      isProcessing.value = false;
      reject(errorObj);
    };
  };

  const createErrorHandler = (
    reject: (error: VoiceRecognitionError) => void
  ) => {
    return (event: SpeechRecognitionErrorEvent) => {
      isRecording.value = false;
      isProcessing.value = false;
      currentRecognition.value = null;

      let errorObj: VoiceRecognitionError;

      switch (event.error) {
        case "not-allowed":
        case "permission-denied":
          errorObj = buildError(VoiceRecognitionErrorType.PERMISSION_DENIED);
          break;
        case "network":
          errorObj = buildError(VoiceRecognitionErrorType.NETWORK_ERROR);
          break;
        case "no-speech":
          errorObj = buildError(VoiceRecognitionErrorType.NO_SPEECH);
          break;
        default:
          errorObj = buildError(VoiceRecognitionErrorType.RECOGNITION_FAILED);
      }

      reject(errorObj);
    };
  };

  const createEndHandler = (reject: (error: VoiceRecognitionError) => void) => {
    return () => {
      isRecording.value = false;
      currentRecognition.value = null;

      if (isProcessing.value) {
        // Processing will be handled by onresult or onerror
        return;
      }

      const errorObj = buildError(VoiceRecognitionErrorType.NO_SPEECH);
      reject(errorObj);
    };
  };

  const attachEventListeners = (
    recognition: any,
    resolve: (value: VoiceRecognitionResult) => void,
    reject: (error: VoiceRecognitionError) => void
  ) => {
    recognition.onstart = createStartHandler();
    recognition.onresult = createResultHandler(resolve, reject);
    recognition.onerror = createErrorHandler(reject);
    recognition.onend = createEndHandler(reject);
  };

  const startRecording = (): Promise<VoiceRecognitionResult> => {
    return new Promise((resolve, reject) => {
      if (!isSupported.value) {
        const errorObj = buildError(VoiceRecognitionErrorType.NOT_SUPPORTED);
        reject(errorObj);
        return;
      }

      error.value = null;

      const recognition = createRecognitionInstance();
      currentRecognition.value = recognition;

      attachEventListeners(recognition, resolve, reject);

      try {
        recognition.start();
      } catch (err) {
        const errorObj = buildError(
          VoiceRecognitionErrorType.RECOGNITION_FAILED,
          "Couldn't start voice recognition - please try again"
        );
        reject(errorObj);
      }
    });
  };

  const stopRecording = () => {
    if (currentRecognition.value) {
      try {
        currentRecognition.value.stop();
      } catch (err) {
        console.warn("Error stopping recognition:", err);
      }
    }
    isRecording.value = false;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearProcessing = () => {
    isProcessing.value = false;
  };

  return {
    isRecording: computed(() => isRecording.value),
    isProcessing: computed(() => isProcessing.value),
    isSupported,
    error: computed(() => error.value),
    startRecording,
    stopRecording,
    clearError,
    clearProcessing,
  };
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

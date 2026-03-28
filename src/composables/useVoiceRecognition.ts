import { ref, computed } from "vue";
import type {
  VoiceRecognitionResult,
  VoiceRecognitionError,
  BrowserSpeechRecognition,
  WebSpeechRecognitionEvent,
  WebSpeechErrorEvent,
  SpeechRecognitionConstructor,
} from "@/types/voice";
import { VoiceRecognitionErrorType } from "@/types/voice";
import { buildVoiceError } from "@/utils/voiceUtils";

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function useVoiceRecognition() {
  const isRecording = ref(false);
  const isProcessing = ref(false);
  const error = ref<VoiceRecognitionError | null>(null);
  const currentRecognition = ref<BrowserSpeechRecognition | null>(null);

  const isSupported = computed(() => {
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  });

  const buildError = (
    type: VoiceRecognitionErrorType,
    customMessage?: string,
  ): VoiceRecognitionError => {
    const voiceError = buildVoiceError(type, customMessage);
    error.value = voiceError;
    return voiceError;
  };

  const createRecognitionInstance = (): BrowserSpeechRecognition => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      throw new Error("SpeechRecognition constructor missing");
    }
    const recognition = new SpeechRecognitionCtor();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    return recognition;
  };

  const createStartHandler = (): (() => void) => {
    return () => {
      isRecording.value = true;
      isProcessing.value = false;
    };
  };

  const createResultHandler = (
    resolve: (value: VoiceRecognitionResult) => void,
    reject: (error: VoiceRecognitionError) => void,
  ): ((event: WebSpeechRecognitionEvent) => void) => {
    return (event: WebSpeechRecognitionEvent) => {
      isRecording.value = false;
      isProcessing.value = true;

      const result = event.results[0];
      if (result && result[0]) {
        const transcript = result[0].transcript.trim();
        const confidence = result[0].confidence;

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
    reject: (error: VoiceRecognitionError) => void,
  ): ((event: WebSpeechErrorEvent) => void) => {
    return (event: WebSpeechErrorEvent) => {
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

  const createEndHandler = (reject: (error: VoiceRecognitionError) => void): (() => void) => {
    return () => {
      isRecording.value = false;
      currentRecognition.value = null;

      if (isProcessing.value) {
        return;
      }

      const errorObj = buildError(VoiceRecognitionErrorType.NO_SPEECH);
      reject(errorObj);
    };
  };

  const attachEventListeners = (
    recognition: BrowserSpeechRecognition,
    resolve: (value: VoiceRecognitionResult) => void,
    reject: (error: VoiceRecognitionError) => void,
  ): void => {
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
      } catch {
        const errorObj = buildError(
          VoiceRecognitionErrorType.RECOGNITION_FAILED,
          "Couldn't start voice recognition - please try again",
        );
        reject(errorObj);
      }
    });
  };

  const stopRecording = (): void => {
    if (currentRecognition.value) {
      try {
        currentRecognition.value.stop();
      } catch (err: unknown) {
        console.warn("Error stopping recognition:", err);
      }
    }
    isRecording.value = false;
  };

  const clearError = (): void => {
    error.value = null;
  };

  const clearProcessing = (): void => {
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
}

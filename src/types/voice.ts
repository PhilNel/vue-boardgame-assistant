export enum VoiceRecognitionErrorType {
  PERMISSION_DENIED = "permission-denied",
  NOT_SUPPORTED = "not-supported",
  NETWORK_ERROR = "network-error",
  NO_SPEECH = "no-speech",
  RECOGNITION_FAILED = "recognition-failed",
  NO_SPEECH_LOUD = "no-speech-loud",
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface VoiceRecognitionError {
  type: VoiceRecognitionErrorType;
  message: string;
}

/** Web Speech API — types used by `useVoiceRecognition` (DOM typings vary by TS/lib). */
export interface WebSpeechAlternative {
  transcript: string;
  confidence: number;
}

export interface WebSpeechGrammarResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): WebSpeechAlternative;
  [index: number]: WebSpeechAlternative;
}

export interface WebSpeechResultList {
  readonly length: number;
  item(index: number): WebSpeechGrammarResult;
  [index: number]: WebSpeechGrammarResult;
}

export interface WebSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: WebSpeechResultList;
}

export interface WebSpeechErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

export interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: BrowserSpeechRecognition, ev: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((this: BrowserSpeechRecognition, ev: WebSpeechErrorEvent) => void) | null;
  onend: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
}

export type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

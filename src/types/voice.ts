export enum VoiceRecognitionErrorType {
  PERMISSION_DENIED = 'permission-denied',
  NOT_SUPPORTED = 'not-supported',
  NETWORK_ERROR = 'network-error',
  NO_SPEECH = 'no-speech',
  RECOGNITION_FAILED = 'recognition-failed',
  NO_SPEECH_LOUD = 'no-speech-loud'
}

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
}

export interface VoiceRecognitionError {
  type: VoiceRecognitionErrorType
  message: string
} 
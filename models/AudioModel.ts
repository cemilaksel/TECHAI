
export interface AudioState {
  stream: MediaStream | null;
  duration: number;
}

export const AUDIO_CONSTANTS = {
  SAMPLE_RATE_OUTPUT: 24000,
  TARGET_INPUT_SAMPLE_RATE: 16000,
  HEARTBEAT_INTERVAL: 2000,
  WAKE_LOCK_REACQUIRE_MS: 1000,
};

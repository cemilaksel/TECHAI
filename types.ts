export interface TranscriptionItem {
  id: string;
  text: string;
  isFinal: boolean;
  language: 'EN' | 'TR' | 'Detecting...';
  type: 'input' | 'output'; // input = user, output = AI translation
  timestamp: number;
}

export interface ConversationPair {
  id: string;
  input: TranscriptionItem;
  output?: TranscriptionItem;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
}
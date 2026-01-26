
export enum TabType {
  SIMULATE = 'simulate',
  MEMORY = 'memory',
  REASON = 'reason',
  CODE = 'code'
}

export interface QuantumState {
  entropy: number;
  coherence: number;
  stability: number;
  timestamp: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'quantum';
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

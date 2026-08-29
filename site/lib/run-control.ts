export const finalRunStorageKey = 'flogi-final-run-state-v2';
export const presenterCommandKey = 'flogi-presenter-command-v2';
export const presenterChannelName = 'flogi-ohayo-presenter-v2';

export type PresenterCommand =
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'next-event' }
  | { type: 'next-task' }
  | { type: 'complete-current' }
  | { type: 'reset-run' }
  | { type: 'reset-all' }
  | { type: 'show-result' }
  | { type: 'set-speed'; value: number };

export type StoredFinalRunState = {
  screen: 'prompt' | 'planning' | 'running' | 'complete' | 'result';
  submittedPrompt: string;
  planningElapsed: number;
  currentTaskIndex: number;
  taskElapsed: number;
  completedTaskIds: number[];
  paused: boolean;
  speed: number;
  viewMode: 'web' | 'cli';
  updatedAt: number;
};

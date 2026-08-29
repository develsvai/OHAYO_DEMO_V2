export const finalRunStorageKey = 'flogi-final-run-state-v1';
export const presenterCommandKey = 'flogi-presenter-command-v1';
export const presenterChannelName = 'flogi-ohayo-presenter-v1';

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
  screen: 'prompt' | 'running' | 'complete' | 'result';
  submittedPrompt: string;
  currentTaskIndex: number;
  taskElapsed: number;
  completedTaskIds: number[];
  paused: boolean;
  speed: number;
  viewMode: 'web' | 'cli';
  updatedAt: number;
};

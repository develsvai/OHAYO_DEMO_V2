'use client';

import { useEffect, useRef, useState } from 'react';
import { buildStages, finalRun } from '@/lib/scenario';
import {
  buildRunStorageKey,
  finalRunStorageKey,
  PresenterCommand,
  presenterChannelName,
  presenterCommandKey,
  StoredBuildRunState,
  StoredFinalRunState,
} from '@/lib/run-control';

const emptyState: StoredFinalRunState = {
  screen: 'prompt',
  submittedPrompt: '',
  currentTaskIndex: 0,
  taskElapsed: 0,
  completedTaskIds: [],
  paused: false,
  speed: 1,
  viewMode: 'web',
  updatedAt: 0,
};

const emptyBuildState: StoredBuildRunState = {
  screen: 'cli',
  buildState: 'idle',
  submittedPrompt: '',
  totalElapsed: 0,
  paused: false,
  timeScale: 1,
  updatedAt: 0,
};

export default function PresenterPage() {
  const [state, setState] = useState<StoredFinalRunState>(emptyState);
  const [buildState, setBuildState] = useState<StoredBuildRunState>(emptyBuildState);
  const [lastCommand, setLastCommand] = useState('NONE');
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') channelRef.current = new BroadcastChannel(presenterChannelName);
    const readState = () => {
      const stored = window.localStorage.getItem(finalRunStorageKey);
      const storedBuild = window.localStorage.getItem(buildRunStorageKey);
      if (stored) {
        try { setState(JSON.parse(stored) as StoredFinalRunState); } catch { window.localStorage.removeItem(finalRunStorageKey); }
      }
      if (storedBuild) {
        try { setBuildState(JSON.parse(storedBuild) as StoredBuildRunState); } catch { window.localStorage.removeItem(buildRunStorageKey); }
      }
    };
    readState();
    const poll = window.setInterval(readState, 400);
    return () => {
      window.clearInterval(poll);
      channelRef.current?.close();
    };
  }, []);

  function send(command: PresenterCommand, label: string) {
    const payload = { id: crypto.randomUUID(), at: Date.now(), command };
    window.localStorage.setItem(presenterCommandKey, JSON.stringify(payload));
    channelRef.current?.postMessage(command);
    setLastCommand(label);
  }

  const task = finalRun.tasks[state.currentTaskIndex];
  const completion = state.completedTaskIds.length;
  const inBuild = buildState.screen !== 'product';
  const buildStageIndex = Math.min(4, Math.floor(buildState.totalElapsed / buildStages[0].duration));
  const buildStage = buildStages[buildStageIndex];
  const activePaused = inBuild ? buildState.paused : state.paused;
  const activeSpeed = inBuild ? buildState.timeScale : state.speed;
  const activeScreen = inBuild ? (buildState.buildState === 'idle' ? 'INITIAL PROMPT' : `BUILD STEP ${buildStage.id}`) : state.screen.toUpperCase();
  const activeCount = inBuild ? Math.min(5, Math.floor(buildState.totalElapsed / buildStages[0].duration)) : completion;
  const activeTotal = inBuild ? 5 : 10;
  const activeTitle = inBuild ? buildStage.title : task?.title ?? 'Waiting for run';
  const activeGoal = inBuild ? buildStage.description : task?.goal ?? 'Start the product run from the audience screen.';
  const activeProgress = inBuild
    ? Math.min(100, ((buildState.totalElapsed - buildStageIndex * buildStage.duration) / buildStage.duration) * 100)
    : Math.min(100, (state.taskElapsed / finalRun.taskDuration) * 100);

  return (
    <main className="presenter-shell">
      <header className="presenter-header">
        <div><span>PRESENTER ONLY</span><h1>Run control</h1></div>
        <a href="/" target="_blank" rel="noreferrer">OPEN AUDIENCE ↗</a>
      </header>

      <section className="presenter-status">
        <div><span>SCREEN</span><strong>{activeScreen}</strong></div>
        <div><span>STATUS</span><strong className={activePaused ? 'warning' : 'healthy'}>{activePaused ? 'PAUSED' : 'ACTIVE'}</strong></div>
        <div><span>{inBuild ? 'STAGES' : 'TASKS'}</span><strong>{String(activeCount).padStart(2, '0')} / {activeTotal}</strong></div>
        <div><span>SPEED</span><strong>{activeSpeed}×</strong></div>
      </section>

      <section className="presenter-current">
        <span>CURRENT TASK</span>
        <div><strong>{String((inBuild ? buildStage.id : task?.id ?? 0)).padStart(2, '0')}</strong><h2>{activeTitle}</h2></div>
        <p>{activeGoal}</p>
        <div className="presenter-progress"><i style={{ width: `${activeProgress}%` }} /></div>
      </section>

      <section className="control-group primary-controls">
        <div className="control-heading"><span>EXECUTION</span><small>SAFE CONTROLS</small></div>
        <div className="control-grid two">
          <button onClick={() => send({ type: 'pause' }, 'PAUSE')}><span>Ⅱ</span><strong>Pause</strong><small>Freeze current timer</small></button>
          <button onClick={() => send({ type: 'resume' }, 'RESUME')}><span>▶</span><strong>Resume</strong><small>Continue execution</small></button>
        </div>
        <div className="control-grid">
          <button onClick={() => send({ type: 'next-event' }, 'NEXT EVENT')}><span>→</span><strong>Next event</strong><small>Advance one state</small></button>
          <button onClick={() => send({ type: 'complete-current' }, 'COMPLETE TASK')}><span>✓</span><strong>Complete task</strong><small>Finish current task</small></button>
          <button onClick={() => send({ type: 'next-task' }, 'SKIP TASK')}><span>»</span><strong>Skip task</strong><small>Move to next task</small></button>
        </div>
      </section>

      <section className="control-group">
        <div className="control-heading"><span>RUNTIME SPEED</span><small>REHEARSAL</small></div>
        <div className="speed-grid">
          {[1, 10, 30, 60].map((value) => <button className={activeSpeed === value ? 'active' : ''} key={value} onClick={() => send({ type: 'set-speed', value }, `SPEED ${value}×`)}>{value}×</button>)}
        </div>
      </section>

      <section className="control-group danger-zone">
        <div className="control-heading"><span>RECOVERY</span><small>PRESENTATION RESCUE</small></div>
        <div className="control-grid">
          <button onClick={() => send({ type: 'reset-run' }, 'RESET RUN')}><span>↻</span><strong>Reset run</strong><small>Back to product prompt</small></button>
          <button onClick={() => send({ type: 'reset-all' }, 'RESET ALL')}><span>×</span><strong>Reset all</strong><small>Back to first prompt</small></button>
          <button className="force" onClick={() => send({ type: 'show-result' }, 'SHOW RESULT')}><span>⚡</span><strong>Show result</strong><small>Jump to final URL</small></button>
        </div>
      </section>

      <footer className="presenter-footer"><span>LAST COMMAND</span><strong>{lastCommand}</strong><small>State updates every 400ms</small></footer>
    </main>
  );
}

'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FinalRunExperience } from '@/components/FinalRunExperience';
import { MermaidChart } from '@/components/MermaidChart';
import { buildStages, finalRun, scenarioMeta } from '@/lib/scenario';
import {
  buildRunStorageKey,
  finalRunStorageKey,
  PresenterCommand,
  presenterChannelName,
  presenterCommandKey,
  StoredBuildRunState,
  StoredFinalRunState,
} from '@/lib/run-control';

type BuildState = 'idle' | 'running' | 'complete';
type Screen = 'cli' | 'viewer' | 'ready' | 'product';

const totalDuration = buildStages.reduce((sum, stage) => sum + stage.duration, 0);

export default function Home() {
  const [screen, setScreen] = useState<Screen>('cli');
  const [buildState, setBuildState] = useState<BuildState>('idle');
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [buildPaused, setBuildPaused] = useState(false);
  const lastTickAt = useRef(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const completedCount = Math.min(buildStages.length, Math.floor(totalElapsed / buildStages[0].duration));
  const currentStageIndex = Math.min(buildStages.length - 1, completedCount);
  const currentStage = buildStages[currentStageIndex];
  const currentStageElapsed = buildState === 'complete' ? currentStage.duration : totalElapsed - currentStageIndex * currentStage.duration;
  const progress = Math.min(100, (totalElapsed / totalDuration) * 100);
  const currentVisibleLogCount = currentStage.logs.filter((log) => log.at <= currentStageElapsed).length;

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const speed = Number(new URLSearchParams(window.location.search).get('speed'));
      if (Number.isFinite(speed) && speed >= 1 && speed <= 60) setTimeScale(speed);
      const stored = window.localStorage.getItem(buildRunStorageKey);
      if (!stored) {
        setHydrated(true);
        return;
      }
      try {
        const state = JSON.parse(stored) as StoredBuildRunState;
        if (state.screen === 'viewer' || state.screen === 'ready' || state.screen === 'product') setScreen(state.screen);
        if (state.buildState === 'running' || state.buildState === 'complete') setBuildState(state.buildState);
        if (typeof state.submittedPrompt === 'string') setSubmittedPrompt(state.submittedPrompt);
        if (typeof state.totalElapsed === 'number') setTotalElapsed(Math.min(totalDuration, Math.max(0, state.totalElapsed)));
        if (typeof state.paused === 'boolean') setBuildPaused(state.paused);
        if (!(Number.isFinite(speed) && speed >= 1 && speed <= 60) && typeof state.timeScale === 'number') setTimeScale(state.timeScale);
      } catch {
        window.localStorage.removeItem(buildRunStorageKey);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: StoredBuildRunState = { screen, buildState, submittedPrompt, totalElapsed, paused: buildPaused, timeScale, updatedAt: Date.now() };
    window.localStorage.setItem(buildRunStorageKey, JSON.stringify(state));
  }, [buildPaused, buildState, hydrated, screen, submittedPrompt, timeScale, totalElapsed]);

  useEffect(() => {
    if (buildState !== 'running' || buildPaused) return;
    lastTickAt.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickAt.current) * timeScale;
      lastTickAt.current = now;
      setTotalElapsed((value) => {
        const next = Math.min(totalDuration, value + delta);
        if (next >= totalDuration) setBuildState('complete');
        return next;
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [buildPaused, buildState, timeScale]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [completedCount, currentStageIndex, currentVisibleLogCount]);

  useEffect(() => {
    if (buildState !== 'complete' || screen !== 'cli') return;
    const autoOpen = window.setTimeout(() => {
      setScreen('viewer');
      setZoom(1);
      window.history.replaceState(null, '', '/?screen=viewer');
    }, Math.max(700, 1_800 / timeScale));
    return () => window.clearTimeout(autoOpen);
  }, [buildState, screen, timeScale]);

  const replayBuild = useCallback(() => {
    setScreen('cli');
    setBuildState('idle');
    setPrompt(submittedPrompt);
    setSubmittedPrompt('');
    setTotalElapsed(0);
    window.history.replaceState(null, '', '/');
  }, [submittedPrompt]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        window.open('/presenter', 'flogi-presenter', 'width=520,height=820');
      }
      if (event.key.toLowerCase() === 'r' && screen === 'viewer') replayBuild();
      if ((event.key === 'Escape' || event.key === 'ArrowRight') && screen === 'viewer') {
        setScreen('ready');
        window.history.replaceState(null, '', '/?screen=ready');
      }
      if (event.key === 'Enter' && screen === 'ready') {
        setScreen('product');
        window.history.replaceState(null, '', '/?screen=run');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [replayBuild, screen]);

  const stageOutputs = useMemo(() => buildStages.map((stage, index) => {
    const isComplete = totalElapsed >= (index + 1) * stage.duration;
    const isCurrent = buildState !== 'idle' && index === currentStageIndex;
    const elapsed = isComplete ? stage.duration : isCurrent ? currentStageElapsed : 0;
    return {
      stage,
      isComplete,
      isCurrent,
      logs: stage.logs.filter((log) => log.at <= elapsed),
    };
  }), [buildState, currentStageElapsed, currentStageIndex, totalElapsed]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim() || buildState !== 'idle') return;
    setSubmittedPrompt(prompt.trim());
    setPrompt('');
    setTotalElapsed(0);
    setBuildState('running');
    setBuildPaused(false);
  }

  const resetAll = useCallback(() => {
    setScreen('cli');
    setBuildState('idle');
    setPrompt('');
    setSubmittedPrompt('');
    setTotalElapsed(0);
    setBuildPaused(false);
    window.localStorage.removeItem(buildRunStorageKey);
    window.localStorage.removeItem(finalRunStorageKey);
    window.history.replaceState(null, '', '/');
  }, []);

  const executeBuildCommand = useCallback((command: PresenterCommand) => {
    if (screen === 'product') return;
    if (command.type === 'pause' && buildState === 'running') setBuildPaused(true);
    if (command.type === 'resume' && buildState === 'running') setBuildPaused(false);
    if (command.type === 'next-event' && buildState === 'running') {
      const next = currentStage.logs.find((log) => log.at > currentStageElapsed + 100);
      const nextElapsed = currentStageIndex * currentStage.duration + (next?.at ?? currentStage.duration);
      setTotalElapsed(Math.min(totalDuration, nextElapsed));
      if (nextElapsed >= totalDuration) setBuildState('complete');
    }
    if ((command.type === 'next-task' || command.type === 'complete-current') && buildState === 'running') {
      const nextElapsed = Math.min(totalDuration, (currentStageIndex + 1) * currentStage.duration);
      setTotalElapsed(nextElapsed);
      if (nextElapsed >= totalDuration) setBuildState('complete');
    }
    if (command.type === 'reset-run' || command.type === 'reset-all') resetAll();
    if (command.type === 'show-result') {
      const resultState: StoredFinalRunState = {
        screen: 'result',
        submittedPrompt: finalRun.canonicalPrompt,
        currentTaskIndex: finalRun.tasks.length - 1,
        taskElapsed: finalRun.taskDuration,
        completedTaskIds: finalRun.tasks.map((task) => task.id),
        paused: false,
        speed: timeScale,
        viewMode: 'web',
        updatedAt: Date.now(),
      };
      window.localStorage.setItem(finalRunStorageKey, JSON.stringify(resultState));
      setScreen('product');
    }
    if (command.type === 'set-speed') setTimeScale(Math.min(60, Math.max(1, command.value)));
  }, [buildState, currentStage.duration, currentStage.logs, currentStageElapsed, currentStageIndex, resetAll, screen, timeScale]);

  useEffect(() => {
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(presenterChannelName) : null;
    if (channel) channel.onmessage = (event: MessageEvent<PresenterCommand>) => executeBuildCommand(event.data);
    function onStorage(event: StorageEvent) {
      if (channel || event.key !== presenterCommandKey || !event.newValue) return;
      try {
        const payload = JSON.parse(event.newValue) as { command: PresenterCommand };
        executeBuildCommand(payload.command);
      } catch {
        return;
      }
    }
    window.addEventListener('storage', onStorage);
    return () => {
      channel?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, [executeBuildCommand]);

  if (screen === 'product') {
    return <FinalRunExperience onResetAll={resetAll} />;
  }

  if (screen === 'viewer') {
    const finalStage = buildStages[buildStages.length - 1];
    return (
      <main className="viewer-shell">
        <header className="viewer-topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">F</span>
            <div><strong>Harness Viewer</strong><span>FINAL MERMAID SNAPSHOT</span></div>
          </div>
          <div className="viewer-version">HARNESS v1.0</div>
          <div className="viewer-step">05 <span>/ 05 COMPLETE</span></div>
        </header>

        <section className="viewer-titlebar">
          <div>
            <div className="viewer-breadcrumb"><span>BUILD COMPLETE</span><i>/</i><strong>GLOBAL RUNTIME GRAPH</strong></div>
            <p>AUTO PLAN LOOM</p>
            <h1>Production Harness</h1>
            <h2>Autonomous Product Engineering Harness</h2>
          </div>
          <p className="viewer-description">5개의 hidden build instruction이 순차 적용된 최종 Harness입니다. Planning, Research, Engineering, Validation과 Production lifecycle이 하나의 Runtime Graph로 연결됩니다.</p>
        </section>

        <section className="graph-canvas">
          <div className="graph-grid" />
          <div className="graph-badge"><span /> MERMAID FLOWCHART · FINAL SNAPSHOT</div>
          <MermaidChart chart={finalStage.mermaid} stageId={finalStage.id} zoom={zoom} />
          <div className="zoom-controls" aria-label="Graph zoom controls">
            <button onClick={() => setZoom((value) => Math.min(1.5, value + .1))} aria-label="Zoom in">+</button>
            <button onClick={() => setZoom(1)} aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom((value) => Math.max(.55, value - .1))} aria-label="Zoom out">−</button>
          </div>
        </section>

        <footer className="viewer-footer">
          <div><span className="complete-dot" /> AUTO PLAN LOOM READY</div>
          <div className="shortcut-list"><kbd>R</kbd> Replay <kbd>ESC</kbd> Continue <kbd>→</kbd> Continue</div>
          <button onClick={() => setScreen('ready')}>Continue <span>→</span></button>
        </footer>
      </main>
    );
  }

  if (screen === 'ready') {
    return (
      <main className="ready-shell">
        <div className="ready-grid" />
        <header className="ready-topbar">
          <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Flogi Agent</strong><span>AUTO PLAN LOOM</span></div></div>
          <span>BUILD 5 / 5 COMPLETE</span>
        </header>
        <section className="ready-content">
          <div className="ready-kicker"><span /> ALL SYSTEMS COMPOSED</div>
          <p>AUTONOMOUS PRODUCT ENGINEERING</p>
          <h1>LOOM<br />READY</h1>
          <div className="ready-summary">
            {buildStages.map((item) => <div key={item.id}><span>0{item.id}</span><strong>{item.title}</strong><i>✓</i></div>)}
          </div>
          <button className="ready-command" onClick={() => setScreen('product')}><span>›</span><p>The completed loom is ready for its first product specification.</p><kbd>ENTER</kbd></button>
        </section>
        <footer className="ready-footer"><span>Autonomous Product Engineering Harness</span><strong>v1.0</strong></footer>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark" aria-hidden="true">F</span><div><strong>Flogi Agent</strong><span>Autonomous Harness Builder</span></div></div>
        <div className="mode-lockup"><span className="live-dot" /><span>{scenarioMeta.mode}</span><i /><span>DETERMINISTIC SESSION</span></div>
        <div className="step-counter"><span>STEP</span><strong>{buildState === 'idle' ? '00' : String(currentStage.id).padStart(2, '0')}</strong><em>/ 05</em></div>
      </header>

      <section className="workspace">
        <aside className="stage-rail" aria-label="Harness build progress">
          <p className="rail-label">AUTOMATED BUILD SEQUENCE</p>
          <ol>
            {buildStages.map((stage, index) => {
              const isDone = totalElapsed >= (index + 1) * stage.duration;
              const isActive = buildState !== 'idle' && index === currentStageIndex && !isDone;
              return (
                <li key={stage.id} className={`${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                  <span>{String(stage.id).padStart(2, '0')}</span>
                  <div><strong>{stage.shortTitle}</strong><small>{isDone ? 'COMPLETE' : isActive ? 'RUNNING' : 'QUEUED'}</small></div>
                </li>
              );
            })}
          </ol>
          <div className="rail-footer"><span>TOTAL</span><strong>{Math.round(progress)}%</strong></div>
        </aside>

        <section className="terminal-wrap">
          <div className="terminal-heading">
            <div><span>{buildState === 'idle' ? 'READY TO BUILD' : `STEP ${currentStage.id} / 5`}</span><h1>{buildState === 'idle' ? 'Auto Plan Loom' : currentStage.title}</h1><p>{buildState === 'idle' ? 'One prompt. Five hidden build stages. One final viewer.' : currentStage.eyebrow}</p></div>
            <div className="terminal-status"><span className={buildState === 'running' && !buildPaused ? 'spinning' : ''} />{buildState === 'idle' ? 'WAITING FOR INITIAL PROMPT' : buildPaused ? 'BUILD PAUSED BY PRESENTER' : buildState === 'running' ? 'AUTONOMOUS BUILD RUNNING' : 'BUILD COMPLETE'}</div>
          </div>

          <div className="terminal build-terminal" aria-live="polite">
            <div className="terminal-bar"><div className="traffic"><i /><i /><i /></div><span>flogi-agent — /auto-plan-loom</span><kbd>⌘ K</kbd></div>
            <div className="terminal-body">
              <div className="welcome-block">
                <span className="prompt-glyph">╭─</span>
                <div><strong>Autonomous Harness Builder</strong><p>Your first prompt starts the complete five-stage build sequence.</p></div>
              </div>

              {submittedPrompt && <div className="prompt-history"><span>›</span><p>{submittedPrompt}</p></div>}

              {buildState !== 'idle' && (
                <div className="agent-output build-output">
                  {stageOutputs.map(({ stage, isComplete, isCurrent, logs }) => {
                    if (!isComplete && !isCurrent) return null;
                    return (
                      <section className={`stage-output ${isComplete ? 'stage-complete' : ''}`} key={stage.id}>
                        <div className="stage-output-header">
                          <span>0{stage.id}</span>
                          <div><strong>{stage.title}</strong><small>Applying hidden instruction {String(stage.id).padStart(2, '0')} / 05</small></div>
                          {isComplete ? <i>✓</i> : <span className={`spinner ${buildPaused ? 'paused' : ''}`} />}
                        </div>
                        <div className="stage-log-list">
                          {logs.map((log) => <div className={`log-line ${log.type}`} key={`${stage.id}-${log.at}`}><span>{log.type === 'success' ? '✓' : log.type === 'work' ? '•' : '·'}</span><p>{log.text}</p></div>)}
                        </div>
                        {isComplete && <div className="stage-done-line">✓ STEP {stage.id} COMPLETE <span>{stage.id < 5 ? 'CONTINUING AUTOMATICALLY' : 'FINALIZING HARNESS'}</span></div>}
                      </section>
                    );
                  })}
                  {buildState === 'complete' && <div className="complete-block"><strong>✓ Autonomous Product Engineering Harness ready</strong><code>http://localhost:3000/viewer/harness</code><small>Opening final Harness Viewer…</small></div>}
                  <div ref={terminalEndRef} />
                </div>
              )}
            </div>

            <form className="prompt-form" onSubmit={submit}>
              <label htmlFor="agent-prompt">›</label>
              <textarea id="agent-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="완전한 자율 제품 개발 하네스를 만들어줘…" disabled={buildState !== 'idle'} rows={1} autoFocus />
              {buildState === 'idle' && !prompt ? <button type="button" className="canonical-button" onClick={() => setPrompt(buildStages[0].canonicalPrompt)} aria-label="Use initial canonical prompt">⊕</button> : <button type="submit" disabled={!prompt.trim() || buildState !== 'idle'} aria-label="Start complete build">↑</button>}
            </form>
          </div>
          <p className="terminal-hint"><kbd>ENTER</kbd> start all 5 stages <span /> <kbd>⊕</kbd> load initial prompt <span /> no further input required</p>
        </section>

        <aside className="context-panel">
          <div className="context-top"><span>SCENARIO</span><strong>LOCKED</strong></div>
          <h2>5 hidden instructions</h2>
          <p>최초 입력 한 번으로 준비된 5개 canonical prompt가 순서대로 실행됩니다. Viewer는 모든 단계가 끝난 뒤 한 번만 열립니다.</p>
          <div className="resource-stack hidden-prompts">
            {buildStages.map((stage) => <div key={stage.id}><span>0{stage.id}</span><p>{stage.title}</p><i>{totalElapsed >= stage.id * stage.duration ? '✓' : currentStage.id === stage.id && buildState === 'running' ? '▶' : '·'}</i></div>)}
          </div>
          <div className="scenario-note"><span>ONE INPUT · FIXED SCENARIO</span><p>사용자 문장은 화면에 그대로 남지만 Build 단계와 결과는 Scenario Data가 결정합니다.</p></div>
        </aside>
      </section>
      <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
    </main>
  );
}

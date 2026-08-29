'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MermaidChart } from '@/components/MermaidChart';
import { buildStageNames, buildStages, scenarioMeta } from '@/lib/scenario';

type RunState = 'idle' | 'running' | 'complete';
type Screen = 'cli' | 'viewer' | 'ready';

const storageKey = 'flogi-harness-build-state';

export default function Home() {
  const [stageIndex, setStageIndex] = useState(0);
  const [screen, setScreen] = useState<Screen>('cli');
  const [runState, setRunState] = useState<RunState>('idle');
  const [prompt, setPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const startedAt = useRef(0);

  const stage = buildStages[stageIndex];
  const scaledDuration = stage.duration / timeScale;

  useEffect(() => {
    const speed = Number(new URLSearchParams(window.location.search).get('speed'));
    if (Number.isFinite(speed) && speed >= 1 && speed <= 60) setTimeScale(speed);
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const state = JSON.parse(stored) as { stageIndex?: number; screen?: Screen; completed?: number[]; promptHistory?: Record<number, string> };
      if (typeof state.stageIndex === 'number') setStageIndex(Math.min(4, Math.max(0, state.stageIndex)));
      if (state.screen === 'viewer' || state.screen === 'ready') setScreen(state.screen);
      if (Array.isArray(state.completed)) setCompleted(state.completed);
      if (state.promptHistory) setPromptHistory(state.promptHistory);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ stageIndex, screen, completed, promptHistory }));
  }, [completed, promptHistory, screen, stageIndex]);

  useEffect(() => {
    if (runState !== 'running') return;
    startedAt.current = Date.now();
    const timer = window.setInterval(() => {
      const next = Date.now() - startedAt.current;
      setElapsed(next);
      if (next >= scaledDuration) {
        window.clearInterval(timer);
        setElapsed(scaledDuration);
        setRunState('complete');
        setCompleted((items) => items.includes(stage.id) ? items : [...items, stage.id]);
      }
    }, 120);
    return () => window.clearInterval(timer);
  }, [runState, scaledDuration, stage.id]);

  useEffect(() => {
    if (runState !== 'complete' || screen !== 'cli') return;
    const autoOpen = window.setTimeout(() => {
      setScreen('viewer');
      setZoom(1);
      window.history.replaceState(null, '', `/?screen=viewer&stage=${stage.id}`);
    }, Math.max(500, 1_800 / timeScale));
    return () => window.clearTimeout(autoOpen);
  }, [runState, screen, stage.id, timeScale]);

  const advanceFromViewer = useCallback(() => {
    if (stageIndex === buildStages.length - 1) {
      setScreen('ready');
      window.history.replaceState(null, '', '/?screen=ready');
      return;
    }
    setStageIndex((index) => index + 1);
    setScreen('cli');
    setRunState('idle');
    setElapsed(0);
    setPrompt('');
    window.history.replaceState(null, '', '/');
  }, [stageIndex]);

  const replayStage = useCallback(() => {
    setScreen('cli');
    setRunState('idle');
    setElapsed(0);
    setPrompt(promptHistory[stage.id] ?? '');
    window.history.replaceState(null, '', '/');
  }, [promptHistory, stage.id]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && screen === 'viewer') advanceFromViewer();
      if (event.key === 'ArrowRight' && screen === 'viewer') advanceFromViewer();
      if (event.key.toLowerCase() === 'r' && screen === 'viewer') replayStage();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceFromViewer, replayStage, screen]);

  const visibleLogs = useMemo(
    () => stage.logs.filter((log) => log.at / timeScale <= elapsed),
    [elapsed, stage.logs, timeScale],
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim() || runState === 'running') return;
    setPromptHistory((items) => ({ ...items, [stage.id]: prompt.trim() }));
    setPrompt('');
    setElapsed(0);
    setRunState('running');
  }

  if (screen === 'viewer') {
    return (
      <main className="viewer-shell">
        <header className="viewer-topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">F</span>
            <div><strong>Harness Viewer</strong><span>STATIC GRAPH SNAPSHOT</span></div>
          </div>
          <div className="viewer-version">HARNESS {stage.version}</div>
          <div className="viewer-step">STEP {String(stage.id).padStart(2, '0')} <span>/ 05</span></div>
        </header>

        <section className="viewer-titlebar">
          <div>
            <div className="viewer-breadcrumb">
              <span>GLOBAL HARNESS</span><i>/</i><strong>{stage.subtitle.toUpperCase()}</strong>
            </div>
            <p>STEP {stage.id} / 5</p>
            <h1>{stage.title}</h1>
            <h2>{stage.subtitle}</h2>
          </div>
          <p className="viewer-description">{stage.description}</p>
        </section>

        <section className="graph-canvas">
          <div className="graph-grid" />
          <div className="graph-badge"><span /> MERMAID FLOWCHART</div>
          <MermaidChart chart={stage.mermaid} stageId={stage.id} zoom={zoom} />
          <div className="zoom-controls" aria-label="Graph zoom controls">
            <button onClick={() => setZoom((value) => Math.min(1.5, value + .1))} aria-label="Zoom in">+</button>
            <button onClick={() => setZoom(1)} aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom((value) => Math.max(.55, value - .1))} aria-label="Zoom out">−</button>
          </div>
        </section>

        <footer className="viewer-footer">
          <div><span className="complete-dot" /> SNAPSHOT READY</div>
          <div className="shortcut-list"><kbd>R</kbd> Replay <kbd>ESC</kbd> CLI <kbd>→</kbd> Next</div>
          <button onClick={advanceFromViewer}>Back to CLI <span>→</span></button>
        </footer>
      </main>
    );
  }

  if (screen === 'ready') {
    return (
      <main className="ready-shell">
        <div className="ready-grid" />
        <header className="ready-topbar">
          <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Flogi Agent</strong><span>BUILD MODE</span></div></div>
          <span>SESSION 5 / 5 COMPLETE</span>
        </header>
        <section className="ready-content">
          <div className="ready-kicker"><span /> ALL SYSTEMS COMPOSED</div>
          <p>AUTONOMOUS PRODUCT ENGINEERING</p>
          <h1>HARNESS<br />READY</h1>
          <div className="ready-summary">
            {buildStages.map((item) => <div key={item.id}><span>0{item.id}</span><strong>{item.title}</strong><i>✓</i></div>)}
          </div>
          <div className="ready-command"><span>›</span><p>The completed harness is ready for its first product specification.</p><kbd>ENTER</kbd></div>
        </section>
        <footer className="ready-footer"><span>Autonomous Product Engineering Harness</span><strong>v1.0</strong></footer>
      </main>
    );
  }

  const submittedPrompt = promptHistory[stage.id];
  const progress = Math.min(100, (elapsed / scaledDuration) * 100);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">F</span>
          <div><strong>Flogi Agent</strong><span>Autonomous Harness Builder</span></div>
        </div>
        <div className="mode-lockup"><span className="live-dot" /><span>{scenarioMeta.mode}</span><i /><span>LOCAL SESSION</span></div>
        <div className="step-counter"><span>STEP</span><strong>{String(stage.id).padStart(2, '0')}</strong><em>/ 05</em></div>
      </header>

      <section className="workspace">
        <aside className="stage-rail" aria-label="Harness build progress">
          <p className="rail-label">BUILD SEQUENCE</p>
          <ol>
            {buildStageNames.map((name, index) => {
              const id = index + 1;
              const status = id === stage.id ? 'ACTIVE' : completed.includes(id) ? 'COMPLETE' : 'LOCKED';
              return (
                <li key={name} className={`${id === stage.id ? 'active' : ''} ${completed.includes(id) ? 'done' : ''}`}>
                  <span>{String(id).padStart(2, '0')}</span>
                  <div><strong>{name}</strong><small>{status}</small></div>
                </li>
              );
            })}
          </ol>
          <div className="rail-footer"><span>HARNESS</span><strong>{stage.version}</strong></div>
        </aside>

        <section className="terminal-wrap">
          <div className="terminal-heading">
            <div><span>STEP {stage.id} / 5</span><h1>{stage.title}</h1><p>{stage.eyebrow}</p></div>
            <div className="terminal-status"><span className={runState === 'running' ? 'spinning' : ''} />{runState === 'idle' ? 'WAITING FOR INPUT' : runState === 'running' ? 'AGENT WORKING' : 'BUILD COMPLETE'}</div>
          </div>

          <div className="terminal" aria-live="polite">
            <div className="terminal-bar">
              <div className="traffic"><i /><i /><i /></div>
              <span>flogi-agent — /autonomous-harness</span>
              <kbd>⌘ K</kbd>
            </div>
            <div className="terminal-body">
              <div className="welcome-block">
                <span className="prompt-glyph">╭─</span>
                <div><strong>Autonomous Harness Builder</strong><p>Describe the change. The current scenario stage controls the build.</p></div>
              </div>
              {submittedPrompt && <div className="prompt-history"><span>›</span><p>{submittedPrompt}</p></div>}
              {runState !== 'idle' && (
                <div className="agent-output">
                  {runState === 'running' && <div className="thinking-line"><span className="spinner" /><strong>Thinking</strong><small>{Math.ceil(elapsed * timeScale / 1000)}s</small></div>}
                  {visibleLogs.map((log) => <div className={`log-line ${log.type}`} key={`${log.at}-${log.text}`}><span>{log.type === 'success' ? '✓' : log.type === 'work' ? '•' : '·'}</span><p>{log.text}</p></div>)}
                  {runState === 'complete' && <div className="complete-block"><strong>✓ Harness updated</strong><code>http://localhost:3000/viewer/step-{stage.id}</code><small>Opening Harness Viewer…</small></div>}
                </div>
              )}
            </div>

            <form className="prompt-form" onSubmit={submit}>
              <label htmlFor="agent-prompt">›</label>
              <textarea
                id="agent-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }}
                placeholder={stage.id === 1 ? '하네스의 전체 실행 구조를 설계해줘…' : `Stage ${stage.id}에 필요한 변경을 요청하세요…`}
                disabled={runState === 'running' || runState === 'complete'}
                rows={1}
                autoFocus
              />
              {runState === 'idle' && !prompt ? <button type="button" className="canonical-button" onClick={() => setPrompt(stage.canonicalPrompt)} aria-label="Use canonical prompt">⊕</button> : <button type="submit" disabled={!prompt.trim() || runState !== 'idle'} aria-label="Submit prompt">↑</button>}
            </form>
          </div>
          <p className="terminal-hint"><kbd>ENTER</kbd> send <span /> <kbd>⊕</kbd> canonical prompt <span /> <kbd>SHIFT + ENTER</kbd> new line</p>
        </section>

        <aside className="context-panel">
          <div className="context-top"><span>SCENARIO</span><strong>LOCKED</strong></div>
          <h2>{stage.subtitle}</h2>
          <p>{stage.description}</p>
          <div className="resource-stack">
            {stage.resources.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><i>→</i></div>)}
          </div>
          <div className="scenario-note"><span>CANONICAL PROMPT</span><p>실제 입력은 화면에 보존되지만, 실행은 현재 Stage의 고정 Scenario를 따릅니다.</p></div>
        </aside>
      </section>
      <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
    </main>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { FinalRunExperience } from '@/components/FinalRunExperience';
import { MermaidChart } from '@/components/MermaidChart';
import { buildStages } from '@/lib/scenario';
import { finalRunStorageKey } from '@/lib/run-control';

type Screen = 'viewer' | 'product';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('viewer');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('screen');
      if (params.get('reset') === '1') window.localStorage.removeItem(finalRunStorageKey);
      if (requested === 'run') setScreen('product');
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  const openLoom = useCallback(() => {
    setScreen('product');
    window.history.replaceState(null, '', '/?screen=run');
  }, []);

  const resetAll = useCallback(() => {
    window.localStorage.removeItem(finalRunStorageKey);
    setScreen('viewer');
    setZoom(1);
    window.history.replaceState(null, '', '/?screen=viewer');
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        window.open('/presenter', 'flogi-presenter', 'width=520,height=820');
      }
      if (screen === 'viewer' && (event.key === 'Enter' || event.key === 'ArrowRight')) openLoom();
      if (screen === 'viewer' && event.key.toLowerCase() === 'r') setZoom(1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openLoom, screen]);

  if (screen === 'product') return <FinalRunExperience onResetAll={resetAll} />;

  const finalStage = buildStages[buildStages.length - 1];
  return (
    <main className="viewer-shell">
      <header className="viewer-topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">F</span>
          <div><strong>Harness Viewer</strong><span>최종 MERMAID SNAPSHOT</span></div>
        </div>
        <div className="viewer-version">HARNESS v1.0</div>
        <div className="viewer-step">05 <span>/ 05 완료</span></div>
      </header>

      <section className="viewer-titlebar">
        <div>
          <div className="viewer-breadcrumb"><span>CLI 구성 완료</span><i>/</i><strong>GLOBAL RUNTIME GRAPH</strong></div>
          <p>AUTO PLAN LOOM</p>
          <h1>Production Harness</h1>
          <h2>Autonomous Product Engineering Harness</h2>
        </div>
        <p className="viewer-description">Shell에서 구성된 5개 Harness Layer가 하나의 Global Runtime Graph로 연결되었습니다. 이제 이 Loom에 제품 구현 목표를 전달할 수 있습니다.</p>
      </section>

      <section className="graph-canvas">
        <div className="graph-grid" />
        <div className="graph-badge"><span /> MERMAID FLOWCHART · 최종 결과</div>
        <MermaidChart chart={finalStage.mermaid} stageId={finalStage.id} zoom={zoom} />
        <div className="zoom-controls" aria-label="그래프 확대/축소">
          <button onClick={() => setZoom((value) => Math.min(1.5, value + .1))} aria-label="확대">+</button>
          <button onClick={() => setZoom(1)} aria-label="배율 초기화">{Math.round(zoom * 100)}%</button>
          <button onClick={() => setZoom((value) => Math.max(.55, value - .1))} aria-label="축소">−</button>
        </div>
      </section>

      <footer className="viewer-footer">
        <div><span className="complete-dot" /> AUTO PLAN LOOM 준비 완료</div>
        <div className="shortcut-list"><kbd>R</kbd> 배율 초기화 <kbd>ENTER</kbd> 계속 <kbd>→</kbd> 계속</div>
        <button onClick={openLoom}>Loom 구성 계속 <span>→</span></button>
      </footer>
    </main>
  );
}

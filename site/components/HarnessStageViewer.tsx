'use client';

import { useEffect, useState } from 'react';
import type { BuildStage } from '@/lib/scenario';
import { MermaidChart } from '@/components/MermaidChart';

export function HarnessStageViewer({ stage, speed }: { stage: BuildStage; speed: number }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.toLowerCase() === 'r') setZoom(1);
      if (event.key === '+' || event.key === '=') setZoom((value) => Math.min(4, value + .25));
      if (event.key === '-') setZoom((value) => Math.max(.5, value - .25));
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <main className="stage-viewer">
    <header className="stage-viewer-header">
      <div className="stage-viewer-title"><span>HARNESS · STEP {stage.id} / 5</span><h1>{stage.eyebrow}</h1></div>
      <div className="stage-zoom-controls" aria-label="다이어그램 확대/축소">
        <button type="button" onClick={() => setZoom((value) => Math.max(.5, value - .25))} aria-label="축소">−</button>
        <button type="button" onClick={() => setZoom(1)} aria-label="화면에 맞추기">{Math.round(zoom * 100)}%</button>
        <button type="button" onClick={() => setZoom((value) => Math.min(4, value + .25))} aria-label="확대">+</button>
      </div>
    </header>
    <section className="stage-viewer-canvas" aria-label={`STEP ${stage.id} 다이어그램`}>
      <MermaidChart chart={stage.mermaid} stageId={stage.id} zoom={zoom} />
    </section>
    <footer className="stage-viewer-footer">
      <span>설명 후 터미널로 돌아가 {stage.id < 5 ? `STEP ${stage.id + 1} 프롬프트를 입력하세요.` : 'STEP 6 실행 명령을 입력하세요.'}</span>
      <span>+ / − 확대·축소 · R 화면 맞춤</span>
    </footer>
    <a className="global-reset-button" href={`/?screen=run&reset=1&speed=${speed}`} aria-label="모든 실행 흐름 초기화" title="모든 실행 흐름 초기화">↻ RESET</a>
  </main>;
}

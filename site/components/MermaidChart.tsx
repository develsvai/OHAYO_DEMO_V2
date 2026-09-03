'use client';

import { useEffect, useRef, useState } from 'react';

type MermaidChartProps = {
  chart: string;
  stageId: number;
  zoom: number;
};

export function MermaidChart({ chart, stageId, zoom }: MermaidChartProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setViewport({ width: element.clientWidth, height: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: 'Inter, Pretendard, sans-serif',
          flowchart: { curve: 'basis', htmlLabels: true, nodeSpacing: 32, rankSpacing: 52 },
          themeVariables: {
            background: '#f8fafc',
            primaryColor: '#ffffff',
            primaryTextColor: '#0f172a',
            primaryBorderColor: '#94a3b8',
            lineColor: '#64748b',
            clusterBkg: '#f1f5f9',
            clusterBorder: '#cbd5e1',
            edgeLabelBackground: '#ffffff',
            fontSize: '16px',
          },
        });
        const renderId = `harness-graph-${stageId}-${Date.now()}`;
        const { svg, bindFunctions } = await mermaid.render(renderId, chart);
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = svg;
        const element = hostRef.current.querySelector('svg');
        if (element) {
          const { width, height } = element.viewBox.baseVal;
          setSize({ width: Math.max(1, width), height: Math.max(1, height) });
          element.style.maxWidth = 'none';
          element.setAttribute('width', '100%');
          element.setAttribute('height', '100%');
          element.setAttribute('role', 'img');
          element.setAttribute('aria-label', `STEP ${stageId} 하네스 구조`);
        }
        bindFunctions?.(hostRef.current);
        setError('');
      } catch {
        if (!cancelled) setError('다이어그램을 표시하지 못했습니다. 페이지를 새로고침해 주세요.');
      }
    }

    void renderChart();
    return () => { cancelled = true; };
  }, [chart, stageId]);

  const fit = Math.max(.01, Math.min((viewport.width - 48) / size.width, (viewport.height - 48) / size.height));
  const width = size.width * fit * zoom;
  const height = size.height * fit * zoom;

  return (
    <div ref={viewportRef} className="mermaid-viewport" tabIndex={0} aria-label="다이어그램 스크롤 영역">
      <div className="mermaid-stage" style={{ width: Math.max(viewport.width, width + 48), height: Math.max(viewport.height, height + 48) }}>
        {error && <p className="mermaid-error" role="alert">{error}</p>}
        <div ref={hostRef} className="mermaid-host" style={{ width, height, display: error ? 'none' : undefined }} />
      </div>
    </div>
  );
}

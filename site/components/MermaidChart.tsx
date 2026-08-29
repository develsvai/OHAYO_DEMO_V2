'use client';

import { useEffect, useRef, useState } from 'react';

type MermaidChartProps = {
  chart: string;
  stageId: number;
  zoom: number;
};

export function MermaidChart({ chart, stageId, zoom }: MermaidChartProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

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
            background: '#0d0f12',
            primaryColor: '#171a1f',
            primaryTextColor: '#ecefeb',
            primaryBorderColor: '#565c66',
            secondaryColor: '#121711',
            secondaryTextColor: '#b8ff65',
            secondaryBorderColor: '#617448',
            tertiaryColor: '#10181a',
            tertiaryTextColor: '#78e8d5',
            tertiaryBorderColor: '#355e5a',
            lineColor: '#8d949e',
            clusterBkg: '#101216',
            clusterBorder: '#343941',
            edgeLabelBackground: '#0d0f12',
            fontSize: '13px',
          },
        });
        const renderId = `harness-graph-${stageId}-${Date.now()}`;
        const { svg, bindFunctions } = await mermaid.render(renderId, chart);
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = svg;
        bindFunctions?.(hostRef.current);
        setError('');
      } catch {
        if (!cancelled) setError('Graph snapshot could not be rendered.');
      }
    }

    void renderChart();
    return () => { cancelled = true; };
  }, [chart, stageId]);

  return (
    <div className="mermaid-stage" style={{ transform: `scale(${zoom})` }}>
      {error ? <p className="mermaid-error">{error}</p> : <div ref={hostRef} className="mermaid-host" />}
    </div>
  );
}

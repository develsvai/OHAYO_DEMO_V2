'use client';

import { useCallback, useEffect, useState } from 'react';
import { FinalRunExperience } from '@/components/FinalRunExperience';
import { finalRunStorageKey, presenterCommandKey } from '@/lib/run-control';

function validSpeed(value: string | null) {
  const speed = Number(value);
  return Number.isFinite(speed) && speed >= 1 && speed <= 60 ? speed : 1;
}

export default function Home() {
  const [run, setRun] = useState<{ speed: number; key: number } | null>(null);

  useEffect(() => {
    // Clear the previous run before mounting the component that restores it.
    const bootstrap = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const speed = validSpeed(params.get('speed'));
      if (params.get('reset') === '1') {
        window.localStorage.removeItem(finalRunStorageKey);
        window.localStorage.removeItem(presenterCommandKey);
      }
      window.history.replaceState(null, '', `/?screen=run&speed=${speed}`);
      setRun({ speed, key: 0 });
    }, 0);
    return () => window.clearTimeout(bootstrap);
  }, []);

  const resetAll = useCallback(() => {
    window.localStorage.removeItem(finalRunStorageKey);
    window.localStorage.removeItem(presenterCommandKey);
    setRun((current) => current ? { ...current, key: current.key + 1 } : current);
  }, []);

  if (!run) return <main className="product-prompt-shell" aria-busy="true" aria-label="Loom 준비 중" />;

  return <>
    <FinalRunExperience key={run.key} initialSpeed={run.speed} onResetAll={resetAll} />
    <button className="global-reset-button" type="button" onClick={resetAll} aria-label="모든 실행 흐름 초기화" title="모든 실행 흐름 초기화">↻ RESET</button>
  </>;
}

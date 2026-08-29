import { readFileSync } from 'node:fs';

const scenario = readFileSync(new URL('../lib/scenario.ts', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const finalExperience = readFileSync(new URL('../components/FinalRunExperience.tsx', import.meta.url), 'utf8');
const controls = readFileSync(new URL('../lib/run-control.ts', import.meta.url), 'utf8');
const presenter = readFileSync(new URL('../app/presenter/page.tsx', import.meta.url), 'utf8');

function matches(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const buildSource = scenario.split('export const finalRun =')[0];
const finalSource = scenario.split('export const finalRun =')[1];
const expectedBuildTitles = [
  'Harness Skeleton',
  'Auto Planning Graph',
  'Engineering Runtime',
  'Runtime Intelligence',
  'Production Harness',
];

assert(matches(buildSource, /canonicalPrompt: `/g) === 5, 'Build canonical prompt는 정확히 5개여야 합니다.');
assert(matches(buildSource, /duration: minute/g) === 5, 'Build Stage는 각각 60초 Duration을 가져야 합니다.');
assert(expectedBuildTitles.every((title, index) => buildSource.indexOf(title) < buildSource.indexOf(expectedBuildTitles[index + 1] ?? 'export const scenarioMeta')), 'Build Stage 순서가 올바르지 않습니다.');
const mermaidCharts = [...buildSource.matchAll(/mermaid: `([\s\S]*?)`,\n  }/g)]
  .map((match) => Function(`return \`${match[1]}\``)());
assert(mermaidCharts.length === 5, 'STEP 1~5 Mermaid Snapshot이 정확히 5개여야 합니다.');
assert(mermaidCharts.every((chart) => chart.startsWith('flowchart TD')), '모든 Harness Snapshot은 Mermaid flowchart여야 합니다.');
assert(matches(page, /setScreen\('viewer'\)/g) === 1, 'Harness Viewer 전환은 마지막에 한 번만 존재해야 합니다.');
assert(!page.includes('advanceFromViewer') && !page.includes('Back to CLI'), 'STEP별 Viewer 왕복 로직이 남아 있습니다.');
assert(page.includes('One prompt. Five hidden build stages. One final viewer.'), '단일 최초 입력 계약 문구가 누락됐습니다.');
assert(page.includes('totalElapsed') && page.includes('totalDuration'), '5단계 자동 진행을 통제하는 전체 Timeline이 누락됐습니다.');
assert(page.includes('if (!hydrated) return;'), 'Build 상태 복원 전 저장을 막는 hydration guard가 누락됐습니다.');
assert(page.includes('buildPaused') && page.includes('presenterChannelName'), 'Build Timeline용 Presenter 제어가 누락됐습니다.');
assert(page.includes("command.type === 'show-result'") && page.includes("setScreen('product')"), 'Build 중 결과 강제 이동 경로가 누락됐습니다.');

assert(matches(finalSource, /^      id: \d+,/gm) === 10, 'Final Run Task는 정확히 10개여야 합니다.');
assert(matches(finalSource, /events: (?:standardEvents|retryEvents)\(/g) === 10, '모든 Final Run Task에 Event Timeline이 있어야 합니다.');
assert(matches(finalSource, /events: retryEvents\(/g) === 2, 'Validation Repair/Retry Task는 정확히 2개여야 합니다.');
assert(finalSource.includes('taskDuration: 120_000'), 'Final Run Task Duration은 120초여야 합니다.');
assert(finalSource.includes("finalUrl: 'https://ohayo.flogi.app'"), '최종 URL Source of Truth가 누락됐습니다.');

for (const command of ['pause', 'resume', 'next-event', 'next-task', 'complete-current', 'reset-run', 'reset-all', 'show-result', 'set-speed']) {
  assert(controls.includes(`type: '${command}'`), `Presenter command ${command}가 누락됐습니다.`);
}

assert(finalExperience.includes('QRCodeSVG') && finalExperience.includes('finalRun.finalUrl'), '결과 QR과 finalUrl 연결이 누락됐습니다.');
assert(finalExperience.includes("viewMode === 'cli'") && finalExperience.includes('cli-fallback-shell'), 'CLI fallback이 누락됐습니다.');
assert(finalExperience.includes('BroadcastChannel') && finalExperience.includes('localStorage'), 'Presenter 통신 fallback이 누락됐습니다.');
assert(finalExperience.includes('if (!hydrated) return;'), 'Final Run 상태 복원 전 저장을 막는 hydration guard가 누락됐습니다.');
assert(presenter.includes('SHOW RESULT') && presenter.includes('RESET ALL') && presenter.includes('NEXT EVENT'), 'Presenter 복구 Control이 누락됐습니다.');
assert(presenter.includes('buildRunStorageKey') && presenter.includes("buildState.screen !== 'product'"), 'Presenter에서 Build 상태를 추적하지 않습니다.');

console.log('Simulator contract validation [OK]');
console.log('- Initial prompt: 1');
console.log('- Hidden build stages: 5 × 60 seconds');
console.log('- Final Mermaid viewer transitions: 1');
console.log('- Mermaid flowchart snapshots: 5');
console.log('- Product tasks: 10 × 120 seconds');
console.log('- Retry loops: 2');
console.log('- Presenter commands: 9');
console.log('- Build and product presenter recovery: enabled');

import { readFileSync, statSync } from 'node:fs';

const scenario = readFileSync(new URL('../lib/scenario.ts', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const finalExperience = readFileSync(new URL('../components/FinalRunExperience.tsx', import.meta.url), 'utf8');
const controls = readFileSync(new URL('../lib/run-control.ts', import.meta.url), 'utf8');
const presenter = readFileSync(new URL('../app/presenter/page.tsx', import.meta.url), 'utf8');
const demoCli = readFileSync(new URL('./demo-cli.mjs', import.meta.url), 'utf8');
const demoLauncher = readFileSync(new URL('./demo-launcher.mjs', import.meta.url), 'utf8');
const demoStartUrl = new URL('../../demo_start', import.meta.url);
const demoStart = readFileSync(demoStartUrl, 'utf8');

function matches(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const buildSource = scenario.split('export const finalRun =')[0];
const finalSource = scenario.split('export const finalRun =')[1];
const expectedBuildTitles = ['Harness Skeleton', 'Auto Planning Graph', 'Engineering Runtime', 'Runtime Intelligence', 'Production Harness'];

assert(matches(buildSource, /canonicalPrompt: `/g) === 5, 'Build canonical prompt는 정확히 5개여야 합니다.');
assert(matches(buildSource, /duration: minute/g) === 5, 'Build Stage는 각각 60초여야 합니다.');
assert(expectedBuildTitles.every((title, index) => buildSource.indexOf(title) < buildSource.indexOf(expectedBuildTitles[index + 1] ?? 'export const scenarioMeta')), 'Build Stage 순서가 올바르지 않습니다.');

const mermaidCharts = [...buildSource.matchAll(/mermaid: `([\s\S]*?)`,\n  }/g)].map((match) => Function(`return \`${match[1]}\``)());
assert(mermaidCharts.length === 5 && mermaidCharts.every((chart) => chart.startsWith('flowchart TD')), 'STEP 1~5 Mermaid flowchart가 정확히 5개여야 합니다.');

assert((statSync(demoStartUrl).mode & 0o111) !== 0, 'demo_start에 실행 권한이 필요합니다.');
assert(demoStart.includes('demo-launcher.mjs') && demoStart.split('\n').length <= 8, 'demo_start는 최소 Shell wrapper로 Launcher를 실행해야 합니다.');
assert(demoLauncher.includes('runDemoCli') && demoLauncher.includes('openViewer()'), 'Launcher가 Shell CLI 완료 후 Viewer를 자동으로 열어야 합니다.');
assert(demoLauncher.includes('reset=1') && page.includes("params.get('reset') === '1'"), '새 발표 시작 시 이전 Web 실행 상태를 초기화해야 합니다.');
assert(demoCli.includes("import { buildStages } from '../lib/scenario.ts'"), 'Shell CLI는 scenario.ts의 단일 Build Data를 사용해야 합니다.');
assert(demoCli.includes('for (const stage of buildStages)') && demoCli.includes('readPrompt()'), 'Shell CLI 단일 입력 후 STEP 1~5 자동 실행이 누락됐습니다.');
assert(demoCli.includes('OpenAI Codex (v0.149.1)') && demoCli.includes('Ask Codex to do anything'), '첨부 스크린샷 기반 Codex 시작 화면이 누락됐습니다.');
assert(!/가짜|고정 시나리오|아무 문장|입력 내용은 표시만|실제 의미 분석/.test(`${demoCli}\n${page}\n${finalExperience}`), '발표 화면에 내부 연출 방식을 드러내는 문구가 남아 있습니다.');

assert(page.includes('<MermaidChart') && page.includes("type Screen = 'viewer' | 'product'"), 'Web은 최종 Mermaid Viewer부터 시작해야 합니다.');
assert(!page.includes('buildState') && !page.includes('prompt-form'), '브라우저에 Harness Build CLI가 중복 구현되어 있습니다.');
assert(page.includes('Loom 구성 계속') && page.includes("setScreen('product')"), 'Viewer Continue 후 Loom 제품 화면으로 이동해야 합니다.');

assert(matches(finalSource, /^      id: \d+,/gm) === 10, 'Final Run Task는 정확히 10개여야 합니다.');
assert(finalSource.includes('taskPlanningInterval: 20_000'), 'Task Node 구성 간격은 20초여야 합니다.');
assert(finalExperience.includes("setScreen('planning')") && finalExperience.includes("screen === 'planning'"), '제품 Prompt 뒤 Task 구성 단계가 누락됐습니다.');
assert(finalExperience.includes('Math.floor(planningElapsed / finalRun.taskPlanningInterval)'), '20초마다 Task Node가 하나씩 구성되어야 합니다.');
assert(matches(finalExperience, /\[\d+, \d+\]/g) >= 14 && finalExperience.includes('task-node'), '10개 Task 의존성 Graph가 누락됐습니다.');
assert(matches(finalSource, /events: (?:standardEvents|retryEvents)\(/g) === 10, '모든 실행 Task에 Event Timeline이 있어야 합니다.');
assert(matches(finalSource, /events: retryEvents\(/g) === 2, 'Repair/Retry Task는 정확히 2개여야 합니다.');
assert(finalSource.includes('taskDuration: 120_000'), 'Task 실행 시간은 120초여야 합니다.');
assert(finalSource.includes("finalUrl: 'https://ohayo.tail2dac17.ts.net/'"), '최종 OHAYO URL이 정확하지 않습니다.');

for (const command of ['pause', 'resume', 'next-event', 'next-task', 'complete-current', 'reset-run', 'reset-all', 'show-result', 'set-speed']) {
  assert(controls.includes(`type: '${command}'`), `Presenter command ${command}가 누락됐습니다.`);
}

assert(finalExperience.includes('QRCodeSVG') && finalExperience.includes('finalRun.finalUrl'), '결과 QR과 finalUrl 연결이 누락됐습니다.');
assert(finalExperience.includes("viewMode === 'cli'") && finalExperience.includes('cli-fallback-shell'), '실행용 CLI fallback이 누락됐습니다.');
assert(finalExperience.includes('BroadcastChannel') && finalExperience.includes('localStorage'), 'Presenter 통신 fallback이 누락됐습니다.');
assert(finalExperience.includes('if (!hydrated) return;'), '상태 복원 전 저장을 막는 hydration guard가 누락됐습니다.');
assert(presenter.includes('planningElapsed') && presenter.includes('finalRun.taskPlanningInterval'), 'Presenter가 Task 구성 단계를 추적하지 않습니다.');

console.log('Presentation flow validation [OK]');
console.log('- Shell entry: ./demo_start');
console.log('- Codex CLI: 1 input → 5 × 60-second stages');
console.log('- Web entry: final Mermaid viewer');
console.log('- Task graph planning: 10 × 20 seconds = 200 seconds');
console.log('- Task execution: 10 × 120 seconds');
console.log('- Presenter commands: 9');
console.log('- Result URL + QR: https://ohayo.tail2dac17.ts.net/');

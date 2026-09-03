import { readFileSync, statSync } from 'node:fs';
import { buildStages, finalRun } from '../lib/scenario.ts';
import { runDemoCli } from './demo-cli.mjs';
import { createTaskGraph, graphHeight, taskNodeHeight, taskNodeWidth } from '../lib/task-graph.ts';
import { layoutPrompt, cellWidth } from './prompt-layout.mjs';

const scenario = readFileSync(new URL('../lib/scenario.ts', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const finalExperience = readFileSync(new URL('../components/FinalRunExperience.tsx', import.meta.url), 'utf8');
const controls = readFileSync(new URL('../lib/run-control.ts', import.meta.url), 'utf8');
const presenter = readFileSync(new URL('../app/presenter/page.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const demoCli = readFileSync(new URL('./demo-cli.mjs', import.meta.url), 'utf8');
const promptRenderer = readFileSync(new URL('./prompt-layout.mjs', import.meta.url), 'utf8');
const demoLauncher = readFileSync(new URL('./demo-launcher.mjs', import.meta.url), 'utf8');
const demoStartUrl = new URL('../../demo_start', import.meta.url);
const demoStart = readFileSync(demoStartUrl, 'utf8');
const demoAliasUrl = new URL('../../demo-start', import.meta.url);
const demoAlias = readFileSync(demoAliasUrl, 'utf8');

function matches(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const buildSource = scenario.split('export const finalRun =')[0];
const finalSource = scenario.split('export const finalRun =')[1];
const expectedBuildTitles = ['Harness Skeleton', 'Auto Planning Graph', 'Production Agent Cluster', 'Deployment Agent', 'Production Harness'];

assert(matches(buildSource, /canonicalPrompt: `/g) === 5, 'Build canonical prompt는 정확히 5개여야 합니다.');
assert(matches(buildSource, /duration: minute/g) === 5, 'Build Stage는 각각 60초여야 합니다.');
assert(expectedBuildTitles.every((title, index) => buildSource.indexOf(title) < buildSource.indexOf(expectedBuildTitles[index + 1] ?? 'export const scenarioMeta')), 'Build Stage 순서가 올바르지 않습니다.');

const source = readFileSync(new URL('../../docs/harness-demo/source.md', import.meta.url), 'utf8');
const sourceCharts = [...source.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((match) => match[1]);
const sourcePrompts = [...source.matchAll(/```text\n([\s\S]*?)\n```/g)].slice(0, 5).map((match) => match[1]);
assert(buildStages.length === 5 && sourceCharts.length === 5, 'STEP 1~5 다이어그램이 정확히 5개여야 합니다.');
for (const [index, stage] of buildStages.entries()) {
  const extracted = readFileSync(new URL(`../../docs/harness-demo/step-${index + 1}.mmd`, import.meta.url), 'utf8');
  assert(stage.id === index + 1 && stage.duration === 60_000, '단계 순서와 60초 실행을 유지해야 합니다.');
  assert(stage.mermaid === extracted && stage.mermaid === sourceCharts[index], `STEP ${stage.id} Mermaid가 사용자 원문과 다릅니다.`);
  assert(stage.canonicalPrompt === sourcePrompts[index], `STEP ${stage.id} Prompt가 사용자 원문과 다릅니다.`);
  assert(stage.logs.every((log, n) => log.at <= stage.duration && (n === 0 || log.at >= stage.logs[n - 1].at)), '단계 로그가 실행 시간 범위를 벗어납니다.');
}

assert((statSync(demoStartUrl).mode & 0o111) !== 0, 'demo_start에 실행 권한이 필요합니다.');
assert((statSync(demoAliasUrl).mode & 0o111) !== 0, 'demo-start에 실행 권한이 필요합니다.');
assert(demoStart.includes('demo-launcher.mjs') && demoStart.split('\n').length <= 8, 'demo_start는 최소 Shell wrapper로 Launcher를 실행해야 합니다.');
assert(demoAlias.includes('exec "./demo_start"'), 'demo-start는 demo_start 실행 별칭이어야 합니다.');
assert(demoLauncher.includes('runDemoCli({ baseUrl: serverUrl, openViewer })'), 'Launcher가 단계별 Viewer 열기를 CLI에 연결해야 합니다.');
assert(demoLauncher.includes("test: { id: '1', name: '5분 테스트 모드', speed: 7 }") && demoLauncher.includes("demo: { id: '2', name: '데모 모드', speed: 1 }"), '실행 모드 1/2의 속도 설정이 정확하지 않습니다.');
assert(demoLauncher.includes('chooseMode()') && demoLauncher.includes('DEMO_MODE'), 'Launcher 실행 모드 선택 또는 자동화용 환경 설정이 누락됐습니다.');
assert(demoLauncher.includes('const speed = mode.speed;') && !demoLauncher.includes('process.env.DEMO_SPEED'), '선택한 실행 모드의 속도를 다른 값이 덮어쓰면 안 됩니다.');
assert(demoCli.includes("url.searchParams.set('reset', '1')") && page.includes("params.get('reset') === '1'"), '새 발표의 STEP 6 진입 시 이전 제품 상태를 초기화해야 합니다.');
assert(demoCli.includes("import { buildStages } from '../lib/scenario.ts'"), 'Shell CLI는 scenario.ts의 단일 Build Data를 사용해야 합니다.');
assert(demoCli.includes('readTerminalPrompt') && demoCli.includes('200~') && demoCli.includes('201~'), '여러 줄 프롬프트 붙여넣기 경계 처리가 필요합니다.');
assert(demoCli.includes('OpenAI Codex (v0.149.1)') && promptRenderer.includes('Ask Codex to do anything'), '첨부 스크린샷 기반 Codex 시작 화면이 누락됐습니다.');
assert(!/가짜|고정 시나리오|아무 문장|입력 내용은 표시만|실제 의미 분석/.test(`${demoCli}\n${page}\n${finalExperience}`), '발표 화면에 내부 연출 방식을 드러내는 문구가 남아 있습니다.');

const stagePage = readFileSync(new URL('../app/harness/[step]/page.tsx', import.meta.url), 'utf8');
const stageViewer = readFileSync(new URL('../components/HarnessStageViewer.tsx', import.meta.url), 'utf8');
assert(stagePage.includes('notFound()') && stagePage.includes('HarnessStageViewer'), 'STEP별 Viewer와 잘못된 단계 처리가 필요합니다.');
assert(!page.includes('MermaidChart') && !page.includes('Loom 구성 계속') && !stageViewer.includes('Loom 구성 계속'), '추가 최종 다이어그램과 Continue 화면을 제거해야 합니다.');
assert(stageViewer.includes('chart={stage.mermaid}') && stageViewer.includes('stageId={stage.id}'), '현재 단계의 전체 스냅샷을 표시해야 합니다.');
assert(page.includes('initialSpeed={run.speed}') && page.includes('key={run.key}'), '제품 진입 시 속도 전달과 RESET 재시작이 필요합니다.');
assert(page.includes('className="global-reset-button"') && styles.includes('.global-reset-button'), '제품 화면의 전역 RESET 버튼이 누락됐습니다.');
assert(matches(page, /removeItem\((?:finalRunStorageKey|presenterCommandKey)\)/g) >= 4, '진입 초기화와 RESET은 실행 상태 및 Presenter 명령을 모두 삭제해야 합니다.');
assert(finalExperience.includes('initialSpeed') && finalExperience.includes('useState(initialSpeed)'), 'Web 실행 속도는 Launcher가 전달한 모드 속도로 시작해야 합니다.');
assert(finalExperience.includes("setScreen('prompt')") && finalExperience.includes('setPlanningElapsed(0)') && finalExperience.includes('setCompletedTaskIds([])'), 'Product Run 초기화 상태가 완전하지 않습니다.');
assert(presenter.includes('제품 Prompt부터 재시작'), 'Presenter 전체 초기화 설명이 실제 동작과 일치하지 않습니다.');

assert(finalRun.tasks.length === 40, '제품 Task는 정확히 40개여야 합니다.');
assert(finalSource.includes('taskGraphDuration: 200_000'), 'Task 선별·생성은 40개 × 5초로 총 200초여야 합니다.');
assert(!finalSource.includes('taskPlanningInterval') && !finalExperience.includes('20초마다 Task Node'), '발표 화면에 내부 Task 생성 간격 설명이 노출되면 안 됩니다.');
assert(finalExperience.includes("setScreen('planning')") && finalExperience.includes("screen === 'planning'"), '제품 Prompt 뒤 Task 구성 단계가 누락됐습니다.');
assert(finalExperience.includes('const nodeRevealDuration = planningDuration / finalRun.tasks.length') && finalExperience.includes('Math.floor(planningElapsed / nodeRevealDuration)'), 'Task 구성 화면은 0/40부터 Node를 순차 생성해야 합니다.');
assert(finalExperience.includes("plannedCount === 0") && finalExperience.includes('Task 선별·생성 중'), 'Task 0/40 선별·생성 시작 상태가 누락됐습니다.');
assert(finalExperience.includes('createTaskGraph(finalRun.tasks)') && finalExperience.includes('task-node'), '40개 Task 데이터와 Graph가 연결되어야 합니다.');
assert(finalExperience.includes('task-node-spinner') && finalExperience.includes("aria-label=\"실행 중\""), '실행 중인 Task Node Spinner가 누락됐습니다.');
assert(finalExperience.includes('ResizeObserver') && finalExperience.includes('graphScale'), 'Task Graph의 화면 자동 맞춤이 누락됐습니다.');
assert(styles.includes('grid-template-columns: 224px minmax(0, 1fr)') && styles.includes('.task-graph-fit'), '축소된 Inspector와 전체 Graph Fit Layout이 누락됐습니다.');
assert(styles.includes('.task-node-spinner') && styles.includes('animation: spin .72s linear infinite'), '실행 Node Spinner Animation이 누락됐습니다.');
assert(/\.task-graph-viewport \{[^}]*overflow: auto/.test(styles), '제품 Task Graph는 끝까지 스크롤할 수 있어야 합니다.');
assert(/\.mermaid-viewport \{[^}]*overflow: auto/.test(styles), '확대한 단계 다이어그램 전체를 스크롤할 수 있어야 합니다.');
assert(styles.includes('height: 100dvh') && styles.includes('html, body') && styles.includes('overflow: hidden'), 'Web 화면의 Viewport 고정 규칙이 누락됐습니다.');
const { graphLayout, graphWidth, graphEdges, edgePath, graphGroups } = createTaskGraph(finalRun.tasks);
assert(graphLayout.length === 41 && graphGroups.length === 10, '40개 Task와 입력 노드를 10개 기능 묶음으로 배치해야 합니다.');
for (const [index, task] of finalRun.tasks.entries()) {
  assert(task.id === index + 1 && task.title && task.owner && task.goal, '모든 Task에 고유 순서와 설명이 필요합니다.');
  assert(task.dependsOn.length && task.dependsOn.every((id) => Number.isInteger(id) && id >= 0 && id < task.id), '의존성은 존재하는 앞선 Task 또는 제품 입력을 가리켜야 합니다.');
  assert(task.events[0].at === 0 && task.events.at(-1).at === finalRun.taskDuration && task.events.at(-1).state === 'done', 'Task 이벤트가 시작과 완료 시간을 포함해야 합니다.');
  assert(task.events.every((event, n) => event.at >= 0 && event.at <= finalRun.taskDuration && (n === 0 || event.at > task.events[n - 1].at)), '이벤트 순서와 시간이 Task 실행 범위 안에 있어야 합니다.');
  const node = graphLayout[task.id];
  assert(node && node.x + taskNodeWidth < graphWidth && node.y + taskNodeHeight < graphHeight, '모든 노드는 스크롤 가능한 Graph 안에 있어야 합니다.');
}
assert(new Set(finalRun.tasks.map((task) => task.title)).size === 40, '40개 Task는 서로 구분되는 작업이어야 합니다.');
assert(graphEdges.length === finalRun.tasks.reduce((sum, task) => sum + task.dependsOn.length, 0) && graphEdges.every(([a, b]) => !edgePath(a, b).includes('undefined')), '모든 의존성 경로가 렌더 가능해야 합니다.');
for (let i = 0; i < graphLayout.length; i += 1) for (let j = i + 1; j < graphLayout.length; j += 1) {
  const a = graphLayout[i], b = graphLayout[j];
  assert(Math.abs(a.x - b.x) >= taskNodeWidth || Math.abs(a.y - b.y) >= taskNodeHeight, 'Task 노드가 겹치면 안 됩니다.');
}
for (const [width, height] of [[1440, 900], [1920, 1080]]) {
  const scale = Math.max(.75, Math.min(1, (height - 202) / graphHeight));
  assert(graphWidth * scale > width - 224 && taskNodeWidth * scale >= 142, '노드를 작게 뭉개지 않고 가로 스크롤로 보여야 합니다.');
}
const retryTasks = finalRun.tasks.filter((task) => task.events.some((event) => event.state === 'failed'));
assert(retryTasks.map((task) => task.id).join(',') === '20,36', '매칭과 복구 검증 Task에 실패/복구 시퀀스가 필요합니다.');
for (const task of retryTasks) assert(['failed', 'repairing', 'retrying', 'done'].every((state) => task.events.some((event) => event.state === state)), '복구 이벤트가 누락됐습니다.');
assert(finalRun.taskDuration === 30_000 && finalRun.tasks.length * finalRun.taskDuration === 1_200_000, '40개 × 30초로 총 실행 20분을 유지해야 합니다.');
assert(!/\/ 10(?:<| Task)|\/10\]|Math\.min\(9,/.test(finalExperience + presenter), '10개 기준 카운트나 복원 상한이 남아 있으면 안 됩니다.');
assert(controls.includes('flogi-final-run-state-v3'), '10개 Task 저장 상태와 새 실행 저장 상태를 구분해야 합니다.');
assert(styles.includes('.fallback-task-list') && styles.includes('overflow-y: auto'), '40개 fallback Task를 스크롤할 수 있어야 합니다.');
const longPrompt = '긴 문장을 앞뒤 손실 없이 표시합니다. English text 👩‍💻 é '.repeat(30);
for (const width of [16, 40, 80, 160]) {
  const layout = layoutPrompt(longPrompt, width);
  assert(layout.lines.join('') === longPrompt && layout.widths.every((value) => value <= width), '긴 프롬프트를 폭에 맞춰 손실 없이 줄바꿈해야 합니다.');
  assert(layout.positions.at(-1).offset === longPrompt.length, '커서가 긴 문장 끝까지 도달해야 합니다.');
}
assert(cellWidth('한') === 2 && cellWidth('é') === 1 && cellWidth('👩‍💻') === 2, '한글·영문·이모지 셀 너비가 맞아야 합니다.');
assert(layoutPrompt('첫 줄\n둘째 줄\n', 40).lines.length === 3, '붙여넣은 줄바꿈을 보존해야 합니다.');
assert(finalSource.includes("finalUrl: 'https://ohayo.tail2dac17.ts.net/'"), '최종 OHAYO URL이 정확하지 않습니다.');

const timedFlowDuration = (buildStages.reduce((sum, stage) => sum + stage.duration, 0) + finalRun.taskGraphDuration + finalRun.tasks.length * finalRun.taskDuration + 8_000) / 7;
assert(timedFlowDuration < 250_000, '5분 테스트 모드는 수동 조작을 위한 최소 50초 여유를 확보해야 합니다.');

for (const command of ['pause', 'resume', 'next-event', 'next-task', 'complete-current', 'reset-run', 'reset-all', 'show-result', 'set-speed']) {
  assert(controls.includes(`type: '${command}'`), `Presenter command ${command}가 누락됐습니다.`);
}

assert(finalExperience.includes('QRCodeSVG') && finalExperience.includes('finalRun.finalUrl'), '결과 QR과 finalUrl 연결이 누락됐습니다.');
assert(finalExperience.includes("viewMode === 'cli'") && finalExperience.includes('cli-fallback-shell'), '실행용 CLI fallback이 누락됐습니다.');
assert(finalExperience.includes('BroadcastChannel') && finalExperience.includes('localStorage'), 'Presenter 통신 fallback이 누락됐습니다.');
assert(finalExperience.includes('if (!hydrated) return;'), '상태 복원 전 저장을 막는 hydration guard가 누락됐습니다.');
assert(presenter.includes('planningElapsed') && presenter.includes('finalRun.taskGraphDuration'), 'Presenter가 Task 구성 화면을 추적하지 않습니다.');

// Drive the real CLI orchestration with explicit input boundaries and a fast clock.
const events = [];
let request;
let reads = 0;
const originalLog = console.log;
console.log = () => {};
try {
  const run = runDemoCli({
    baseUrl: 'http://localhost:4321/',
    readInput: () => { reads += 1; return new Promise((resolve) => { request = resolve; }); },
    executeStage: async (stage) => { events.push(`stage:${stage.id}`); },
    openViewer: async (url) => { events.push(new URL(url)); },
  });
  const settle = () => new Promise((resolve) => setImmediate(resolve));
  await settle();
  assert(reads === 1 && events.length === 0, '첫 입력 전 단계가 실행되면 안 됩니다.');
  request('');
  await settle();
  assert(reads === 2 && events.length === 0, '빈 입력이 단계를 진행시키면 안 됩니다.');
  for (let step = 1; step <= 5; step += 1) {
    request(`STEP ${step} 프롬프트\n두 번째 줄`);
    await settle();
    assert(events.length === step * 2, '한 입력은 정확히 한 단계와 해당 Viewer만 열어야 합니다.');
    assert(events.at(-2) === `stage:${step}` && events.at(-1).pathname === `/harness/${step}`, '현재 단계와 Viewer가 다릅니다.');
    assert(events.at(-1).port === '4321' && !events.at(-1).searchParams.has('reset'), '단계 Viewer가 제품 상태를 초기화하면 안 됩니다.');
  }
  assert(reads === 7 && events.length === 10, 'STEP 5 뒤 별도의 여섯 번째 입력을 기다려야 합니다.');
  request('/harness');
  await run;
  const destination = events.at(-1);
  assert(events.length === 11 && destination.pathname === '/' && destination.searchParams.get('screen') === 'run' && destination.searchParams.get('reset') === '1', 'STEP 6은 추가 다이어그램 없이 새 Loom 제품 입력으로 이동해야 합니다.');
  assert(events.filter((event) => event instanceof URL).every((url) => url.searchParams.get('speed') === destination.searchParams.get('speed')), '단계별 Viewer와 제품 입력에 같은 실행 속도를 전달해야 합니다.');
} finally {
  console.log = originalLog;
}

console.log('Presentation flow validation [OK]');
console.log('- Mermaid + canonical prompts: 5 original snapshots match exactly');
console.log('- CLI: 5 separate stage inputs + 1 launch input; blank input holds');
console.log('- Viewer: /harness/1~5; STEP 6 opens Loom prompt directly');
console.log(`- Test mode: ${Math.round(timedFlowDuration / 1_000)}s timed flow`);
console.log('- Product Run: 40 tasks × 30s = 20min; 200s planning, scroll graph, Presenter + RESET + URL/QR');
console.log('- Terminal: long Korean/English/emoji input wraps without cropping');

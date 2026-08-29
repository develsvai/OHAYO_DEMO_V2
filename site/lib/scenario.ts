export type ScenarioLog = {
  at: number;
  type: 'thinking' | 'work' | 'success';
  text: string;
};

export type BuildStage = {
  id: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  version: string;
  canonicalPrompt: string;
  duration: number;
  logs: ScenarioLog[];
  resources: string[];
  mermaid: string;
};

const minute = 60_000;

// 발표 문구와 타이밍의 단일 수정 지점입니다.
// STEP 1~5의 canonicalPrompt는 writing-block.md를 따르며,
// STEP 3만 최종 회의 결정에 따라 Test Orchestrator를 제외합니다.
export const buildStages: BuildStage[] = [
  {
    id: 1,
    title: 'Harness Skeleton',
    shortTitle: 'Skeleton',
    subtitle: 'Global Architecture',
    eyebrow: '하네스의 골격 생성',
    description: '제품 개발 전체 생명주기의 상위 실행 구조와 주요 Orchestrator를 구성합니다.',
    version: 'v0.1',
    canonicalPrompt: `제품을 처음부터 끝까지 스스로 완성하는 자율 개발 하네스를 만들어줘.

입력으로는 제품 설명서, 실행 명령어, 데이터, API Key, 배포 정보 등을 제공할 예정이야.

우선 전체적인 실행 구조와 주요 오케스트레이터만 설계해줘.
세부 구현은 아직 하지 말고 상위 그래프만 생성해줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: 'thinking', text: '제품 라이프사이클 분석 중' },
      { at: 7_000, type: 'work', text: '입력 리소스와 실행 경계 확인' },
      { at: 15_000, type: 'success', text: '상위 실행 단계 정의' },
      { at: 25_000, type: 'success', text: '기획 Orchestrator 생성' },
      { at: 34_000, type: 'success', text: '리서치·개발·검증 Orchestrator 연결' },
      { at: 44_000, type: 'success', text: '실행 Graph 생성' },
      { at: 52_000, type: 'work', text: 'Global architecture snapshot 준비 중' },
      { at: 57_000, type: 'success', text: 'Harness Skeleton 반영 완료' },
    ],
    resources: ['Product specification', 'Data & API keys', 'Deployment context'],
    mermaid: `flowchart TD
INPUT["\uc81c\ud488 \uba85\uc138<br/>\ub370\uc774\ud130<br/>API Key<br/>\ubc30\ud3ec \uc815\ubcf4"]
PLAN["\uae30\ud68d Orchestrator"]
RESEARCH["\ub9ac\uc11c\uce58 Orchestrator"]
BUILD["\uac1c\ubc1c Orchestrator"]
VERIFY["\uac80\uc99d Orchestrator"]
DEPLOY["\ubc30\ud3ec Orchestrator"]
INPUT --> PLAN --> RESEARCH --> BUILD --> VERIFY --> DEPLOY`,
  },
  {
    id: 2,
    title: 'Auto Planning Graph',
    shortTitle: 'Planning',
    subtitle: 'Planning Subgraph',
    eyebrow: 'Planning Orchestrator 확장',
    description: '목표 설정부터 계획 평가까지, 목표를 만족할 때까지 계획 자체를 수정하는 Loop를 구성합니다.',
    version: 'v0.2',
    canonicalPrompt: `기획 오케스트레이터를 확장해줘.

단순히 계획을 만드는 것이 아니라

- 목표 설정
- 요구사항 분석
- 레퍼런스 수집
- 컨텍스트 구성
- 작업 분해
- 계획 평가

까지 스스로 수행하고,

목표가 만족될 때까지 반복해서 계획을 수정하는 Auto Planning Graph로 만들어줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: 'thinking', text: '현재 Planning Orchestrator 구조 분석 중' },
      { at: 8_000, type: 'work', text: 'Planning 책임과 반복 경계 매핑' },
      { at: 15_000, type: 'success', text: 'Goal Discovery 추가' },
      { at: 22_000, type: 'success', text: 'Requirement Analysis 생성' },
      { at: 29_000, type: 'success', text: 'Reference Collector 생성' },
      { at: 36_000, type: 'success', text: 'Context Builder 연결' },
      { at: 43_000, type: 'success', text: 'Plan Evaluator 생성' },
      { at: 50_000, type: 'success', text: 'Goal Loop 연결' },
      { at: 57_000, type: 'work', text: 'Planning Subgraph 최종 검증' },
    ],
    resources: ['Goal discovery', 'Reference context', 'Plan evaluation'],
    mermaid: `flowchart TD
HARNESS["Global Harness"] --> PLAN["Planning Orchestrator"]
PLAN --> GOAL
subgraph AP["Auto Planning · Current Subgraph"]
direction TD
GOAL["Goal Discovery"] --> REQ["Requirement Analysis"]
REQ --> REF["Reference Collection"]
REF --> CTX["Context Building"]
CTX --> TASK["Task Decomposition"]
TASK --> EVAL["Plan Evaluation"]
EVAL --> CHECK{"Goal Satisfied?"}
CHECK -- "NO" --> REQ
CHECK -- "YES" --> OUT["Approved Plan"]
end
OUT --> BUILD["Engineering Orchestrator"]`,
  },
  {
    id: 3,
    title: 'Engineering Runtime',
    shortTitle: 'Engineering',
    subtitle: 'Engineering Subgraph',
    eyebrow: '개발 Graph Runtime 확장',
    description: '개발을 전문 Orchestrator로 나누고 각 역할에 필요한 Skill·Context·Hook·Script를 연결합니다.',
    version: 'v0.3',
    canonicalPrompt: `개발 오케스트레이터를 그래프 기반 런타임으로 확장해줘.

프론트엔드, 백엔드, 디자인, 인프라를 각각 독립적인 오케스트레이터로 분리하고,

각 오케스트레이터는

- Skill
- Context
- Hook
- Script

를 사용할 수 있도록 설계해줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: 'thinking', text: 'Engineering 역할과 실행 자원 분해 중' },
      { at: 8_000, type: 'work', text: 'Graph Router 실행 경계 설계' },
      { at: 15_000, type: 'success', text: 'Frontend Orchestrator 생성' },
      { at: 22_000, type: 'success', text: 'Backend Orchestrator 생성' },
      { at: 29_000, type: 'success', text: 'Design Orchestrator 생성' },
      { at: 36_000, type: 'success', text: 'Infrastructure Orchestrator 생성' },
      { at: 43_000, type: 'success', text: 'Skill Hub·Context 연결' },
      { at: 50_000, type: 'success', text: 'Hook·Script 연결' },
      { at: 57_000, type: 'work', text: 'Engineering Subgraph 최종 검증' },
    ],
    resources: ['Skill hub', 'Context registry', 'Hooks & scripts'],
    mermaid: `flowchart TD
HARNESS["Global Harness"] --> ENGINE["Engineering Runtime"]
ENGINE --> ROUTER["Engineering Router"]
ROUTER --> FE["Frontend"]
ROUTER --> BE["Backend"]
ROUTER --> DESIGN["Design"]
ROUTER --> INFRA["Infrastructure"]
subgraph F["Frontend Orchestrator"]
FE --> FSKILL["Skill"]
FE --> FHOOK["Hook"]
FE --> FCTX["Context"]
end
subgraph B["Backend Orchestrator"]
BE --> BSKILL["Skill"]
BE --> BSCRIPT["Script"]
BE --> BCTX["Context"]
end
subgraph D["Design Orchestrator"]
DESIGN --> DSKILL["Skill"]
DESIGN --> DCTX["Context"]
end
subgraph I["Infrastructure Orchestrator"]
INFRA --> ISKILL["Skill"]
INFRA --> ICTX["Context"]
end`,
  },
  {
    id: 4,
    title: 'Runtime Intelligence',
    shortTitle: 'Intelligence',
    subtitle: 'Dynamic Runtime',
    eyebrow: '고정 Workflow에서 동적 Runtime으로',
    description: '실행 시점에 자원과 다음 Graph를 선택하고, 목표 달성까지 기록·평가·재시도하는 동적 Runtime을 구성합니다.',
    version: 'v0.4',
    canonicalPrompt: `이제 고정된 실행 순서를 제거해줘.

모든 오케스트레이터가 실행 중에

- 어떤 Skill을 사용할지
- 어떤 Context를 가져올지
- 어떤 Script를 실행할지
- 어느 Graph를 호출할지

스스로 판단하도록 만들어줘.

그리고

- Shared Memory
- Execution History
- Goal Evaluator
- Retry Loop
- Conditional Routing

을 추가해서 완전한 Graph Runtime으로 확장해줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: 'thinking', text: '고정 Flow의 실행 의존성 분석 중' },
      { at: 8_000, type: 'work', text: '동적 라우팅 규칙 설계' },
      { at: 15_000, type: 'success', text: 'Runtime Graph 생성' },
      { at: 22_000, type: 'success', text: 'Shared Memory 연결' },
      { at: 29_000, type: 'success', text: 'Execution History 연결' },
      { at: 36_000, type: 'success', text: 'Dynamic·Conditional Routing 생성' },
      { at: 43_000, type: 'success', text: 'Retry Policy 생성' },
      { at: 50_000, type: 'success', text: 'Goal Satisfaction Loop 생성' },
      { at: 57_000, type: 'work', text: 'Dynamic Runtime 최종 검증' },
    ],
    resources: ['Shared memory', 'Execution history', 'Runtime policies'],
    mermaid: `flowchart TD
FIXED["FIXED FLOW"] -->|"EVOLVE"| GRAPH["DYNAMIC RUNTIME"]
MEM["Shared Memory"] --> GRAPH
HISTORY["Execution History"] --> GRAPH
CTX["Context Manager"] --> GRAPH
GRAPH --> PLAN["Planning"]
GRAPH --> RESEARCH["Research"]
GRAPH --> ENGINEERING["Engineering"]
PLAN --> GOAL["Goal Evaluator"]
RESEARCH --> GOAL
ENGINEERING --> GOAL
GOAL --> CHECK{"Goal Satisfied?"}
CHECK -- "NO · RETRY" --> GRAPH
CHECK -- "YES" --> PACKAGE["Packaging"]`,
  },
  {
    id: 5,
    title: 'Production Harness',
    shortTitle: 'Production',
    subtitle: 'Autonomous Product Engineering Harness',
    eyebrow: '프로덕션 하네스 완성',
    description: '패키징부터 배포·모니터링·복구·관측까지 제품 완성 이후의 전체 운영 루프를 연결합니다.',
    version: 'v1.0',
    canonicalPrompt: `이 하네스를 실제 프로덕션 런타임 수준으로 완성해줘.

추가해야 하는 기능은

- Production Packaging
- Artifact Management
- Release Validation
- Deployment Automation
- Monitoring
- Recovery
- Observability

그리고 실행 명령 하나로

제품이 완성될 때까지 스스로 반복 실행되는
최종 Autonomous Product Engineering Harness를 만들어줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: 'thinking', text: '프로덕션 완성 조건과 운영 경계 분석 중' },
      { at: 8_000, type: 'work', text: 'Release Lifecycle 설계' },
      { at: 15_000, type: 'success', text: 'Packaging Graph 생성' },
      { at: 22_000, type: 'success', text: 'Artifact Management 연결' },
      { at: 29_000, type: 'success', text: 'Release Validation 추가' },
      { at: 36_000, type: 'success', text: 'Deployment Graph 생성' },
      { at: 43_000, type: 'success', text: 'Monitoring·Observability 추가' },
      { at: 50_000, type: 'success', text: 'Recovery Workflow 생성' },
      { at: 57_000, type: 'success', text: 'Autonomous Harness 완성' },
    ],
    resources: ['Release artifacts', 'Deployment automation', 'Operations telemetry'],
    mermaid: `flowchart TD
INPUT["Product Spec"] --> GRAPH["Global Runtime Graph"]
MEM["Global Memory"] --> GRAPH
CTX["Context Hub"] --> GRAPH
HISTORY["Execution History"] --> GRAPH
GRAPH --> PLAN["Auto Planning"]
GRAPH --> RESEARCH["Research"]
GRAPH --> ENGINEERING["Engineering"]
PLAN --> QA["Validation"]
RESEARCH --> QA
ENGINEERING --> QA
QA --> CHECK{"Goal Satisfied?"}
CHECK -- "NO" --> GRAPH
CHECK -- "YES" --> PACKAGE["Production Packaging"]
PACKAGE --> ARTIFACT["Artifact Management"]
ARTIFACT --> RELEASE["Release Validation"]
RELEASE --> DEPLOY["Deployment Automation"]
DEPLOY --> MONITOR["Monitoring"]
MONITOR --> OBSERVE["Observability"]
OBSERVE --> HEALTH{"Healthy?"}
HEALTH -- "NO" --> RECOVERY["Recovery"]
RECOVERY --> GRAPH
HEALTH -- "YES" --> READY["Production Ready"]`,
  },
];

export const scenarioMeta = {
  product: 'Autonomous Product Engineering Harness',
  mode: 'BUILD MODE',
};

export const buildStageNames = buildStages.map((stage) => stage.shortTitle);

export type ProductTaskState =
  | 'running'
  | 'context'
  | 'implementing'
  | 'validating'
  | 'failed'
  | 'repairing'
  | 'retrying'
  | 'done';

export type ProductTaskEvent = {
  at: number;
  state: ProductTaskState;
  label: string;
  detail: string;
};

export type ProductTask = {
  id: number;
  title: string;
  owner: string;
  goal: string;
  events: ProductTaskEvent[];
};

const standardEvents = (context: string, implementation: string, validation: string): ProductTaskEvent[] => [
  { at: 0, state: 'running', label: 'RUNNING', detail: 'Task execution started' },
  { at: 8_000, state: 'context', label: 'CONTEXT LOADED', detail: context },
  { at: 32_000, state: 'implementing', label: 'IMPLEMENTING', detail: implementation },
  { at: 92_000, state: 'validating', label: 'VALIDATING', detail: validation },
  { at: 120_000, state: 'done', label: 'DONE', detail: 'Goal satisfied' },
];

const retryEvents = (context: string, implementation: string, validation: string, repair: string): ProductTaskEvent[] => [
  { at: 0, state: 'running', label: 'RUNNING', detail: 'Task execution started' },
  { at: 8_000, state: 'context', label: 'CONTEXT LOADED', detail: context },
  { at: 30_000, state: 'implementing', label: 'IMPLEMENTING', detail: implementation },
  { at: 78_000, state: 'validating', label: 'VALIDATING', detail: validation },
  { at: 91_000, state: 'failed', label: 'VALIDATION FAILED', detail: 'One acceptance condition is not satisfied' },
  { at: 97_000, state: 'repairing', label: 'REPAIRING', detail: repair },
  { at: 108_000, state: 'retrying', label: 'RETRY', detail: 'Re-running the validation loop' },
  { at: 114_000, state: 'validating', label: 'VALIDATING', detail: 'Acceptance conditions re-evaluated' },
  { at: 120_000, state: 'done', label: 'DONE', detail: 'Goal satisfied after repair' },
];

export const finalRun = {
  canonicalPrompt: `지정된 폴더의 명세와 Context를 사용해서
OHAYO를 처음부터 끝까지 완성하고
배포까지 진행해줘.`,
  taskDuration: 120_000,
  finalUrl: 'https://ohayo.flogi.app',
  tasks: [
    {
      id: 1,
      title: 'Product Scope & Architecture',
      owner: 'Planning',
      goal: '제품 명세를 실행 가능한 구조와 acceptance criteria로 변환',
      events: standardEvents('Product spec · stakeholder notes · constraints', 'Defining product architecture and execution boundaries', 'Reviewing scope and dependency graph'),
    },
    {
      id: 2,
      title: 'Design System & App Shell',
      owner: 'Design',
      goal: '일관된 UI 토큰과 핵심 화면 구조 구성',
      events: standardEvents('Brand references · UI principles · target devices', 'Building the visual system and responsive app shell', 'Checking layout consistency and accessibility'),
    },
    {
      id: 3,
      title: 'Authentication & Profile',
      owner: 'Backend',
      goal: '사용자 인증과 프로필 데이터 흐름 구현',
      events: standardEvents('Identity contract · profile schema · security rules', 'Implementing session and profile workflows', 'Validating access boundaries and data integrity'),
    },
    {
      id: 4,
      title: 'Lunch Preference Onboarding',
      owner: 'Frontend',
      goal: '점심 취향과 제약을 수집하는 온보딩 경험 구현',
      events: standardEvents('Preference taxonomy · UX copy · validation rules', 'Building preference collection and state transitions', 'Testing form states and edge cases'),
    },
    {
      id: 5,
      title: 'Lunch Matching Engine',
      owner: 'Engineering',
      goal: '그룹 조건을 반영한 점심 매칭 로직 구현',
      events: retryEvents('Matching rules · preference vectors · sample groups', 'Implementing the matching and ranking pipeline', 'Evaluating match quality against fixtures', 'Adjusting score weights and conflict resolution'),
    },
    {
      id: 6,
      title: 'Restaurant Discovery',
      owner: 'Research',
      goal: '후보 식당 데이터와 추천 결과 연결',
      events: standardEvents('Restaurant dataset · location constraints · filters', 'Connecting ranked places to the discovery surface', 'Verifying filters, empty states and result quality'),
    },
    {
      id: 7,
      title: 'Group Coordination',
      owner: 'Engineering',
      goal: '초대·투표·최종 선택의 그룹 협업 흐름 구현',
      events: standardEvents('Group lifecycle · invitation rules · voting policy', 'Building room coordination and synchronized decisions', 'Validating multi-user state transitions'),
    },
    {
      id: 8,
      title: 'Notifications & Reminders',
      owner: 'Infrastructure',
      goal: '선택 완료와 약속 리마인더 흐름 구성',
      events: standardEvents('Notification matrix · timing rules · opt-out policy', 'Configuring event-driven reminders and delivery states', 'Checking timing, fallbacks and user preferences'),
    },
    {
      id: 9,
      title: 'End-to-End Validation',
      owner: 'Validation',
      goal: '핵심 사용자 여정과 실패 복구 시나리오 검증',
      events: retryEvents('Acceptance suite · device matrix · failure scenarios', 'Executing end-to-end product journeys', 'Running the release acceptance suite', 'Repairing a mobile coordination state regression'),
    },
    {
      id: 10,
      title: 'Production Release',
      owner: 'Deployment',
      goal: '패키징·배포·Health Check·Monitoring 완료',
      events: standardEvents('Release manifest · deploy target · health policy', 'Packaging artifacts and deploying the release', 'Running health checks and monitoring handoff'),
    },
  ] satisfies ProductTask[],
  completionChecks: ['Validation', 'Packaging', 'Deployment', 'Health Check', 'Monitoring'],
};

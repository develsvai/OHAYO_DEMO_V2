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

// 정본: docs/harness-demo/source.md의 STEP 1~5.
// Mermaid 원문은 docs/harness-demo/step-1.mmd~step-5.mmd와 동일하게 유지합니다.
export const buildStages: BuildStage[] = [
  {
    id: 1,
    title: "Harness Skeleton",
    shortTitle: "Skeleton",
    subtitle: "Global Architecture",
    eyebrow: "하네스의 골격 생성",
    description: "제품 입력, 목표와 저장소, 오케스트레이터 및 하위 에이전트의 골격을 구성합니다.",
    version: "v0.1",
    canonicalPrompt: `제품을 처음부터 끝까지 스스로 완성하는 자율 개발 하네스를 만들고 싶어.

입력으로는 제품 설명서와 함께 에셋, 데이터, 인증정보, 배포 설정이 담긴 폴더를 제공할 예정이야.

이번 1단계에서는 실제 개발이나 배포 로직을 구현하지 말고,
하네스가 자율 실행을 시작할 수 있는 상위 런타임 골격만 설계해줘.

반드시 포함할 구조는 다음과 같아.

- 제품 설명서를 읽는 입력 분석 에이전트
- 제품의 성공 조건을 정리하는 목표 정의
- 에셋, 데이터, 인증정보, 배포 설정을 등록하는 리소스 저장소
- 전체 실행을 조율하는 오케스트레이터 에이전트
- 실행 상태와 체크포인트를 기록하는 상태 저장소
- 이후 확장될 기획, 리서치, 개발, 검증, 배포 에이전트들
- 하네스 실행은 슬래시 명령어로 /harness로 할 수 있게 해줘

오케스트레이터 에이전트가 중심이 되어 하위 에이전트들을 조율하는 구조로 만들어줘.

각 하위 에이전트는 작업 결과를 오케스트레이터에게 보고할 수 있어야 해.
다만 이번 단계에서는 정책 게이트, 스킬, 훅, 스크립트, 반복 실행 조건은 만들지 말고,
나중에 확장 가능한 빈 슬롯으로만 남겨줘.

이 하네스는 OHAYO 라는 이름의 프로젝트 폴더를 만들고 그 안에 담아줘
하네스 생성이 끝나면 미리 만들어둔 Harness Viewer에서 확인할 수 있도록 링크 줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: "thinking", text: "제품 입력과 자율 실행 경계 분석 중" },
      { at: 8_000, type: "success", text: "입력 분석 에이전트 생성" },
      { at: 15_000, type: "success", text: "목표 정의와 리소스 저장소 연결" },
      { at: 23_000, type: "success", text: "오케스트레이터 에이전트 생성" },
      { at: 32_000, type: "success", text: "상태 저장소와 체크포인트 슬롯 연결" },
      { at: 42_000, type: "success", text: "기획·리서치·개발·검증·배포 에이전트 연결" },
      { at: 51_000, type: "work", text: "상위 런타임 골격 확인" },
      { at: 57_000, type: "success", text: "Harness Skeleton 반영 완료" },
    ],
    resources: ["제품 설명서", "리소스 저장소", "상태 저장소"],
    mermaid: `flowchart TD
    INPUT["제품 설명서<br/>(에셋 · 데이터 · 인증 · 배포)"]
    INTAKE{{"입력 분석<br/>에이전트"}}
    CONTRACT["목표 정의"]
    RESOURCE[("리소스 저장소")]
    STATE[("상태 저장소")]

    ORCH{{"오케스트레이터<br/>에이전트"}}

    PLAN{{"기획<br/>에이전트"}}
    RESEARCH{{"리서치<br/>에이전트"}}
    DEV{{"개발<br/>에이전트"}}
    QA{{"검증<br/>에이전트"}}
    DEPLOY{{"배포<br/>에이전트"}}

    INPUT --> INTAKE
    INTAKE --> CONTRACT
    INTAKE --> RESOURCE

    CONTRACT --> ORCH
    RESOURCE --> ORCH
    ORCH <--> STATE

    ORCH <--> PLAN

    ORCH <--> RESEARCH

    ORCH <--> DEV

    ORCH <--> QA

    ORCH <--> DEPLOY

    classDef agent fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#0F172A;
    classDef store fill:#F0FDF4,stroke:#16A34A,stroke-width:2px,color:#0F172A;
    classDef normal fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A;

    class INTAKE,ORCH,PLAN,RESEARCH,DEV,QA,DEPLOY agent;
    class RESOURCE,STATE store;
    class INPUT,CONTRACT normal;
`,
  },
  {
    id: 2,
    title: "Auto Planning Graph",
    shortTitle: "Planning",
    subtitle: "Planning Loop",
    eyebrow: "Auto Planning Graph 생성",
    description: "목표에서 실행 계획까지 기획을 구체화하고 충분할 때까지 보완하는 루프를 구성합니다.",
    version: "v0.2",
    canonicalPrompt: `이번에는 기획 에이전트를 오토 플랜 모드로 업그레이드해줘.

제품 설명서를 읽고 한 번에 계획을 끝내는 게 아니라,
스스로 목표를 정리하고 계획이 충분한지 검토하면서 보완하는 구조였으면 해.

기획 에이전트 안에는 다음 흐름이 들어가면 좋겠어.

- 목표 정리
- 요구사항 분석
- 범위 설정
- 리스크 점검
- 작업 분해
- 실행 계획 작성
- 계획이 충분한지 판단하는 루프

계획이 부족하면 스스로 다시 요구사항 분석으로 돌아가서 보완하고,
충분하면 오케스트레이터 에이전트에게 보고하도록 만들어줘.

완료되면 Harness Viewer 링크를 보여줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: "thinking", text: "기획 에이전트의 목표와 역할 분석 중" },
      { at: 8_000, type: "success", text: "요구사항 분석 연결" },
      { at: 15_000, type: "success", text: "범위 설정과 리스크 점검 구성" },
      { at: 23_000, type: "success", text: "작업 분해와 실행 계획 연결" },
      { at: 32_000, type: "success", text: "계획 충분성 판단 추가" },
      { at: 42_000, type: "success", text: "보완 경로를 요구사항 분석으로 연결" },
      { at: 51_000, type: "work", text: "계획 완료 보고를 오케스트레이터에 연결" },
      { at: 57_000, type: "success", text: "Auto Planning Graph 반영 완료" },
    ],
    resources: ["요구사항과 범위", "리스크와 작업 분해", "계획 평가"],
    mermaid: `flowchart TD
    INPUT["제품 설명서<br/>(에셋 · 데이터 · 인증 · 배포)"]
    INTAKE{{"입력 분석<br/>에이전트"}}
    GOAL["목표 정의"]
    RESOURCE[("리소스 저장소")]

    ORCH{{"오케스트레이터<br/>에이전트"}}
    STATE[("상태 저장소")]

    INPUT --> INTAKE
    INTAKE --> GOAL
    INTAKE --> RESOURCE

    GOAL --> ORCH
    RESOURCE --> ORCH
    ORCH <--> STATE

    subgraph PLAN_LOOP["오토 플랜 루프"]
        PLAN{{"기획<br/>에이전트"}}
        REQ["요구사항 분석"]
        SCOPE["범위 설정"]
        RISK["리스크 점검"]
        TASK["작업 분해"]
        PLAN_DOC["실행 계획"]
        PLAN_CHECK{"계획 충분?"}

        PLAN --> REQ
        REQ --> SCOPE
        SCOPE --> RISK
        RISK --> TASK
        TASK --> PLAN_DOC
        PLAN_DOC --> PLAN_CHECK
        PLAN_CHECK -- "보완" --> REQ
    end

    RESEARCH{{"리서치<br/>에이전트"}}
    DEV{{"개발<br/>에이전트"}}
    QA{{"검증<br/>에이전트"}}
    DEPLOY{{"배포<br/>에이전트"}}

    ORCH --> PLAN
    PLAN_CHECK -- "충분" --> ORCH

    ORCH <--> RESEARCH
    ORCH <--> DEV
    ORCH <--> QA
    ORCH <--> DEPLOY

    classDef agent fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#0F172A;
    classDef store fill:#F0FDF4,stroke:#16A34A,stroke-width:2px,color:#0F172A;
    classDef gate fill:#FEF2F2,stroke:#DC2626,stroke-width:2px,color:#0F172A;
    classDef normal fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A;

    class INTAKE,ORCH,PLAN,RESEARCH,DEV,QA,DEPLOY agent;
    class RESOURCE,STATE store;
    class PLAN_CHECK gate;
    class INPUT,GOAL,REQ,SCOPE,RISK,TASK,PLAN_DOC normal;
`,
  },
  {
    id: 3,
    title: "Production Agent Cluster",
    shortTitle: "Build",
    subtitle: "Build Loop",
    eyebrow: "제작 에이전트 클러스터 생성",
    description: "개발·검증·리서치가 구현과 정보를 보완하며 결과를 완성하는 제작 루프를 구성합니다.",
    version: "v0.3",
    canonicalPrompt: `이번에는 리서치, 개발, 검증 에이전트들을 묶어서 제작 루프를 만들어줘.

오케스트레이터 에이전트가 제작 컨텍스트를 개발 에이전트에게 주면,
검증 에이전트가 검증한 뒤, 개발 결과가 부족하면 다시 개발 에이전트가 보완하고,
정보가 부족하면 리서치 에이전트가 필요한 근거를 찾아 보강하게 해줘.

충분하다고 판단되면 오케스트레이터 에이전트에게 보고하도록 만들어줘.

완료되면 Harness Viewer 링크를 보여줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: "thinking", text: "제작 컨텍스트와 결과 조건 분석 중" },
      { at: 8_000, type: "success", text: "제작 컨텍스트를 개발 에이전트에 연결" },
      { at: 15_000, type: "success", text: "개발 결과의 검증 경로 생성" },
      { at: 23_000, type: "success", text: "제작 충분성 판단 추가" },
      { at: 32_000, type: "success", text: "구현 보완 경로를 개발 에이전트에 연결" },
      { at: 42_000, type: "success", text: "정보 보완 경로를 리서치 에이전트에 연결" },
      { at: 51_000, type: "work", text: "제작 완료 보고를 오케스트레이터에 연결" },
      { at: 57_000, type: "success", text: "제작 에이전트 클러스터 반영 완료" },
    ],
    resources: ["제작 컨텍스트", "개발·검증·리서치", "구현·정보 보완"],
    mermaid: `flowchart TD
    INPUT["제품 설명서<br/>(에셋 · 데이터 · 인증 · 배포)"]
    INTAKE{{"입력 분석<br/>에이전트"}}
    GOAL["목표 정의"]
    RESOURCE[("리소스 저장소")]

    ORCH{{"오케스트레이터<br/>에이전트"}}
    STATE[("상태 저장소")]

    INPUT --> INTAKE
    INTAKE --> GOAL
    INTAKE --> RESOURCE

    GOAL --> ORCH
    RESOURCE --> ORCH
    ORCH <--> STATE

    subgraph PLAN_LOOP["오토 플랜 루프"]
        PLAN{{"기획<br/>에이전트"}}
        REQ["요구사항 분석"]
        SCOPE["범위 설정"]
        RISK["리스크 점검"]
        TASK["작업 분해"]
        PLAN_DOC["실행 계획"]
        PLAN_CHECK{"계획 충분?"}

        PLAN --> REQ
        REQ --> SCOPE
        SCOPE --> RISK
        RISK --> TASK
        TASK --> PLAN_DOC
        PLAN_DOC --> PLAN_CHECK
        PLAN_CHECK -- "보완" --> REQ
    end

    subgraph BUILD_LOOP["제작 루프"]
        WORK_CTX["제작 컨텍스트"]
        DEV{{"개발<br/>에이전트"}}
        QA{{"검증<br/>에이전트"}}
        BUILD_CHECK{"제작 충분?"}
        RESEARCH{{"리서치<br/>에이전트"}}

        WORK_CTX --> DEV
        DEV --> QA
        QA --> BUILD_CHECK

        BUILD_CHECK -- "구현 보완" --> DEV
        BUILD_CHECK -- "정보 보완" --> RESEARCH
        RESEARCH --> DEV
    end

    DEPLOY{{"배포<br/>에이전트"}}

    ORCH --> PLAN
    PLAN_CHECK -- "충분" --> ORCH

    ORCH --> WORK_CTX
    BUILD_CHECK -- "충분" --> ORCH

    ORCH <--> DEPLOY

    classDef agent fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#0F172A;
    classDef store fill:#F0FDF4,stroke:#16A34A,stroke-width:2px,color:#0F172A;
    classDef gate fill:#FEF2F2,stroke:#DC2626,stroke-width:2px,color:#0F172A;
    classDef normal fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A;

    class INTAKE,ORCH,PLAN,DEV,QA,RESEARCH,DEPLOY agent;
    class STATE,RESOURCE store;
    class PLAN_CHECK,BUILD_CHECK gate;
    class INPUT,GOAL,REQ,SCOPE,RISK,TASK,PLAN_DOC,WORK_CTX normal;
`,
  },
  {
    id: 4,
    title: "Deployment Agent",
    shortTitle: "Deployment",
    subtitle: "Deployment Loop",
    eyebrow: "배포 에이전트 생성",
    description: "패키징부터 배포 결과 확인까지 연결하고 실패 시 재시도하는 배포 루프를 구성합니다.",
    version: "v0.4",
    canonicalPrompt: `이번에는 배포 에이전트를 실제 배포까지 수행하는 구조로 업그레이드해줘.

검증이 끝난 결과를 바탕으로,
오케스트레이터 에이전트가 배포 컨텍스트를 만들고 배포 에이전트에게 전달하게 해줘.

배포 에이전트는 패키징, 배포 설정 확인, 배포 실행, 배포 결과 확인까지 처리하게 해줘.

배포에 실패하면 배포 에이전트가 다시 보완해서 재시도하고,
성공하면 오케스트레이터 에이전트에게 보고하도록 만들어줘.

이번 단계에서는 아직 정책 게이트, 훅, 스크립트, 모니터링은 넣지 말고,
배포 에이전트가 배포 흐름을 책임지는 구조까지만 보여줘.

완료되면 Harness Viewer 링크를 보여줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: "thinking", text: "검증 결과와 배포 컨텍스트 분석 중" },
      { at: 8_000, type: "success", text: "배포 컨텍스트와 배포 에이전트 연결" },
      { at: 15_000, type: "success", text: "패키징 경로 생성" },
      { at: 23_000, type: "success", text: "배포 설정 확인과 배포 실행 연결" },
      { at: 32_000, type: "success", text: "배포 결과 확인과 성공 판단 추가" },
      { at: 42_000, type: "success", text: "실패 시 배포 에이전트 재시도 연결" },
      { at: 51_000, type: "work", text: "성공 시 오케스트레이터 보고 연결" },
      { at: 57_000, type: "success", text: "배포 에이전트 반영 완료" },
    ],
    resources: ["배포 컨텍스트", "패키징과 배포 설정", "배포 결과와 재시도"],
    mermaid: `flowchart TD
    INPUT["제품 설명서<br/>(에셋 · 데이터 · 인증 · 배포)"]
    INTAKE{{"입력 분석<br/>에이전트"}}
    GOAL["목표 정의"]
    RESOURCE[("리소스 저장소")]

    ORCH{{"오케스트레이터<br/>에이전트"}}
    STATE[("상태 저장소")]

    INPUT --> INTAKE
    INTAKE --> GOAL
    INTAKE --> RESOURCE

    GOAL --> ORCH
    RESOURCE --> ORCH
    ORCH <--> STATE

    subgraph PLAN_LOOP["오토 플랜 루프"]
        PLAN{{"기획<br/>에이전트"}}
        REQ["요구사항 분석"]
        SCOPE["범위 설정"]
        RISK["리스크 점검"]
        TASK["작업 분해"]
        PLAN_DOC["실행 계획"]
        PLAN_CHECK{"계획 충분?"}

        PLAN --> REQ
        REQ --> SCOPE
        SCOPE --> RISK
        RISK --> TASK
        TASK --> PLAN_DOC
        PLAN_DOC --> PLAN_CHECK
        PLAN_CHECK -- "보완" --> REQ
    end

    subgraph BUILD_LOOP["제작 루프"]
        WORK_CTX["제작 컨텍스트"]
        DEV{{"개발<br/>에이전트"}}
        QA{{"검증<br/>에이전트"}}
        RESEARCH{{"리서치<br/>에이전트"}}
        BUILD_CHECK{"제작 충분?"}

        WORK_CTX --> DEV
        DEV --> QA
        QA --> BUILD_CHECK
        BUILD_CHECK -- "구현 보완" --> DEV
        BUILD_CHECK -- "정보 보완" --> RESEARCH
        RESEARCH --> DEV
    end

    subgraph DEPLOY_LOOP["배포 루프"]
        DEPLOY_CTX["배포 컨텍스트"]
        DEPLOY{{"배포<br/>에이전트"}}
        PACKAGE["패키징"]
        CONFIG["배포 설정 확인"]
        RELEASE["배포 실행"]
        HEALTH["배포 결과 확인"]
        DEPLOY_CHECK{"배포 성공?"}

        DEPLOY_CTX --> DEPLOY
        DEPLOY --> PACKAGE
        PACKAGE --> CONFIG
        CONFIG --> RELEASE
        RELEASE --> HEALTH
        HEALTH --> DEPLOY_CHECK
        DEPLOY_CHECK -- "실패" --> DEPLOY
    end

    ORCH --> PLAN
    PLAN_CHECK -- "충분" --> ORCH

    ORCH --> WORK_CTX
    BUILD_CHECK -- "충분" --> ORCH

    ORCH --> DEPLOY_CTX
    DEPLOY_CHECK -- "성공" --> ORCH

    classDef agent fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#0F172A;
    classDef store fill:#F0FDF4,stroke:#16A34A,stroke-width:2px,color:#0F172A;
    classDef gate fill:#FEF2F2,stroke:#DC2626,stroke-width:2px,color:#0F172A;
    classDef normal fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A;

    class INTAKE,ORCH,PLAN,DEV,QA,RESEARCH,DEPLOY agent;
    class RESOURCE,STATE store;
    class PLAN_CHECK,BUILD_CHECK,DEPLOY_CHECK gate;
    class INPUT,GOAL,REQ,SCOPE,RISK,TASK,PLAN_DOC,WORK_CTX,DEPLOY_CTX,PACKAGE,CONFIG,RELEASE,HEALTH normal;
`,
  },
  {
    id: 5,
    title: "Production Harness",
    shortTitle: "Production",
    subtitle: "Runtime Policies & Hooks",
    eyebrow: "프로덕션 하네스 완성",
    description: "기획·제작·배포 루프에 정책 게이트, 훅, 보완 스크립트와 실행 기록을 연결합니다.",
    version: "v1.0",
    canonicalPrompt: `지금까지 만든 하네스 구조는 유지한 채,
각 연결선을 실제 실행 규칙이 있는 런타임 엣지로 바꿔줘.

오케스트레이터가 기획, 제작, 배포 루프를 실행할 때는
바로 실행하지 말고 각 루프 앞의 정책 게이트를 먼저 통과하게 해줘.

대부분의 연결선은 훅으로 강제 실행되게 만들고,
판단이 필요한 지점에는 정책 게이트를 붙여줘.

보완이나 재시도가 필요한 경우에는
어떤 스크립트가 실행되는지도 엣지에 표시해줘.

상태 저장소에는 체크포인트와 실행 로그가 기록되고,
리소스 저장소에서는 필요한 컨텍스트를 불러오는 구조로 만들어줘.

완료되면 Harness Viewer 링크를 보여줘.`,
    duration: minute,
    logs: [
      { at: 2_000, type: "thinking", text: "기획·제작·배포의 실행 규칙 분석 중" },
      { at: 8_000, type: "success", text: "각 루프 앞의 정책 게이트 생성" },
      { at: 15_000, type: "success", text: "입력 분석과 컨텍스트 로드 훅 연결" },
      { at: 23_000, type: "success", text: "기획·제작 루프의 실행 훅 연결" },
      { at: 32_000, type: "success", text: "배포 루프의 실행 훅 연결" },
      { at: 42_000, type: "success", text: "replan·patch·research·redeploy 스크립트 연결" },
      { at: 51_000, type: "work", text: "체크포인트와 실행 로그 기록 연결" },
      { at: 57_000, type: "success", text: "Production Harness 반영 완료" },
    ],
    resources: ["정책 게이트", "실행 훅과 스크립트", "체크포인트와 실행 로그"],
    mermaid: `flowchart TD
    INPUT["제품 설명서<br/>(에셋 · 데이터 · 인증 · 배포)"]
    INTAKE{{"입력 분석<br/>에이전트"}}
    GOAL["목표 정의"]
    RESOURCE[("리소스 저장소")]

    ORCH{{"오케스트레이터<br/>에이전트"}}
    STATE[("상태 저장소")]

    INPUT -- "훅: intake.start" --> INTAKE
    INTAKE -- "훅: goal.extract" --> GOAL
    INTAKE -- "훅: resource.register" --> RESOURCE

    GOAL -- "훅: goal.ready" --> ORCH
    RESOURCE -- "훅: context.load" --> ORCH
    ORCH <-->|"체크포인트 · 실행 로그"| STATE

    subgraph PLAN_LOOP["오토 플랜 루프"]
        PLAN{{"기획<br/>에이전트"}}
        REQ["요구사항 분석"]
        SCOPE["범위 설정"]
        RISK["리스크 점검"]
        TASK["작업 분해"]
        PLAN_DOC["실행 계획"]
        PLAN_CHECK{"계획 충분?"}

        PLAN -- "훅: requirements.analyze" --> REQ
        REQ -- "훅: scope.define" --> SCOPE
        SCOPE -- "훅: risk.scan" --> RISK
        RISK -- "훅: tasks.breakdown" --> TASK
        TASK -- "훅: plan.write" --> PLAN_DOC
        PLAN_DOC -- "훅: plan.review" --> PLAN_CHECK
        PLAN_CHECK -- "정책: 보완 필요<br/>스크립트: replan" --> REQ
    end

    subgraph BUILD_LOOP["제작 루프"]
        WORK_CTX["제작 컨텍스트"]
        DEV{{"개발<br/>에이전트"}}
        QA{{"검증<br/>에이전트"}}
        RESEARCH{{"리서치<br/>에이전트"}}
        BUILD_CHECK{"제작 충분?"}

        WORK_CTX -- "훅: dev.start" --> DEV
        DEV -- "훅: qa.run" --> QA
        QA -- "훅: build.review" --> BUILD_CHECK
        BUILD_CHECK -- "정책: 구현 부족<br/>스크립트: patch" --> DEV
        BUILD_CHECK -- "정책: 정보 부족<br/>스크립트: research" --> RESEARCH
        RESEARCH -- "훅: context.patch" --> DEV
    end

    subgraph DEPLOY_LOOP["배포 루프"]
        DEPLOY_CTX["배포 컨텍스트"]
        DEPLOY{{"배포<br/>에이전트"}}
        PACKAGE["패키징"]
        CONFIG["배포 설정 확인"]
        RELEASE["배포 실행"]
        HEALTH["배포 결과 확인"]
        DEPLOY_CHECK{"배포 성공?"}

        DEPLOY_CTX -- "훅: deploy.start" --> DEPLOY
        DEPLOY -- "훅: package.build" --> PACKAGE
        PACKAGE -- "훅: config.verify" --> CONFIG
        CONFIG -- "훅: release.execute" --> RELEASE
        RELEASE -- "훅: health.check" --> HEALTH
        HEALTH -- "훅: deploy.review" --> DEPLOY_CHECK
        DEPLOY_CHECK -- "정책: 실패<br/>스크립트: redeploy" --> DEPLOY
    end

    PLAN_GATE{"기획 실행<br/>허용?"}
    BUILD_GATE{"제작 실행<br/>허용?"}
    DEPLOY_GATE{"배포 실행<br/>허용?"}

    ORCH -- "훅: plan.request" --> PLAN_GATE
    PLAN_GATE -- "정책 승인<br/>훅: plan.start" --> PLAN
    PLAN_CHECK -- "정책: plan.ready" --> ORCH

    ORCH -- "훅: build.request" --> BUILD_GATE
    BUILD_GATE -- "정책 승인<br/>훅: build.start" --> WORK_CTX
    BUILD_CHECK -- "정책: build.ready" --> ORCH

    ORCH -- "훅: deploy.request" --> DEPLOY_GATE
    DEPLOY_GATE -- "정책 승인<br/>훅: deploy.start" --> DEPLOY_CTX
    DEPLOY_CHECK -- "정책: deploy.success" --> ORCH

    classDef agent fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#0F172A;
    classDef store fill:#F0FDF4,stroke:#16A34A,stroke-width:2px,color:#0F172A;
    classDef gate fill:#FEF2F2,stroke:#DC2626,stroke-width:2px,color:#0F172A;
    classDef normal fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A;

    class INTAKE,ORCH,PLAN,DEV,QA,RESEARCH,DEPLOY agent;
    class RESOURCE,STATE store;
    class PLAN_CHECK,BUILD_CHECK,DEPLOY_CHECK,PLAN_GATE,BUILD_GATE,DEPLOY_GATE gate;
    class INPUT,GOAL,REQ,SCOPE,RISK,TASK,PLAN_DOC,WORK_CTX,DEPLOY_CTX,PACKAGE,CONFIG,RELEASE,HEALTH normal;
`,
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
  group: string;
  dependsOn: number[];
  events: ProductTaskEvent[];
};

const standardEvents = (context: string, implementation: string, validation: string): ProductTaskEvent[] => [
  { at: 0, state: 'running', label: '실행 중', detail: 'Task 실행을 시작했습니다.' },
  { at: 2_000, state: 'context', label: 'Context 로드', detail: context },
  { at: 8_000, state: 'implementing', label: '구현 중', detail: implementation },
  { at: 23_000, state: 'validating', label: '검증 중', detail: validation },
  { at: 30_000, state: 'done', label: '완료', detail: '목표 조건을 만족했습니다.' },
];

const retryEvents = (context: string, implementation: string, validation: string, repair: string): ProductTaskEvent[] => [
  { at: 0, state: 'running', label: '실행 중', detail: 'Task 실행을 시작했습니다.' },
  { at: 2_000, state: 'context', label: 'Context 로드', detail: context },
  { at: 7_500, state: 'implementing', label: '구현 중', detail: implementation },
  { at: 19_500, state: 'validating', label: '검증 중', detail: validation },
  { at: 22_750, state: 'failed', label: '검증 실패', detail: 'Acceptance condition 한 개를 만족하지 못했습니다.' },
  { at: 24_250, state: 'repairing', label: '복구 중', detail: repair },
  { at: 27_000, state: 'retrying', label: '재시도', detail: 'Validation Loop를 다시 실행합니다.' },
  { at: 28_500, state: 'validating', label: '재검증 중', detail: 'Acceptance condition을 다시 평가합니다.' },
  { at: 30_000, state: 'done', label: '완료', detail: '복구 후 목표 조건을 만족했습니다.' },
];

const productTaskGroups = [
  {
    "title": "Product Planning",
    "tasks": [
      [
        "Product Brief",
        "Planning",
        "제품 목표와 제약 조건 정리"
      ],
      [
        "User Journeys",
        "Planning",
        "점심 모임의 핵심 사용자 여정 정의"
      ],
      [
        "System Architecture",
        "Engineering",
        "서비스 경계와 데이터 흐름 설계"
      ],
      [
        "Acceptance Plan",
        "Validation",
        "기능별 완료 조건과 검증 계획 구성"
      ]
    ]
  },
  {
    "title": "Design & App Shell",
    "tasks": [
      [
        "Design Tokens",
        "Design",
        "색상·서체·간격의 공통 토큰 구성"
      ],
      [
        "App Navigation",
        "Design",
        "주요 화면과 탐색 경로 설계"
      ],
      [
        "Core Components",
        "Frontend",
        "입력·카드·피드백 컴포넌트 구현"
      ],
      [
        "Responsive Shell",
        "Frontend",
        "기기별 반응형 앱 화면 구성"
      ]
    ]
  },
  {
    "title": "Identity & Profile",
    "tasks": [
      [
        "User Schema",
        "Backend",
        "사용자와 프로필 데이터 모델 정의"
      ],
      [
        "Session Authentication",
        "Backend",
        "로그인과 세션 갱신 흐름 구현"
      ],
      [
        "Profile Editor",
        "Frontend",
        "프로필 조회와 수정 경험 구현"
      ],
      [
        "Access Policies",
        "Validation",
        "사용자별 데이터 접근 경계 검증"
      ]
    ]
  },
  {
    "title": "Preference Onboarding",
    "tasks": [
      [
        "Preference Taxonomy",
        "Research",
        "메뉴와 취향 분류 체계 구성"
      ],
      [
        "Dietary Constraints",
        "Backend",
        "알레르기·식단 제한 데이터 구성"
      ],
      [
        "Onboarding Forms",
        "Frontend",
        "취향 수집과 입력 검증 화면 구현"
      ],
      [
        "Preference Persistence",
        "Engineering",
        "취향 저장과 재진입 상태 복원 구현"
      ]
    ]
  },
  {
    "title": "Lunch Matching",
    "tasks": [
      [
        "Candidate Pool",
        "Engineering",
        "참여 가능한 점심 그룹 후보 구성"
      ],
      [
        "Preference Scoring",
        "Engineering",
        "취향 적합도와 식당 점수 계산"
      ],
      [
        "Group Constraints",
        "Engineering",
        "위치·시간·식단 충돌 해결 구현"
      ],
      [
        "Matching Validation",
        "Validation",
        "매칭 품질과 점수 편향 검증"
      ]
    ]
  },
  {
    "title": "Restaurant Discovery",
    "tasks": [
      [
        "Restaurant Dataset",
        "Research",
        "식당·메뉴·영업 정보 정규화"
      ],
      [
        "Location Search",
        "Backend",
        "모임 위치 기준 주변 식당 탐색"
      ],
      [
        "Menu Filters",
        "Frontend",
        "메뉴·예산·식단 필터 구현"
      ],
      [
        "Recommendation Cards",
        "Frontend",
        "추천 결과와 빈 상태 화면 연결"
      ]
    ]
  },
  {
    "title": "Group Coordination",
    "tasks": [
      [
        "Group Rooms",
        "Backend",
        "점심 모임 생성과 참여 상태 구현"
      ],
      [
        "Invite Links",
        "Engineering",
        "초대 링크와 만료 규칙 구현"
      ],
      [
        "Shared Voting",
        "Frontend",
        "후보 투표와 집계 화면 구현"
      ],
      [
        "Decision Sync",
        "Engineering",
        "최종 선택과 그룹 상태 동기화"
      ]
    ]
  },
  {
    "title": "Notifications",
    "tasks": [
      [
        "Notification Events",
        "Infrastructure",
        "모임과 투표 알림 이벤트 정의"
      ],
      [
        "Delivery Queue",
        "Infrastructure",
        "알림 큐와 실패 재전송 구성"
      ],
      [
        "Lunch Reminders",
        "Engineering",
        "시간대별 점심 약속 리마인더 구현"
      ],
      [
        "Preference Controls",
        "Frontend",
        "알림 설정과 수신 거부 경험 구현"
      ]
    ]
  },
  {
    "title": "Release Validation",
    "tasks": [
      [
        "Journey Fixtures",
        "Validation",
        "핵심 사용자 여정의 테스트 데이터 구성"
      ],
      [
        "Integration Suite",
        "Validation",
        "인증·취향·매칭·협업 통합 검증"
      ],
      [
        "Device Checks",
        "Validation",
        "기기별 화면과 접근성 검증"
      ],
      [
        "Recovery Validation",
        "Validation",
        "실패 복구와 재접속 여정 검증"
      ]
    ]
  },
  {
    "title": "Production Release",
    "tasks": [
      [
        "Release Artifact",
        "Deployment",
        "버전과 의존성을 고정한 배포 패키징"
      ],
      [
        "Runtime Config",
        "Infrastructure",
        "배포 환경과 런타임 설정 검증"
      ],
      [
        "Deployment Pipeline",
        "Deployment",
        "릴리즈 전환과 롤백 경로 구성"
      ],
      [
        "Production Health",
        "Deployment",
        "Health Check와 모니터링 인계 완료"
      ]
    ]
  }
] satisfies { title: string; tasks: [string, string, string][] }[];

export const finalRun = {
  canonicalPrompt: `지정된 폴더의 명세와 Context를 사용해서
OHAYO를 처음부터 끝까지 완성하고
배포까지 진행해줘.`,
  taskGraphDuration: 200_000,
  taskDuration: 30_000,
  finalUrl: 'https://ohayo.tail2dac17.ts.net/',
  tasks: productTaskGroups.flatMap((group, groupIndex) => group.tasks.map(([title, owner, goal], taskIndex): ProductTask => {
    const id = groupIndex * 4 + taskIndex + 1;
    const previousGroup = groupIndex * 4;
    const dependsOn = taskIndex < 2 ? [previousGroup]
      : taskIndex === 2 ? [id - 2, id - 1] : [id - 1, id - 2];
    const context = `${group.title} 명세 · ${title} 입력 데이터`;
    const implementation = `${goal} 작업을 진행하고 있습니다.`;
    const validation = `${title}의 완료 조건과 연결 상태를 검증하고 있습니다.`;
    const repair = id === 20 ? 'Score 가중치와 충돌 해결 규칙을 조정하고 있습니다.'
      : '모바일 협업 상태의 재접속 문제를 복구하고 있습니다.';
    return { id, title, owner, goal, group: group.title, dependsOn,
      events: id === 20 || id === 36 ? retryEvents(context, implementation, validation, repair)
        : standardEvents(context, implementation, validation) };
  })),
  completionChecks: ['검증', '패키징', '배포', 'Health Check', '모니터링'],
};

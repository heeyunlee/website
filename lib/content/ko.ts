import type { Translation } from "@/lib/content/types";

/**
 * Korean (해요체). Content rules apply to every locale: never publish a
 * current location, never publish dub's financial metrics.
 */
export const ko: Translation = {
  site: {
    role: "시니어 소프트웨어 엔지니어",
    taglines: {
      prefix: "저는",
      // Verb-last word order: each word carries its own object particle.
      words: [
        "모바일 앱을",
        "핀테크 제품을",
        "피트니스 테크를",
        "감각적인 UI를",
      ],
      suffix: "만들어요",
    },
    tagline:
      "Flutter와 Swift로 모바일 경험을 만드는 소프트웨어 엔지니어예요. 지금은 미국 최초의 카피트레이딩 플랫폼 dub에서 일하고 있어요.",
    bio: [
      "저는 디테일에 진심인 소프트웨어 엔지니어예요. 빠르고, 세심하고, 조금은 즐거운 모바일 경험을 만드는 걸 좋아해요. 지금은 미국 최초의 카피트레이딩 플랫폼 dub에서, 누구나 믿을 수 있는 투자자를 따라 투자할 수 있도록 돕고 있어요.",
      "dub 이전에는 세계에서 가장 스마트한 홈 짐 Tonal의 모바일 팀에서 일했어요. 운동을 제품 출시만큼 진지하게 생각하는 저에게 잘 맞는 곳이었죠. 테크 업계에 오기 전에는 대한민국 해병대에서 통신병으로 2년간 복무했고, Pace University에서 비즈니스 애널리틱스와 금융을 공부했어요. 시장, 운동, 소프트웨어 — 이 세 가지는 제가 만드는 모든 것에 계속 등장해요.",
    ],
  },
  ui: {
    nav: {
      home: "홈",
      resume: "이력서",
      projects: "프로젝트",
      contact: "연락처",
      primaryAria: "주 메뉴",
    },
    footer: { privacy: "개인정보" },
    home: {
      about: "소개",
      pathSoFar: "지금까지의 여정",
      pathHint: "항목을 누르면 자세히 볼 수 있어요.",
      toolbox: "기술 스택",
      featuredProjects: "주요 프로젝트",
      allProjects: "전체 프로젝트",
      viewProjects: "프로젝트 보기",
      getInTouch: "연락하기",
      ctaTitle: "아이디어가 있거나, 그냥 이야기 나누고 싶으신가요?",
      ctaBody: "앱, 시장, 운동에 대한 대화라면 언제든 환영이에요.",
      sayHello: "인사 건네기",
      badgeExTonal: "ex-Tonal",
      badgeStack: "Flutter · Swift",
    },
    timeline: {
      kindLabels: { education: "교육", military: "복무", work: "커리어" },
      visitOrg: "{org} 방문하기",
    },
    contactPage: {
      intro:
        "가장 빠른 연락 방법은 이메일이에요. 다른 플랫폼에서도 만날 수 있어요.",
      copy: "복사",
      copied: "복사 완료!",
    },
    projectsPage: {
      intro:
        "회사 밖에서 만든 것들이에요 — 주로 핀테크, 피트니스, 모바일이 만나는 지점이죠. 각 카드는 코드로 연결돼요.",
    },
    resumePage: {
      introBeforeLink:
        "제 커리어를 간략히 정리했어요. 더 자세한 내용이나 레퍼런스가 필요하시면 ",
      introLinkLabel: "연락처",
      introAfterLink: " 페이지로 연락해 주세요.",
      experience: "경력",
      education: "학력",
      skills: "기술",
    },
    privacyPage: { lastUpdated: "최종 수정 {date}" },
    languageToggleAria: "언어 선택",
  },
  metadata: {
    projects: {
      title: "프로젝트",
      description: "Heeyun Lee의 프로젝트와 작업물",
    },
    contact: { title: "연락처", description: "Heeyun Lee에게 연락하기" },
    resume: { title: "이력서", description: "Heeyun Lee의 경력과 배경" },
    privacy: {
      title: "개인정보 처리방침",
      description: "이 사이트의 분석 도구와 개인정보 처리 방식",
    },
  },
  timeline: {
    pace: {
      organization: "Pace University",
      role: "경영학사, 비즈니스 애널리틱스 & 금융",
      location: "미국 뉴욕",
      summary: "지금도 제 일을 만드는 두 가지, 데이터와 시장을 복수전공했어요.",
      details: [
        "비즈니스 애널리틱스와 금융을 복수전공하고 수석 졸업(summa cum laude)했어요.",
        "코드로 생각하기 전에 모델과 스프레드시트로 생각하는 법을 먼저 배웠어요.",
      ],
      tags: ["애널리틱스", "금융"],
    },
    rokmc: {
      organization: "대한민국 해병대",
      role: "통신병",
      location: "대한민국",
      period: "2018 — 2020",
      summary: "2년간 통신을 책임지며, 신뢰성이 선택이 아니라는 걸 배웠어요.",
      details: [
        "2년의 복무 기간 동안 통신 장비와 인프라를 운용하고 정비했어요.",
        "병장으로 8명의 분대를 이끄는 분대장을 맡았어요.",
        "처음부터 제대로 작동해야 하는 시스템에 대한 깊은 존중을 얻었어요.",
      ],
      tags: ["통신", "리더십"],
    },
    tonal: {
      organization: "Tonal",
      role: "소프트웨어 엔지니어, 모바일",
      period: "2022 — 2023",
      summary: "세계에서 가장 스마트한 홈 짐의 모바일 경험을 만들었어요.",
      details: [
        "모바일 앱의 네트워킹을 REST에서 GraphQL로 전환해 페이로드를 99% 줄이고 주요 화면을 50% 빠르게 만들었어요.",
        "사용자 행동을 분석해 적절한 요청 시점을 찾아 앱스토어 리뷰를 400% 늘렸어요.",
      ],
      tags: ["Swift", "모바일"],
    },
    dub: {
      organization: "dub",
      role: "시니어 소프트웨어 엔지니어",
      period: "2023 — 현재",
      summary: "미국 최초의 카피트레이딩 플랫폼을 만들고 있어요.",
      details: [
        "dub 앱의 앱스토어 출시를 처음부터 이끌며 엔지니어링, 컴플라이언스, 디자인, 운영 팀과 협업했어요.",
        "카피트레이딩 마켓플레이스의 가능성을 검증한 리더보드 기능을 만들었어요.",
        "컴플라이언스·운영 팀과 협력해 KYC와 신원 인증을 구현했어요.",
        "2026년에 시니어 소프트웨어 엔지니어로 승진했어요.",
      ],
      tags: ["Flutter", "핀테크"],
    },
  },
  experience: {
    dub: {
      title: "시니어 소프트웨어 엔지니어",
      organization: "dub",
      period: "2023 — 현재",
      summary:
        "미국 최초의 카피트레이딩 플랫폼에서, 누구나 최고의 투자자를 따라 투자할 수 있는 모바일 경험을 만들고 있어요. 2026년에 시니어 소프트웨어 엔지니어로 승진했어요.",
      highlights: [
        "시드 단계 스타트업에서 dub 앱의 앱스토어 출시를 처음부터 이끌며 엔지니어링, 컴플라이언스, 디자인, 운영 팀과 협업했어요.",
        "카피트레이딩 마켓플레이스의 가능성을 검증한 리더보드 기능을 만들었어요.",
        "iOS 앱에 KYC와 신원 인증을 구현하며 기술적 제약을 컴플라이언스·운영 팀의 언어로 풀어냈어요.",
        "릴리스 리스크를 줄이는 피처 플래그 시스템을 도입했어요.",
      ],
    },
    tonal: {
      title: "소프트웨어 엔지니어, 모바일",
      organization: "Tonal",
      period: "2022 — 2023",
      summary:
        "세계에서 가장 스마트한 홈 짐이자 퍼스널 트레이너인 Tonal의 모바일 팀에서 일했어요.",
      highlights: [
        "모바일 앱의 네트워킹을 REST에서 GraphQL로 전환해 페이로드를 99% 줄이고 주요 화면을 50% 빠르게 만들었어요.",
        "사용자 행동을 분석해 적절한 요청 시점을 찾아 앱스토어 리뷰를 400% 늘렸어요.",
      ],
    },
    rokmc: {
      title: "통신병",
      organization: "대한민국 해병대",
      location: "대한민국",
      period: "2018 — 2020",
      summary: "2년간 통신 장비와 인프라를 운용하며 군 복무를 마쳤어요.",
      highlights: ["병장으로 8명의 분대를 이끄는 분대장을 맡았어요."],
    },
  },
  education: [
    {
      school: "Pace University",
      degree: "경영학사, 비즈니스 애널리틱스 & 금융 (복수전공) · 수석 졸업",
      detail: "미국 뉴욕",
    },
  ],
  skillGroups: {
    languages: "언어",
    frameworks: "프레임워크",
    tools: "도구 & 플랫폼",
  },
  projects: {
    cccc: "실제 계좌와 연결되는 지출 트래커예요. Flutter와 Firebase로 만들었고, Plaid API로 거래 내역을 자동 동기화해요.",
    break:
      "운동, 식단, 신체 치수를 기록하는 iOS·Android 운동 플레이어예요. 제가 원하던 방식의 트레이닝 로그를 직접 만들었어요.",
    website:
      "이 사이트예요. 정적으로 내보낸 Next.js 앱을 Firebase Hosting에 배포하고, GitHub Actions로 CI/CD와 PR 프리뷰를 구성했어요.",
  },
  contact: {
    email: { label: "이메일", description: "가장 빠른 연락 방법이에요." },
    github: {
      label: "GitHub",
      description: "프로젝트, 실험, 그리고 이 사이트의 코드가 있어요.",
    },
    linkedin: {
      label: "LinkedIn",
      description: "경력과 소식을 확인할 수 있어요.",
    },
  },
  privacy: {
    title: "개인정보 처리방침",
    updated: "2026년 6월",
    paragraphs: [
      "이 사이트는 프라이버시 친화적인 분석 도구 Umami로 사이트 이용 현황을 파악해요. 어떤 페이지가 방문되는지, 방문자가 어디서 오는지, 어떤 국가·브라우저·기기를 사용하는지 같은 정보예요.",
      "Umami는 쿠키를 사용하지 않고 개인정보를 수집하지 않아요. 핑거프린팅도, 사이트 간 추적도, 개인을 식별하는 그 어떤 것도 없어요. 모든 데이터는 익명의 집계 데이터예요. 그래서 쿠키 동의 배너도 필요하지 않아요.",
      "궁금한 점이 있다면 언제든 이메일로 연락해 주세요.",
    ],
  },
};

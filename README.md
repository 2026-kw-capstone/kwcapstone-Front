# AI Speech Frontend for Communication Rehabilitation

이 프로젝트는 성인 의사소통 및 조음 장애 사용자의 재활 훈련을 돕기 위한 **AI 기반 언어 훈련 서비스의 프론트엔드 애플리케이션**입니다.  
사용자가 워밍업, 시나리오 훈련, 자유 발화 연습, 리포트 확인까지 자연스럽게 이어서 사용할 수 있도록 **직관적인 UI/UX**를 제공하며,  
AI 서버와 연동하여 음성 녹음, 발화 결과 확인, 훈련 기록 확인 등의 기능을 수행합니다.

---

## 📱 주요 화면 구성 (Main Pages)

### 1. 홈 (`/`)
- 서비스 소개와 사용자 맞춤 응원 문구를 제공합니다.
- 오늘의 미션, 최근 리포트 요약, 핵심 기능 바로가기를 배치합니다.
- 사용자가 자주 사용하는 훈련 기능으로 빠르게 이동할 수 있도록 구성합니다.

### 2. 워밍업 (`/warmup`)
- 워밍업 기능 목록을 보여주는 진입 페이지입니다.
- 하위 기능:
  - `/warmup/my-note` : 나만의 문장 노트
  - `/warmup/basic-speak` : 기초 발성 연습

### 3. AI 실전 대화 연습 (`/practice`)
- 실제 의사소통 상황을 반영한 대화 훈련 페이지입니다.
- 하위 기능:
  - `/practice/scenario` : 시나리오 훈련
  - `/practice/free-conversation` : 자유 발화 연습

### 4. 리포트 (`/report`)
- 훈련 결과를 기록하고 통계 형태로 보여주는 페이지입니다.
- 사용자의 발화 성과와 주간/누적 추이를 시각적으로 제공합니다.

### 5. 마이페이지 (`/mypage`)
- 사용자 정보 수정, 비밀번호 변경, 설정 기능 등을 제공합니다.

---

## 📂 프로젝트 구조 (Project Structure)

```bash
frontend/
│
├── public/
│
├── src/
│   ├── api/                  # 서버 통신 함수
│   ├── assets/               # 이미지, 아이콘 등 정적 리소스
│   ├── components/           # 공통 UI 컴포넌트
│   ├── constants/            # 레이아웃, 메뉴, 상수 정의
│   ├── contexts/             # 전역 상태 관리(Context API 등)
│   ├── hooks/                # 커스텀 훅
│   ├── layouts/              # 공통 레이아웃
│   ├── pages/                # 페이지 컴포넌트
│   ├── types/                # 타입 정의
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 UI 설계 원칙 (Design Principles)

* **부담 없는 인터페이스**
  언어 훈련 사용자에게 심리적 부담을 주지 않도록 부드럽고 친절한 화면을 구성합니다.

* **명확한 정보 전달**
  녹음 상태, 평가 결과, 진행 단계가 직관적으로 보이도록 설계합니다.

* **반복 훈련 친화적 구조**
  같은 문장을 여러 번 연습해도 피로감이 적도록 단순하고 일관된 흐름을 유지합니다.

* **접근성 고려**
  버튼 크기, 색 대비, 텍스트 가독성을 고려해 다양한 사용자에게 편한 경험을 제공합니다.

---

## 🚀 시작하기 (Getting Started)

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 설정합니다.

```env
VITE_SERVER_API_URL=http://localhost:8000
```

필요 시 인증 토큰, S3 URL, 기타 설정 값을 추가할 수 있습니다.

### 2. 패키지 설치

```bash
npm install
```



### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 개발 서버 주소에 접속하여 실행 결과를 확인합니다.



---

## 🛠️ 기술 스택 (Tech Stack)

* **Framework**: React, Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Routing**: React Router
* **State Management**: Context API / Custom Hooks
* **HTTP Client**: Axios 
* **Audio Handling**: MediaRecorder API, HTMLAudioElement
* **Build Tool**: Vite
 



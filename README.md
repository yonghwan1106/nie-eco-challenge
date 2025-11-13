# NIE 에코-챌린지

게이미피케이션(Gamification)을 활용한 시민참여형 생태교란종 모니터링 플랫폼

## 프로젝트 개요

국민 누구나 '시민 과학자'가 되어 게임처럼 즐겁게 생태교란종을 탐색하고 신고함으로써, 국립생태원의 생물다양성 보전 활동에 직접 기여할 수 있는 웹 플랫폼입니다.

### 주요 기능

- 📷 **AI 기반 신고 시스템**: Claude 4.0 API를 활용한 생태교란종 이미지 식별
- 🎯 **게이미피케이션**: 미션, 포인트, 랭킹, 에코 도감 시스템
- 🗺️ **지도 시각화**: Naver Map을 활용한 신고 위치 시각화
- 🏆 **사용자 참여 유도**: 배지, 보상, 진행률 트래킹
- 📊 **관리자 검증 시스템**: 신고 내역 승인/반려 관리

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Pretendard Font
- **UI Components**: shadcn/ui + lucide-react
- **Animation**: Framer Motion
- **State Management**: Zustand
- **API**: Claude 4.0 (Image Recognition), Naver Map
- **Deployment**: Vercel

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Claude API 키
- Naver Map API 클라이언트 ID

### 설치 방법

1. 레포지토리 클론

```bash
git clone <repository-url>
cd nie-eco-challenge
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Claude API
CLAUDE_API_KEY=your_claude_api_key_here

# Naver Map API
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id_here

# App Configuration
NEXT_PUBLIC_APP_NAME=NIE 에코-챌린지
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
nie-eco-challenge/
├── app/                      # Next.js App Router 페이지
│   ├── page.tsx             # 홈/대시보드
│   ├── report/              # 신고하기
│   ├── missions/            # 미션 목록
│   ├── map/                 # 신고 지도
│   ├── profile/             # 마이페이지
│   ├── collection/          # 에코 도감
│   ├── admin/               # 관리자 페이지
│   ├── globals.css          # 전역 스타일
│   └── layout.tsx           # 루트 레이아웃
├── components/
│   ├── features/            # 기능별 컴포넌트
│   │   └── mission-card.tsx
│   ├── layout/              # 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   └── ui/                  # shadcn/ui 컴포넌트
├── data/                    # Mock 데이터 (JSON)
│   ├── species.json         # 생태교란종 정보
│   ├── users.json           # 사용자 데이터
│   ├── reports.json         # 신고 내역
│   └── missions.json        # 미션 정보
├── lib/
│   └── utils.ts             # 유틸리티 함수
└── public/                  # 정적 파일
    └── images/
```

## MVP 개발 계획

### Phase 1: 프로젝트 초기화 ✅
- Next.js 프로젝트 생성
- Tailwind CSS + shadcn/ui 설정
- Mock 데이터 구조 생성
- 기본 레이아웃 및 네비게이션

### Phase 2: 코어 페이지 개발 ✅
- ✅ 메인 대시보드
- ✅ 신고하기 플로우 (AI 이미지 식별)
- ✅ 미션 목록 (필터링 & 진행률 트래킹)
- ✅ 프로필/마이페이지 (통계, 배지, 최근 활동)
- ✅ 에코 도감 (수집 진행률, 상세 정보)

### Phase 3: 지도 시각화 ✅
- ✅ 인터랙티브 지도 UI (시각적 마커)
- ✅ 신고 위치 마커 표시 (상태별 색상)
- ✅ 종별/상태별 필터링
- ✅ 상세 정보 모달

### Phase 4: 관리자 기능 ✅
- ✅ 신고 검증 대시보드
- ✅ 검색 & 필터 시스템
- ✅ 승인/반려 처리
- ✅ 통계 대시보드

### Phase 5: UI/UX 개선
- 반응형 디자인 최적화
- 애니메이션 추가
- 성능 최적화

### Phase 6: 배포
- Vercel 배포
- 문서화 완성

## 디자인 시스템

### 색상 팔레트

- **Primary**: `#10B981` (Emerald 500) - 생태 & 활력
- **Secondary**: `#3B82F6` (Blue 500) - 신뢰 & 기술
- **Accent**: `#F59E0B` (Amber 500) - 보상 & 성취
- **Danger**: `#EF4444` (Red 500) - 경고

### 상태별 색상

- **Pending**: Amber (검토 중)
- **Confirmed**: Green (승인)
- **Rejected**: Red (반려)

### 난이도별 색상

- **Easy**: Sky Blue
- **Medium**: Orange
- **Hard**: Purple

## Mock 데이터

이 MVP는 실제 데이터베이스 없이 JSON 파일 기반의 Mock 데이터를 사용합니다.

- `/data/species.json`: 5종의 생태교란종 정보
- `/data/users.json`: 3명의 샘플 사용자
- `/data/reports.json`: 4건의 샘플 신고 내역
- `/data/missions.json`: 3개의 샘플 미션

## 주요 컴포넌트

### 레이아웃

- `Header`: 상단 헤더 (로고, 제목, 알림)
- `MobileNav`: 하단 모바일 네비게이션 (5개 탭)

### 기능 컴포넌트

- `MissionCard`: 미션 정보 카드 (진행률, 보상, 난이도)

## 개발 가이드

### 코드 스타일

- TypeScript 사용
- 함수형 컴포넌트 (React Hooks)
- Tailwind CSS 클래스 기반 스타일링
- `cn()` 유틸리티를 사용한 조건부 클래스

### 파일 명명 규칙

- 컴포넌트: `kebab-case.tsx`
- 페이지: `page.tsx`
- 레이아웃: `layout.tsx`

## 라이선스

이 프로젝트는 2025년도 국립생태원 대국민 혁신·ESG 아이디어 공모전을 위한 MVP입니다.

## 제작자

- PRD 문서 기반으로 제작
- Design System: 게이미피케이션 + 생태 테마
- 목표: 시민 참여형 생태 모니터링 플랫폼 구현

---

**개발 진행 상황**: Phase 4 완료 (모든 주요 페이지 구현 완료, MVP 개발 95% 완성)

## 완성된 페이지 목록

### 사용자 페이지
- ✅ **메인 대시보드** (`/`) - 활동 요약, 미션, 통계
- ✅ **신고하기** (`/report`) - AI 기반 5단계 신고 워크플로우
- ✅ **미션** (`/missions`) - 게이미피케이션 미션 시스템
- ✅ **지도** (`/map`) - 인터랙티브 신고 지도 with 필터링
- ✅ **프로필** (`/profile`) - 사용자 통계, 배지, 최근 활동
- ✅ **에코 도감** (`/collection`) - 종 수집 진행률 및 상세 정보

### 관리자 페이지
- ✅ **관리자 대시보드** (`/admin`) - 신고 검증 및 관리 시스템

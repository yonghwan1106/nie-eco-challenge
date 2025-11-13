

# 제품 요구사항 문서 (PRD): NIE 에코-챌린지 (MVP)

| 항목 | 내용 |
| :--- | :--- |
| **문서명** | NIE 에코-챌린지: MVP 1.0 제품 요구사항 문서 |
| **프로젝트명** | NIE 에코-챌린지 (시민참여형 생태교란종 모니터링 플랫폼) |
| **작성자** | (담당자명) |
| **최종 수정일** | 2025년 11월 13일 |
| **문서 상태** | Draft 1.0 |

-----

## 1\. 제품 개요 (Product Overview)

### 1.1. 제품 비전 (Vision)

국민 누구나 '시민 과학자'가 되어 '게임'처럼 즐겁게 생태교란종을 탐색하고 신고함으로써, 국립생태원의 생물다양성 보전 활동에 직접 기여하는 대한민국 대표 생태 모니터링 플랫폼을 구축한다.

### 1.2. 핵심 문제 (Problem Statement)

1.  **데이터 부족:** 기후변화로 생태교란종은 빠르게 확산되나, 전국 단위의 실시간 분포 현황 데이터는 전문 인력만으로 수집하기에 한계가 있다.
2.  **낮은 참여:** 국민들은 생태 보전의 필요성은 인지하나, 일상에서 지속적으로 참여할 수 있는 재미있고 쉬운 방법이 부재하다.

### 1.3. 제품 목표 (Goals) - MVP 1.0

1.  **핵심 기능 검증:** 게이미피케이션(미션, 보상)이 시민들의 데이터 수집(사진 업로드)에 효과적인 동기부여 수단인지 검증한다.
2.  **기술 검증:** Claude 4.0 Vision API를 활용한 생태교란종 이미지 1차 판별의 정확성과 유용성을 테스트한다.
3.  **데이터 수집:** Naver Map API를 통해 수집된 데이터(위치)를 시각화하여 데이터의 가치를 즉각적으로 확인시킨다.

## 2\. 사용자 페르소나 (User Personas)

| 페르소나 | 설명 | 핵심 니즈 (Needs) |
| :--- | :--- | :--- |
| **1. 학생 방문객 (10-10대)** | 국립생태원에 현장학습으로 방문. 경쟁과 보상(게임)에 민감하며, 친구들과의 랭킹에 흥미를 느낌. | - "친구들보다 더 많은 포인트를 얻고 싶어요."<br>- "내가 찾은 생물이 '레어'한 것이면 좋겠어요." |
| **2. 주말 탐방객 (30-40대)** | 가족과 함께 생태원이나 인근 공원을 방문. 교육적 가치와 성취감을 중요하게 생각함. | - "아이에게 생태 교육을 해줄 좋은 기회예요."<br>- "내가 발견한 생물 도감을 차곡차곡 채우고 싶어요." |
| **3. NIE 전문가 (Admin)** | 국립생태원 연구원. 시민들이 올린 데이터의 신뢰도를 검증하고 관리해야 함. | - "신고된 사진이 맞는지 빠르고 정확하게 판별해야 해요."<br>- "어느 지역에서 어떤 종이 주로 발견되는지 한눈에 보고 싶어요." |

## 3\. 기술 스택 및 아키텍처 (Tech Stack)

| 구분 | 기술 | 목적 및 사유 |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router)** | - 사용자 요청사항. SSR/SSG를 통한 빠른 로딩 속도.<br>- API Route를 활용한 간편한 Mock 백엔드 구현. |
| **Deployment** | **Vercel** | - 사용자 요청사항. GitHub 연동을 통한 자동 CI/CD 파이프라인. |
| **Database** | **Mock Data (JSON Files)** | - 사용자 요청사항. MVP 단계에서 빠른 개발을 위해 실제 DB 대신 `/data` 폴더 내 JSON 파일 (e.g., `users.json`, `reports.json`)을 사용. |
| **UI/CSS** | **Tailwind CSS** | - Next.js와 궁합이 좋고, 빠른 프로토타이핑 및 반응형 웹 구현에 용이. |
| **State Mgt.** | **Zustand 또는 React Context** | - MVP 규모에 적합한 가볍고 단순한 상태관리. |
| **Source Control** | **GitHub** | - Vercel 배포 연동을 위해 필수. |

## 4\. API 전략 (API Strategy)

### 4.1. 외부 API (External APIs)

1.  **Anthropic Claude 4.0 API (필수)**

      * **용도:** 생태교란종 이미지 식별 (AI 1차 판별)
      * **워크플로우:**
        1.  사용자가 이미지를 업로드합니다.
        2.  Frontend가 이미지를 Base64로 인코딩하여 Next.js API Route (`/api/identify`)로 전송합니다.
        3.  API Route는 Claude 4.0 Vision API로 이미지와 프롬프트를 전송합니다.
        4.  **Prompt (예시):** "이 이미지는 다음 생태교란종 목록 중 하나와 일치합니까? [가시박, 뉴트리아,...] 만약 일치한다면, 가장 가능성이 높은 종의 이름(species\_name)과 신뢰도(confidence)를 JSON 형식으로 응답해 주십시오. 일치하는 것이 없다면 `{'species_name': 'unknown', 'confidence': 0.0}`으로 응답하십시오."
        5.  결과(JSON)를 Frontend로 반환합니다.

2.  **Naver Map API (필수)**

      * **용도:** 신고된 생태교란종 위치 시각화 (메인 대시보드)
      * **워크플로우:**
        1.  페이지 로드 시, Mock DB(`reports.json`)에서 `status: "confirmed"`인 데이터만 불러옵니다.
        2.  Naver Map SDK를 사용하여 해당 좌표(lat/lng)에 종별 마커를 렌더링합니다.
        3.  마커 클릭 시 종 이름, 신고일자 등 간단한 정보창(Info Window)을 표시합니다.

3.  **카카오/네이버 소셜 로그인 API (제안)**

      * **용도:** 간편 로그인. MVP에서는 Mock Auth로 대체 가능하나, 향후 확장을 위해 고려.
      * *MVP 1.0에서는 `localStorage` 기반의 가상 로그인으로 대체합니다.*

### 4.2. 내부 API (Internal API - Next.js API Routes)

  * `POST /api/login`: (Mock) 사용자 로그인 처리
  * `GET /api/user/profile`: (Mock) 사용자 정보 (포인트, 랭킹, 도감) 조회
  * `GET /api/missions`: (Mock) 현재 진행 중인 미션 목록 조회
  * `GET /api/reports?status=[all/pending/confirmed]`: (Mock) 신고 내역 조회 (Admin/Public Map)
  * `POST /api/reports`: (Mock) 신규 생태교란종 신고 접수
  * `PUT /api/reports/[id]`: (Mock) (Admin) 신고 내역 상태 변경 (승인/반려)
  * `POST /api/identify`: (Mock) Claude API 중계 엔드포인트

## 5\. Mock 데이터 구조 (Mock Data Schema)

(프로젝트 루트의 `/data` 디렉토리에 JSON 파일로 위치)

**`species.json` (생태교란종 정보)**

```json
[
  {
    "id": "sp001",
    "name_ko": "가시박",
    "name_en": "Burcucumber",
    "scientific_name": "Sicyos angulatus",
    "category": "식물",
    "description": "북미 원산의 덩굴성 한해살이풀로, 다른 식물을 덮어 햇빛을 차단하여 고사시킵니다.",
    "origin": "북아메리카",
    "threat_level": "high",
    "image_url": "/images/species/gasibak.jpg"
  },
  {
    "id": "sp002",
    "name_ko": "뉴트리아",
    "name_en": "Nutria",
    "scientific_name": "Myocastor coypus",
    "category": "동물",
    "description": "남미 원산의 대형 설치류로, 하천 제방을 훼손하고 수생식물을 대량 섭식합니다.",
    "origin": "남아메리카",
    "threat_level": "high",
    "image_url": "/images/species/nutria.jpg"
  },
  {
    "id": "sp003",
    "name_ko": "돼지풀",
    "name_en": "Ragweed",
    "scientific_name": "Ambrosia artemisiifolia",
    "category": "식물",
    "description": "북미 원산의 한해살이풀로, 꽃가루 알레르기를 유발하며 농작물 생육을 방해합니다.",
    "origin": "북아메리카",
    "threat_level": "medium",
    "image_url": "/images/species/ragweed.jpg"
  },
  {
    "id": "sp004",
    "name_ko": "블루길",
    "name_en": "Bluegill",
    "scientific_name": "Lepomis macrochirus",
    "category": "동물",
    "description": "북미 원산의 민물고기로, 토종 어류의 알과 치어를 포식하여 생태계를 교란합니다.",
    "origin": "북아메리카",
    "threat_level": "high",
    "image_url": "/images/species/bluegill.jpg"
  },
  {
    "id": "sp005",
    "name_ko": "황소개구리",
    "name_en": "American Bullfrog",
    "scientific_name": "Lithobates catesbeianus",
    "category": "동물",
    "description": "북미 원산의 대형 개구리로, 토종 양서류와 곤충을 대량 포식합니다.",
    "origin": "북아메리카",
    "threat_level": "high",
    "image_url": "/images/species/bullfrog.jpg"
  }
]
```

**`users.json` (사용자 정보)**

```json
[
  {
    "user_id": "user001",
    "nickname": "생태지킴이",
    "email": "eco@example.com",
    "join_date": "2025-01-15",
    "total_points": 1250,
    "rank": 1,
    "reports_count": 25,
    "confirmed_count": 22,
    "collected_species": ["sp001", "sp002", "sp003", "sp004"],
    "profile_image": "/images/avatars/default.png",
    "badges": ["first_report", "species_hunter", "top_contributor"]
  },
  {
    "user_id": "user002",
    "nickname": "자연탐험가",
    "email": "nature@example.com",
    "join_date": "2025-02-01",
    "total_points": 890,
    "rank": 2,
    "reports_count": 18,
    "confirmed_count": 16,
    "collected_species": ["sp001", "sp003", "sp005"],
    "profile_image": "/images/avatars/default.png",
    "badges": ["first_report", "weekend_warrior"]
  },
  {
    "user_id": "user003",
    "nickname": "에코히어로",
    "email": "hero@example.com",
    "join_date": "2025-03-10",
    "total_points": 650,
    "rank": 3,
    "reports_count": 13,
    "confirmed_count": 12,
    "collected_species": ["sp002", "sp004"],
    "profile_image": "/images/avatars/default.png",
    "badges": ["first_report"]
  }
]
```

**`reports.json` (신고 내역)**

```json
[
  {
    "report_id": "rp001",
    "user_id": "user001",
    "species_id": "sp001",
    "ai_suggested_species": "sp001",
    "ai_confidence": 0.95,
    "location": {
      "lat": 36.5040,
      "lng": 127.2621,
      "address": "충청남도 서천군 마서면 금강로 1210"
    },
    "image_url": "/uploads/rp001.jpg",
    "description": "국립생태원 인근 산책로에서 발견했습니다.",
    "status": "confirmed",
    "confirmed_species_id": "sp001",
    "admin_comment": "정확한 식별입니다. 감사합니다.",
    "points_awarded": 50,
    "created_at": "2025-11-10T14:30:00Z",
    "reviewed_at": "2025-11-10T16:45:00Z"
  },
  {
    "report_id": "rp002",
    "user_id": "user002",
    "species_id": "sp002",
    "ai_suggested_species": "sp002",
    "ai_confidence": 0.88,
    "location": {
      "lat": 36.5100,
      "lng": 127.2700,
      "address": "충청남도 서천군 금강 하천변"
    },
    "image_url": "/uploads/rp002.jpg",
    "description": "금강 하천변에서 목격했습니다.",
    "status": "confirmed",
    "confirmed_species_id": "sp002",
    "admin_comment": "뉴트리아가 맞습니다. 해당 지역 모니터링이 필요합니다.",
    "points_awarded": 100,
    "created_at": "2025-11-11T09:15:00Z",
    "reviewed_at": "2025-11-11T11:20:00Z"
  },
  {
    "report_id": "rp003",
    "user_id": "user003",
    "species_id": "sp003",
    "ai_suggested_species": "sp003",
    "ai_confidence": 0.72,
    "location": {
      "lat": 36.5200,
      "lng": 127.2500,
      "address": "충청남도 서천군 마서면 도로변"
    },
    "image_url": "/uploads/rp003.jpg",
    "description": "도로변 공터에서 발견했습니다.",
    "status": "pending_review",
    "confirmed_species_id": null,
    "admin_comment": null,
    "points_awarded": 0,
    "created_at": "2025-11-12T13:45:00Z",
    "reviewed_at": null
  },
  {
    "report_id": "rp004",
    "user_id": "user001",
    "species_id": "sp004",
    "ai_suggested_species": "sp004",
    "ai_confidence": 0.91,
    "location": {
      "lat": 36.4950,
      "lng": 127.2580,
      "address": "충청남도 서천군 금강 지류"
    },
    "image_url": "/uploads/rp004.jpg",
    "description": "금강 지류에서 낚시 중 발견했습니다.",
    "status": "confirmed",
    "confirmed_species_id": "sp004",
    "admin_comment": "블루길 확인. 우수한 사진입니다.",
    "points_awarded": 50,
    "created_at": "2025-11-12T16:20:00Z",
    "reviewed_at": "2025-11-13T09:10:00Z"
  }
]
```

**`missions.json` (미션 정보)**

```json
[
  {
    "mission_id": "m001",
    "title": "이번 주 가시박 찾기",
    "description": "가을철 급속히 번지는 가시박을 찾아 신고해주세요!",
    "mission_type": "species_specific",
    "target_species_id": "sp001",
    "reward_points": 100,
    "progress_goal": 5,
    "current_progress": 0,
    "start_date": "2025-11-11",
    "end_date": "2025-11-17",
    "status": "active",
    "difficulty": "easy"
  },
  {
    "mission_id": "m002",
    "title": "하천 지킴이 챌린지",
    "description": "하천에 서식하는 생태교란종(뉴트리아, 블루길, 황소개구리)을 찾아주세요!",
    "mission_type": "category_specific",
    "target_species_id": ["sp002", "sp004", "sp005"],
    "reward_points": 200,
    "progress_goal": 3,
    "current_progress": 0,
    "start_date": "2025-11-10",
    "end_date": "2025-11-30",
    "status": "active",
    "difficulty": "medium"
  },
  {
    "mission_id": "m003",
    "title": "에코 콜렉터",
    "description": "5종류 이상의 서로 다른 생태교란종을 수집하세요!",
    "mission_type": "collection",
    "target_species_id": null,
    "reward_points": 300,
    "progress_goal": 5,
    "current_progress": 0,
    "start_date": "2025-11-01",
    "end_date": "2025-11-30",
    "status": "active",
    "difficulty": "hard"
  }
]
```

## 6\. 핵심 기능 명세 (Features & User Stories) - MVP 1.0

### Epic 1: 온보딩 및 인증 (Onboarding & Auth)

  * **Feature:** 가상(Mock) 로그인
  * **User Story:**
      * (As a User) 나는 별도 회원가입 없이 '시작하기' 버튼을 누르면, 시스템이 나에게 임시 ID와 닉네임("방문객 123")을 부여하여 즉시 앱을 사용할 수 있다. (Mock Auth: `localStorage`에 임시 `userId` 저장)

### Epic 2: 생태교란종 신고 (Core Report Feature)

  * **Feature:** AI 기반 신고 폼
  * **User Story:**
      * (As a User) 나는 '신고하기' 버튼을 눌러 카메라를 실행하거나 갤러리에서 사진을 선택하여 업로드할 수 있다.
      * (As a User) 사진을 업로드하면, 앱이 나의 현재 GPS 위치를 자동으로 가져와 지도에 표시해준다.
      * (As a User) 사진 업로드가 완료되면, Claude 4.0 AI가 이미지를 분석하여 "이 생물은 92% 확률로 '가시박'입니다"와 같이 1차 식별 결과를 제안해준다.
      * (As aV User) 나는 AI의 제안을 확인하고(또는 '기타'로 선택하고) 간단한 메모와 함께 '제출하기' 버튼을 누를 수 있다.
      * (As a User) 제출이 완료되면 "신고가 접수되었습니다. 전문가 검토 후 포인트가 지급됩니다"라는 확인 메시지를 받는다.

### Epic 3: 게이미피케이션 (Gamification)

  * **Feature:** 미션 및 챌린지

  * **User Story:**

      * (As a User) 나는 '미션' 탭에서 현재 진행 중인 미션 목록(예: '이번 주 뉴트리아 찾기')과 보상(포인트)을 확인할 수 있다.
      * (As a User) 나의 신고가 미션 조건(예: 뉴트리아 신고)과 일치하고 '승인'되면, 미션 달성도가 자동으로 카운트된다.

  * **Feature:** 랭킹 및 포인트

  * **User Story:**

      * (As a User) 나의 신고가 전문가에 의해 '승인(Confirmed)'되면, 나의 계정에 정해진 포인트가 적립된다.
      * (As a User) 나는 '마이페이지'에서 나의 총 포인트와 전체 사용자 중 나의 랭킹을 확인할 수 있다.
      * (As a User) 나는 '랭킹' 탭에서 주간/월간/전체 랭킹보드를 볼 수 있다.

  * **Feature:** 에코 도감 (Eco-Dossier)

  * **User Story:**

      * (As a User) 나는 '에코 도감' 탭에서 내가 성공적으로 신고(승인)한 생태교란종 목록이 카드 형태로 수집되는 것을 볼 수 있다.
      * (As a User) 도감 카드를 클릭하면 해당 종의 상세 정보(설명, 원산지 등)를 볼 수 있다.

### Epic 4: 데이터 시각화 (Data Visualization)

  * **Feature:** 실시간 신고 지도 (Naver Map)
  * **User Story:**
      * (As a User) 나는 메인 화면의 '신고 지도' 탭에서 다른 사용자들이 '승인'받은 모든 생태교란종 신고 위치를 Naver 지도 위에서 마커로 확인할 수 있다.
      * (As a User) 지도를 확대/축소하며 우리 동네의 생태교란종 분포 현황을 직관적으로 파악할 수 있다.
      * (As a User) 마커를 클릭하면 해당 신고의 종 이름과 신고 날짜를 볼 수 있다.

### Epic 5: 관리자(전문가) 검증 (Admin Panel)

  * (Note: MVP 1.0에서는 별도 Admin 페이지 대신, Mock DB(`reports.json`)를 수동으로 조작하는 것을 가정합니다. 단, 워크플로우는 정의합니다.)
  * **Feature:** 신고 내역 검증
  * **User Story (Admin):**
      * (As an Admin) 나는 `status: "pending_review"`인 신고 목록을 조회할 수 있다.
      * (As an Admin) 나는 사용자가 올린 사진과 AI의 1차 판별 결과를 확인하고, 나의 전문 지식에 따라 '승인(Confirmed)' 또는 '반려(Rejected)' 처리를 할 수 있다.
      * (As an Admin) '승인' 시, `confirmed_species_id`를 확정하고 `status`를 'confirmed'로 변경한다. (-\> 이 변경이 사용자 포인트 지급, 도감 추가, 지도 표시의 트리거가 됨)
      * (As an Admin) '반려' 시, `status`를 'rejected'로 변경하고 반려 사유(예: '사진 불명확')를 `admin_comment`에 기재할 수 있다.

## 7\. MVP 1.0에서 제외되는 사항 (Out of Scope)

  * **실제 DB 구축:** 모든 데이터는 JSON 파일로 관리. (예: Supabase, MongoDB 등 미사용)
  * **실제 인증:** NextAuth.js 등을 사용한 소셜 로그인 (단, UI는 구현해둘 수 있음)
  * **포인트 사용처:** 포인트로 기념품을 교환하는 '스토어' 기능.
  * **소셜 기능:** 친구 추가, 팀 챌린지, 피드 기능.
  * **실시간 푸시 알림:** 신고 승인 시 알림. (향후 Vercel Cron + OneSignal 등으로 구현 제안)
  * **파일 업로드 실제 처리:** 이미지는 미리 준비된 목업 이미지 URL로 대체
  * **실제 GPS 위치 수집:** 사용자 위치는 임의의 국립생태원 인근 좌표로 시뮬레이션

-----

## 8\. 페이지 구조 및 내비게이션 (Page Structure & Navigation)

### 8.1. 사이트맵 (Sitemap)

```
/ (Home/Dashboard)
├── /login (로그인 페이지)
├── /map (신고 지도)
├── /report
│   ├── /report (신고하기)
│   └── /report/[id] (신고 상세)
├── /missions (미션 목록)
├── /ranking (랭킹 보드)
├── /collection (에코 도감)
├── /profile (마이페이지)
│   ├── /profile/reports (내 신고 내역)
│   └── /profile/settings (설정)
└── /admin
    ├── /admin/dashboard (관리자 대시보드)
    └── /admin/reports (신고 검증)
```

### 8.2. 주요 페이지 와이어프레임 (Wireframes)

#### 8.2.1. 메인 대시보드 (`/`)

```
+----------------------------------+
|  NIE 에코-챌린지        🔔  👤  |
+----------------------------------+
|  [오늘의 미션 배너]               |
|  "이번 주 가시박 찾기"            |
|  진행률: ████░░░░░ 45%          |
+----------------------------------+
|  📊 내 활동 요약                 |
|  포인트: 1,250pt | 랭킹: 1위    |
|  신고: 25건 | 승인: 22건          |
+----------------------------------+
|  🎯 진행 중인 미션 (3)           |
|  [미션 카드 1] [미션 카드 2]      |
+----------------------------------+
|  🗺️ 최근 신고 현황               |
|  [Naver Map - 마커들]           |
+----------------------------------+
|  [🔍 신고하기] [🏆 랭킹]         |
+----------------------------------+
```

#### 8.2.2. 신고하기 (`/report`)

```
+----------------------------------+
|  ← 뒤로      생태교란종 신고      |
+----------------------------------+
|  📷 사진 업로드                  |
|  +----------------------------+ |
|  |  [카메라 아이콘]             | |
|  |  사진을 촬영하거나 선택하세요 | |
|  +----------------------------+ |
+----------------------------------+
|  📍 발견 위치                    |
|  [지도 미리보기]                 |
|  충남 서천군 마서면 금강로 1210   |
|  [위치 수정하기]                 |
+----------------------------------+
|  🤖 AI 분석 결과                 |
|  "이 생물은 95% 확률로"          |
|  "가시박입니다"                  |
|  [맞아요] [아니에요, 직접 선택]   |
+----------------------------------+
|  📝 메모 (선택)                  |
|  [텍스트 입력란]                 |
+----------------------------------+
|  [✓ 신고하기]                    |
+----------------------------------+
```

#### 8.2.3. 에코 도감 (`/collection`)

```
+----------------------------------+
|  ← 뒤로      나의 에코 도감       |
+----------------------------------+
|  수집률: 4/5 (80%)               |
|  ████████░░ 80%                |
+----------------------------------+
|  [가시박]  [뉴트리아]  [돼지풀]   |
|   ✓수집     ✓수집      ✓수집    |
+----------------------------------+
|  [블루길]  [황소개구리]           |
|   ✓수집      🔒미수집            |
+----------------------------------+
|  * 카드 클릭 시 상세 정보 모달    |
+----------------------------------+
```

#### 8.2.4. 랭킹 보드 (`/ranking`)

```
+----------------------------------+
|  ← 뒤로      랭킹 보드            |
+----------------------------------+
|  [주간] [월간] [전체]            |
+----------------------------------+
|  🥇 1위  생태지킴이              |
|          1,250pt | 25건 신고   |
+----------------------------------+
|  🥈 2위  자연탐험가              |
|          890pt | 18건 신고     |
+----------------------------------+
|  🥉 3위  에코히어로              |
|          650pt | 13건 신고     |
+----------------------------------+
|  ... (4위~10위)                 |
+----------------------------------+
```

#### 8.2.5. 관리자 - 신고 검증 (`/admin/reports`)

```
+----------------------------------+
|  NIE 에코-챌린지 관리자           |
+----------------------------------+
|  [대기중(3)] [승인됨] [반려됨]    |
+----------------------------------+
|  신고 ID: rp003                  |
|  신고자: 에코히어로               |
|  신고일: 2025-11-12 13:45        |
+----------------------------------+
|  [사진 미리보기]                 |
|  AI 판별: 돼지풀 (72%)           |
|  위치: 충남 서천군 마서면 도로변   |
|  메모: 도로변 공터에서 발견       |
+----------------------------------+
|  [✓ 승인하기] [✗ 반려하기]       |
+----------------------------------+
```

-----

## 9\. 개발 로드맵 및 마일스톤 (Development Roadmap)

### Phase 1: 프로젝트 초기 설정 (Week 1)
- [ ] Next.js 프로젝트 생성 및 기본 구조 설정
- [ ] Tailwind CSS 설정
- [ ] 폴더 구조 정립 (`/app`, `/components`, `/data`, `/lib`, `/public`)
- [ ] Mock 데이터 파일 생성 (species.json, users.json, reports.json, missions.json)
- [ ] GitHub 레포지토리 생성 및 Vercel 연동
- [ ] 환경 변수 설정 (Claude API Key, Naver Map API Key)

### Phase 2: 코어 기능 개발 (Week 2-3)
- [ ] 온보딩 및 Mock 로그인 구현
- [ ] 메인 대시보드 레이아웃 및 데이터 연동
- [ ] 신고하기 페이지 구현
  - [ ] 이미지 업로드 UI (실제 업로드는 시뮬레이션)
  - [ ] GPS 위치 시뮬레이션
  - [ ] Claude API 연동 (AI 식별)
  - [ ] 신고 제출 및 Mock DB 저장
- [ ] Naver Map 연동 및 신고 위치 시각화

### Phase 3: 게이미피케이션 기능 (Week 4)
- [ ] 미션 시스템 구현
  - [ ] 미션 목록 페이지
  - [ ] 미션 진행률 계산 로직
- [ ] 포인트 시스템 구현
  - [ ] 신고 승인 시 포인트 지급 로직
- [ ] 랭킹 보드 구현
  - [ ] 사용자별 점수 정렬 및 표시
- [ ] 에코 도감 구현
  - [ ] 수집한 종 표시
  - [ ] 종 상세 정보 모달

### Phase 4: 관리자 기능 (Week 5)
- [ ] 관리자 대시보드 구현
- [ ] 신고 검증 페이지 구현
  - [ ] 대기중 신고 목록
  - [ ] 승인/반려 처리
  - [ ] 상태 변경 시 Mock DB 업데이트

### Phase 5: UI/UX 개선 및 테스트 (Week 6)
- [ ] 반응형 디자인 최적화 (모바일 우선)
- [ ] 로딩 상태 및 에러 처리 개선
- [ ] 전체 워크플로우 테스트
- [ ] 접근성(a11y) 개선
- [ ] 성능 최적화 (이미지 최적화, 코드 스플리팅)

### Phase 6: 배포 및 문서화 (Week 7)
- [ ] Vercel 프로덕션 배포
- [ ] README.md 작성 (프로젝트 소개, 설치 방법, 사용법)
- [ ] 사용자 가이드 작성
- [ ] 관리자 매뉴얼 작성
- [ ] 최종 테스트 및 버그 수정

-----

## 10\. 성공 지표 및 측정 (Success Metrics)

### 10.1. MVP 검증 지표 (Validation Metrics)

| 지표 | 목표 | 측정 방법 |
| :--- | :--- | :--- |
| **기술 검증** | Claude API 식별 정확도 80% 이상 | 테스트 이미지 20장으로 검증 |
| **사용성 검증** | 신고 완료까지 평균 3분 이내 | 사용자 테스트 (5명) 시간 측정 |
| **UI/UX 검증** | 모바일 반응형 100% 작동 | Chrome DevTools 및 실제 기기 테스트 |

### 10.2. 사용자 참여 지표 (Engagement Metrics)

*(실제 서비스 런칭 시 측정 가능)*

| 지표 | 목표 (파일럿 3개월) | 비고 |
| :--- | :--- | :--- |
| **월간 활성 사용자(MAU)** | 500명 | 국립생태원 방문객 중심 |
| **총 신고 건수** | 1,000건 | 승인/반려 모두 포함 |
| **승인률** | 70% 이상 | AI + 전문가 검증 효과 |
| **사용자당 평균 신고** | 2건 | 지속적 참여 유도 |
| **미션 완료율** | 40% | 게이미피케이션 효과 측정 |

### 10.3. 데이터 품질 지표 (Data Quality Metrics)

| 지표 | 목표 | 비고 |
| :--- | :--- | :--- |
| **AI 1차 판별 정확도** | 85% 이상 | Claude API 기준 |
| **전문가 검증 소요시간** | 평균 5분/건 | 관리자 워크플로우 효율성 |
| **지역 커버리지** | 전국 5개 이상 시도 | 데이터 다양성 확보 |

-----

## 11\. 리스크 관리 (Risk Management)

| 리스크 | 발생 확률 | 영향도 | 대응 방안 |
| :--- | :--- | :--- | :--- |
| **Claude API 비용 초과** | 중 | 높음 | - API 호출 횟수 제한 (사용자당 일 5회)<br>- 캐싱 전략 도입<br>- 대체 API 검토 (Google Vision AI) |
| **초기 사용자 확보 실패** | 높음 | 높음 | - 국립생태원 방문객 타겟 마케팅<br>- 현장 이벤트 (QR코드, 포인트 2배)<br>- 학교 연계 프로그램 |
| **데이터 신뢰도 저하** | 중 | 중 | - AI + 전문가 2단계 검증 강화<br>- 사용자 신뢰도 점수제 도입<br>- 명백한 허위 신고 페널티 |
| **모바일 호환성 이슈** | 낮음 | 중 | - 다양한 기기 및 브라우저 테스트<br>- Progressive Web App (PWA) 고려 |
| **개발 일정 지연** | 중 | 중 | - 매주 마일스톤 점검<br>- MVP 범위 엄격히 준수<br>- 필요시 우선순위 조정 |

-----

## 12\. 향후 확장 계획 (Future Enhancements)

*(MVP 검증 후 2027년 본사업 확장 시 고려사항)*

### 12.1. 기술적 확장
- **실제 데이터베이스 도입:** Supabase 또는 PostgreSQL 마이그레이션
- **실시간 기능:** WebSocket 기반 실시간 신고 알림
- **고급 AI 기능:**
  - 멀티모달 AI (사진 + 음성 설명)
  - 시계열 데이터 분석 (확산 예측 모델)
- **모바일 앱:** React Native 또는 Flutter 네이티브 앱 개발

### 12.2. 기능적 확장
- **소셜 기능:**
  - 친구 추가 및 팀 챌린지
  - 커뮤니티 피드
  - 사용자 간 정보 공유
- **포인트 경제:**
  - 포인트 스토어 (기념품 교환)
  - 기부 기능 (생태보전 기금)
  - 시즌 패스 시스템
- **교육 컨텐츠:**
  - 생태교란종 교육 비디오
  - 퀴즈 및 학습 모드
  - 학교 연계 커리큘럼

### 12.3. 파트너십 확장
- **타 기관 연계:**
  - 환경부, 국립공원공단 데이터 통합
  - 지자체별 지역 챌린지
  - 대학 연구기관 협력
- **에코뱅크 고도화:**
  - 시민 데이터를 에코뱅크 공식 레이어로 통합
  - 전문가 데이터와 시민 데이터 교차 검증 시스템

-----

## 13\. 부록 (Appendix)

### 13.1. 참고 자료
- [국립생태원 공식 웹사이트](https://www.nie.re.kr)
- [생태교란종 정보 - 환경부](https://www.me.go.kr)
- [Naver Map API 문서](https://navermaps.github.io/maps.js/)
- [Anthropic Claude API 문서](https://docs.anthropic.com)

### 13.2. 용어집 (Glossary)

| 용어 | 설명 |
| :--- | :--- |
| **생태교란종** | 외래종 중 생태계 균형을 심각하게 교란하는 종 (환경부 지정) |
| **MVP** | Minimum Viable Product, 최소기능제품 |
| **MAU** | Monthly Active Users, 월간 활성 사용자 |
| **게이미피케이션** | 게임이 아닌 영역에 게임 요소를 접목하는 기법 |
| **시민과학** | 일반 시민이 과학 연구에 참여하는 활동 |

### 13.3. 변경 이력 (Change Log)

| 버전 | 날짜 | 변경 내용 | 작성자 |
| :--- | :--- | :--- | :--- |
| 1.0 | 2025-11-13 | 초안 작성 완료 | 담당자명 |

-----

## 14\. 승인 및 검토 (Approval)

| 역할 | 이름 | 서명 | 날짜 |
| :--- | :--- | :--- | :--- |
| **프로젝트 매니저** |  |  |  |
| **개발 리드** |  |  |  |
| **디자인 리드** |  |  |  |
| **이해관계자** |  |  |  |

-----

**문서 끝 (End of Document)**
# 독립 UI 원격 설치와 동기화

원격: git@mua:team-muajigyeong/muajigyeong-ui.git
패키지: @muajigyeong/ui (ESM 전용, React 19)
문서: 이 저장소의 Storybook에서 관리합니다.

## 설치

앱은 Git 원격의 고정 커밋을 설치합니다. 아래 FULL_COMMIT_SHA를 실제 해시로 바꿉니다.

```bash
npm install --save-exact "git+ssh://git@mua/team-muajigyeong/muajigyeong-ui.git#FULL_COMMIT_SHA"
```

prepare가 소스에서 ESM·타입 선언·CSS를 빌드합니다. Git 설치 시 빌드용 개발
의존성도 설치됩니다. 소비 앱의 설치 환경에서 lifecycle script 실행이 필요합니다.
앱 코드에서는 기존 @muajigyeong/ui import를 그대로 사용합니다.

mua는 사용자 SSH config에 정의된 별칭입니다. 다른 개발 PC와 CI에도 같은 별칭과
읽기 권한을 구성하거나, 실제 호스트를 사용하는 접근 가능한 SSH URL로 교체해야 합니다.
비밀 키를 Git 저장소에 넣지 않습니다. npm 레지스트리 게시는 별도 작업입니다.

## 변경과 검증

1. UI 소스와 기존 주석을 보존하고, 추가 설명은 JSDoc으로 작성합니다.
2. npm run typecheck, npm run build, npm run build:docs, npm pack을 실행합니다.
3. UI 변경을 커밋하고 git push origin master로 게시합니다.
4. 앱에서 새 UI 커밋을 설치하고 package.json과 lockfile을 함께 커밋합니다.
5. 앱 타입 검사·빌드·컴포넌트 동작을 확인하고 앱 원격을 갱신합니다.

UI 푸시만으로 소비 앱이 자동 업데이트되지는 않습니다. 앱과 UI는 별도 이력이므로
각 저장소의 로컬/원격을 동기화하며, 앱은 의존성으로 선택한 UI 커밋을 지정합니다.

## 문서 사이트

npm run storybook으로 로컬 문서를 실행합니다.
npm run build:docs 결과는 storybook-static에 생성되며 별도로 호스팅할 수 있습니다.
현재 작업은 Git 원격 게시와 앱 소비 전환이며 npm 또는 문서 사이트의 공개 배포는 아닙니다.

## 최신화 기록 — 2026-11-02

- DatePicker 0.5.1의 폼·키보드·초점 복귀·작은 화면 보완, 0.5.2의 시작일/종료일별 열기, 0.5.3의 `Escape(ESC)` 안내를 기존 Storybook과 문서에 반영했다. 기능 커밋 `c7343ee2f9afa6c21b69552966e4e5abbbffcf68`은 이미 `origin/master`에 게시되어 있다.
- 이번 최신화는 기능 코드 변경 없이 기존 문서에 최종 앱 연결 상태와 검증 기록을 보충한다. 문서 갱신만으로 패키지 버전을 올리지 않는다.
- 소비 앱은 위 기능 커밋을 계속 고정한다. `package.json`과 `package-lock.json`에 같은 커밋을 사용하며 이번 문서 기록 커밋과는 구분한다.
- 앱에서는 네이티브 날짜 입력을 유지하며 각 입력의 작은 달력 버튼으로 DatePicker를 연다. 앱 업무 규칙과 저장 검사는 앱에, 달력 UI와 키보드 처리는 패키지에 둔다.
- 공용 Accordion의 `headingLevel` 옵션과 기존 Storybook 예제는 유지한다. 컴포넌트 설명은 기존 Docs/JSDoc을 사용하며 별도 중복 사용법 화면은 만들지 않는다.
- UI는 현재 작업 브랜치에서 검증한 커밋을 `git push origin HEAD:master`로 반영하고 원격 SHA를 대조한다. 앱 저장소는 별도이며 앱의 최신화 규칙에 따라 반영한다.
- 최신화 직전 `npm run typecheck`, `npm run build`, `npm run build:docs`를 다시 실행해 모두 통과했다. Storybook에서 기존 `use client` 번들 경고·문서 컨테이너 docgen 제외·큰 청크 안내가 출력됐지만 빌드는 완료됐으며 실제 배포 패키지의 `use client` 지시문은 유지된다. 이번 문서 정리에서는 브라우저 검사를 다시 실행하지 않았고 앞선 구현 단계의 결과와 구분한다.

## 검증 기록 — 2026-09-10

실제 SSH 원격에서 고정 커밋 설치와 prepare 빌드를 확인했습니다.
독립 문서의 JSX 자동 변환 설정을 루트 tsconfig.json에서 연결했습니다.
타입 검사, 문서 빌드, 네 컴포넌트의 브라우저 조작과 Autodocs 표시가 통과했습니다.
소비 앱에서도 원격 패키지를 사용한 프로덕션 빌드 및 FAQ 아코디언의
클릭·키보드 동작을 확인했습니다.

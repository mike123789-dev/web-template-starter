## n3r 배포용 설정 (web-template-starter)

이 프로젝트는 **n3r에서 Sandbox app(개발용) → Linked app(상위 환경)** 흐름으로 배포할 수 있도록 컨테이너 구성이 되어 있습니다.

### 전제

- **컨테이너 포트**: `3000`
- **헬스 체크**: `GET /api/health` (200이면 정상)
- **앱 유형 권장**: Stateless (기본 웹앱)

### 소스 저장소 권한

n3r에서 저장소가 목록에 보이지 않으면, 보통 아래 중 하나가 필요합니다.

- n3r과 연동된 GitHub에서 **현재 사용자에게 admin 권한이 있는 저장소**인지 확인
- 또는 n3r UI에서 **SSH 주소 + deploy key(private key)** 를 직접 입력해 연결

### Dockerfile

`Dockerfile`은 n3r 환경과 동일한 패턴을 따릅니다.

- 내부 베이스 이미지 사용: `snow.n3r.reg.navercorp.com/base/alpine/node:22.17.0`
- 멀티 스테이지 빌드: `deps` → `builder` → `runner`
- Next.js `output: "standalone"` 결과물을 런타임에 사용
- 런타임은 non-root(`nextjs`)로 실행
- 실행 커맨드: `node server.js`

### Sandbox app 생성 (dev 존)

n3r 콘솔에서 Apps → Create로 들어가서 아래 값으로 생성합니다.

- **Linked app**: 체크하지 않음 (Sandbox)
- **Zone**: dev 존 선택
- **Repository**: 이 GitHub 저장소 선택
- **Build branch/tag**: 보통 `main` (또는 배포용 브랜치)
- **Mode**:
  - 개발 중이면 `Active` 권장 (빌드 후 바로 배포)
  - 빌드만 필요하면 `Build only`
- **Stateful**: 끔 (Stateless)
- (선택) **deploy on creation**: 생성 직후 빌드/배포 원하면 켬

생성 후에는 Spec 탭에서 Save/Update/Deploy 버튼으로 빌드/배포를 트리거할 수 있습니다.

### Linked app 생성 (test/prod 존)

상위 환경 배포를 위해 Linked app을 생성합니다.

- **Linked app**: 체크함
- **Zone**: test/prod에 해당하는 존 선택
- **Target app**: 위에서 만든 Sandbox app 선택 (배포 완료 상태)
- **Stateful**: 기본은 끔 (Stateless)

Linked app은 **Sandbox app에서 성공적으로 빌드된 이미지**만 배포할 수 있습니다.

### 로컬에서 헬스 체크 확인

개발 서버 또는 컨테이너 실행 후 아래 URL이 200을 반환해야 합니다.

- `http://localhost:3000/api/health`


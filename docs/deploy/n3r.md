## n3r 배포용 설정 (web-template-starter)

이 프로젝트는 **n3r에서 Sandbox app(개발용) → Linked app(상위 환경)** 흐름으로 배포할 수 있도록 컨테이너 구성이 되어 있습니다.

### 전제

- **컨테이너 포트**: `80`
- **헬스 체크**: `GET /api/health` (200이면 정상)
- **앱 유형 권장**: Stateless (기본 웹앱)

### 소스 저장소 권한

n3r에서 저장소가 목록에 보이지 않으면, 보통 아래 중 하나가 필요합니다.

- n3r과 연동된 GitHub에서 **현재 사용자에게 admin 권한이 있는 저장소**인지 확인
- 또는 n3r UI에서 **SSH 주소 + deploy key(private key)** 를 직접 입력해 연결

### 빌드 (요약)

- **n3r.app은 Dockerfile로만 이미지를 빌드**합니다. 앱 빌드까지 포함해 **Dockerfile에서 multi-stage build로 끝나야** 합니다.
- 앱 갱신 시 빌드 설정이 동일하면, 이전 빌드 이미지를 재사용할 수 있습니다. (브랜치/태그가 가리키는 커밋이 바뀌면 다시 빌드됨)
- 필요 시 **Force build** 또는 **클린 빌드**(캐시 삭제 후 빌드)로 강제 재빌드할 수 있습니다.

#### 베이스 이미지 / 레지스트리

- 베이스 이미지는 public 또는 프로젝트의 `n3r.registry`에 업로드한 이미지를 사용할 수 있습니다.
- 이 프로젝트는 `docs/deploy/app-sample-nodejs-main` 레퍼런스와 동일하게, 기본값으로 내부 레지스트리의 Node 이미지를 사용합니다.
  - `hub.reg.navercorp.com/library/node:slim`

#### npm registry

레퍼런스와 동일하게 `npm ci`는 기본적으로 아래 registry를 사용합니다.

- `https://artifactory.navercorp.com/artifactory/npm-remote/`

환경에 따라 다른 registry를 써야 하면 n3r Build args로 `NPM_REGISTRY`를 지정하세요.

#### 빌드 인자 (Build args)

n3r.app은 기본 빌드 인자를 제공합니다.

- `N3R_BUILD_COMMIT_HASH`
- `N3R_BUILD_COMMIT_REFERENCE`
- `N3R_BUILD_NUMBER`

원하면 위 값을 `Dockerfile`에서 `ARG`로 받아서 빌드 결과물에 버전 정보를 심는 방식으로 확장할 수 있습니다.
이 프로젝트는 위 값을 최종 이미지의 환경변수(`N3R_BUILD_*`)로 보존합니다.

### Dockerfile

`Dockerfile`은 n3r 환경과 동일한 패턴을 따릅니다.

- 내부 베이스 이미지 사용: `hub.reg.navercorp.com/library/node:slim`
- 멀티 스테이지 빌드: `builder` → `runner`
- BuildKit 캐시 마운트로 `npm` 캐시를 유지 (빌드 시간 단축)
- Next.js `output: "standalone"` 결과물을 런타임에 사용
- 런타임은 non-root(`irteam`, uid/gid 500)로 실행
- low port(80) 바인딩을 위해 `setcap cap_net_bind_service` 적용
- 실행 커맨드: `node server.js`

### 배포 (요약)

- Stateless 앱은 보통 **Rolling Update / Blue Green / Canary(또는 Replicas Based Canary)** 전략을 사용합니다.
- Stateful로 생성하면 **Stateful Rolling Update**를 사용합니다.
- 배포 **취소/실패** 시 구/신 리비전 팟이 섞여 남을 수 있어, 필요하면 **Cleanup**으로 stable 리비전 기준 정리가 가능합니다.

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

- `http://localhost:3000/api/health` (로컬은 `docker-compose.yml`에서 `3000:80`으로 포트 매핑)


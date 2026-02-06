# Google OAuth 설정 가이드

Google OAuth를 사용하여 로그인하려면 Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성해야 합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 동의 화면 설정
1. 왼쪽 메뉴에서 **APIs & Services** > **OAuth consent screen** 선택
2. User Type: **External** 선택 후 **Create**
3. 필수 정보 입력:
   - App name: 앱 이름
   - User support email: 지원 이메일
   - Developer contact information: 개발자 이메일
4. **Save and Continue**

### 1.3 OAuth 클라이언트 ID 생성
1. 왼쪽 메뉴에서 **APIs & Services** > **Credentials** 선택
2. **+ CREATE CREDENTIALS** > **OAuth client ID** 클릭
3. Application type: **Web application** 선택
4. Name: 클라이언트 이름 입력
5. **Authorized JavaScript origins** 추가:
   - `http://localhost:3000`
   - (배포 시) `https://your-domain.com`
6. **Authorized redirect URIs** 추가:
   - `http://localhost:3000/api/auth/callback/google`
   - (배포 시) `https://your-domain.com/api/auth/callback/google`
7. **Create** 클릭

### 1.4 클라이언트 ID와 Secret 복사
- 생성된 **Client ID**와 **Client Secret**을 복사하여 `.env.local` 파일에 저장

## 2. 환경 변수 설정

`.env.local` 파일을 열어 다음 값을 입력하세요:

```env
# NextAuth.js Configuration
AUTH_SECRET="실제로-사용할-비밀-키를-여기에-입력하세요"

# Google OAuth Credentials (NextAuth v5 naming convention)
AUTH_GOOGLE_ID="여기에-Google-Client-ID-입력"
AUTH_GOOGLE_SECRET="여기에-Google-Client-Secret-입력"

# Application URL
NEXTAUTH_URL="http://localhost:3000"
```

### 2.1 AUTH_SECRET 생성
터미널에서 다음 명령어를 실행하여 랜덤 secret 생성:

```bash
openssl rand -base64 32
```

생성된 값을 `AUTH_SECRET`에 입력하세요.

## 3. 배포 시 설정

프로덕션 환경에 배포할 때:

1. Google Cloud Console에서 **Authorized redirect URIs**에 프로덕션 URL 추가:
   - `https://your-domain.com/api/auth/callback/google`

2. 환경 변수 설정:
   ```env
   AUTH_SECRET="your-production-secret"
   AUTH_GOOGLE_ID="your-client-id"
   AUTH_GOOGLE_SECRET="your-client-secret"
   NEXTAUTH_URL="https://your-domain.com"
   ```

## 4. 테스트

1. 개발 서버 시작:
   ```bash
   pnpm dev
   ```

2. 브라우저에서 `http://localhost:3000` 접속
3. 로그인 모달에서 Google 버튼 클릭
4. Google 계정으로 로그인

## 문제 해결

### "redirect_uri_mismatch" 오류
- Google Cloud Console의 **Authorized redirect URIs**와 실제 콜백 URL이 정확히 일치하는지 확인
- URL 끝에 슬래시(`/`)가 없는지 확인

### "invalid_client" 오류
- `.env.local` 파일의 `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET`이 정확한지 확인
- 개발 서버를 재시작하여 환경 변수가 로드되었는지 확인

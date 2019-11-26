# Tiny Jam Live

소규모 인원을 위한 유사 잼라이브

## Stack

- TypeScript@3.7.x
- Node.js@10.15.x
- Next.js@9.x
- Firebase
- Ant.design

## 개발 방법

### 준비
> Firebase 계정이 필요함
개발 폴더 상단에 `.env` 파일을 추가하고 아래 정보를 등록한다. 정보는 Firebase 생성 시 획득할 수 있다.

```
privateKey=-----BEGIN PRIVATE KEY-----\n__your_key__\n-----END PRIVATE KEY-----\n
clientEmail=__your_email__
projectId=__your_project_id__
databaseurl=__your_db_url__
```

### 개발 모드 실행

npm 패키지 설치 후 아래 명령 실행

```
npm run dev
```
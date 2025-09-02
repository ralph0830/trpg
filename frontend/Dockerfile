# Node.js 22 Alpine 이미지 사용
FROM node:22-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Vite 개발서버가 수신할 포트
EXPOSE 5173

# Vite 개발서버를 모든 인터페이스에서 접근 가능하도록 실행
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
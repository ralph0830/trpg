# Node.js 22 Alpine 이미지 사용
FROM node:22-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (개발 모드에서는 devDependencies도 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# 컨테이너가 수신할 포트
EXPOSE 3002

# 애플리케이션 실행
CMD ["npm", "start"]
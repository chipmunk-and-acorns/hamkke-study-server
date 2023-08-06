# 노드 이미지를 기반으로 새 이미지 생성
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json을 컨테이너 내 /app 폴더에 복사
COPY package*.json ./

# 프로젝트 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

RUN npm run build

# 서버 포트 설정
EXPOSE 8080

# 서버 실행
CMD ["npm", "run", "docker"]

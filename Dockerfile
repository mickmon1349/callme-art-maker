FROM node:20-alpine AS build-stage

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json，並安裝依賴套件
COPY package*.json ./
RUN npm install

# 複製所有專案檔案
COPY . .

# 執行 React 應用程式的建置
# 這會將靜態檔案輸出到 build/ 目錄
RUN npm run build

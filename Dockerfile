# 第一階段：建置 React 應用程式
# 使用一個 Node.js 映像作為建置環境
FROM node:20.8.0-alpine AS build-stage
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

# ---
# 第二階段：建立輕量級的 Nginx 映像來提供靜態內容
FROM nginx:alpine

# 複製第一階段建置好的靜態檔案到 Nginx 的預設服務目錄
COPY --from=build-stage /app/build /usr/share/nginx/html

# 暴露 80 port，讓容器可以被外部存取
EXPOSE 80

# 啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
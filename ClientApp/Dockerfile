# Stage 1: Build the application
FROM node:16 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY ClientApp/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY ClientApp/ ./

# Собираем проект
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Копируем билдованные файлы из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]

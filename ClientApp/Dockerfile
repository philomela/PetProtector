
# Stage 1: Build the application
FROM node:16 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY ClientApp/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY ClientApp/ ./

# Собираем проект
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Копируем билдованные файлы из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомную конфигурацию Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./petprotector.ru.crt /etc/ssl/certs/petprotector.ru.crt
COPY ./petprotector.ru.key /etc/ssl/private/petprotector.ru.key

# Экспонируем порты 80 и 443 для HTTP и HTTPS
EXPOSE 80
EXPOSE 443

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]

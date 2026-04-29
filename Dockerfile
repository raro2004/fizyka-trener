# Statyczny serwer dla Trenera Fizyki
FROM nginx:alpine

# Skopiuj pliki aplikacji
COPY public/ /usr/share/nginx/html/

# Skopiuj konfigurację
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck endpoint
RUN echo "OK" > /usr/share/nginx/html/health

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

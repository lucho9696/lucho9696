FROM php:8.3-cli-alpine

WORKDIR /app

# Sin dependencias de Composer: el backend usa solo la librería estándar de PHP.
COPY . /app

# Varios workers del servidor embebido para atender requests en paralelo.
ENV PHP_CLI_SERVER_WORKERS=4

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public", "public/index.php"]

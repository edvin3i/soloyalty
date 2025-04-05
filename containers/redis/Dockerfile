FROM alpine:3.19

ARG DJ_REDIS_PASSWORD

RUN apk update && apk upgrade && apk add --no-cache redis vim && \
    sed -i "s|bind 127.0.0.1|#bind 127.0.0.1|g"  /etc/redis.conf && \
    sed -i "s|# maxmemory <bytes>|maxmemory 32mb|g"  /etc/redis.conf && \
    sed -i "s|# requirepass foobared|requirepass $DJ_REDIS_PASSWORD|g"  /etc/redis.conf && \
    echo "maxmemory-policy allkeys-lru" >> /etc/redis.conf

EXPOSE 6379

CMD [ "redis-server", "/etc/redis.conf" ]
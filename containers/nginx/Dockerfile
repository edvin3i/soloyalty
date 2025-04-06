# build react app
FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app


# copy package.json and package-lock.json
COPY srcs/frontend/soltyfront/pnpm-lock.yaml ./
COPY srcs/frontend/soltyfront/package.json ./

RUN pnpm install --frozen-lockfile

# copy all code
COPY srcs/frontend/soltyfront .

# build app and move compiled code to build dir
RUN pnpm run build

# final image
FROM alpine:3.19


RUN apk update && apk upgrade && apk add --no-cache nginx

COPY containers/nginx/certificates/gbreana.42.fr.crt /etc/nginx/ssl/
COPY containers/nginx/certificates/gbreana.42.fr.key /etc/nginx/ssl/
COPY containers/nginx/config/gbreana.42.fr.conf /etc/nginx/sites-available/

RUN rm -rf /etc/nginx/http.d/default.conf && \
    ln -s /etc/nginx/sites-available/gbreana.42.fr.conf /etc/nginx/http.d/

# COPY --from=builder /app/.next /var/www/.next
# COPY --from=builder /app/public /var/www/public
# COPY --from=builder /app/package.json /var/www/
# COPY --from=builder /app/node_modules /var/www/node_modules

# copy bulded files
COPY --from=builder /app/out /var/www/build

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

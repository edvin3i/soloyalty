FROM alpine:3.19

RUN apk update && apk upgrade && apk add --no-cache nginx


COPY containers/nginx/certificates/gbreana.42.fr.crt /etc/nginx/ssl/
COPY containers/nginx/certificates/gbreana.42.fr.key /etc/nginx/ssl/
COPY containers/nginx/config/gbreana.42.fr.conf /etc/nginx/sites-available/

RUN rm -rf /etc/nginx/http.d/default.conf && \
    ln -s /etc/nginx/sites-available/gbreana.42.fr.conf /etc/nginx/http.d/
    

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
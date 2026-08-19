FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html

ENV PORT=8080
ENV NGINX_ENVSUBST_FILTER=^PORT$
EXPOSE 8080

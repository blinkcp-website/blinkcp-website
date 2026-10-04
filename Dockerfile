FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html

# `COPY .` above sweeps the whole repo into the web root, so the build files
# end up served publicly (https://blinkcp.com/Dockerfile returned 200 before
# this). They can't just go in .dockerignore: nginx.conf.template is needed by
# the COPY above it, and excluding it broke the build once already (f5a356c).
# Drop them from the web root after the copy instead.
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf.template \
          /usr/share/nginx/html/cloudbuild.yaml

ENV PORT=8080
ENV NGINX_ENVSUBST_FILTER=^PORT$
EXPOSE 8080

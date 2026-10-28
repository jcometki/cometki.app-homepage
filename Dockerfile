FROM nginx:stable-alpine@sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/index.html
COPY experimentar /usr/share/nginx/html/experimentar
COPY assets /usr/share/nginx/html/assets
COPY deploy/versionar-assets.sh /tmp/versionar-assets.sh
RUN sh /tmp/versionar-assets.sh && rm /tmp/versionar-assets.sh

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/saude || exit 1

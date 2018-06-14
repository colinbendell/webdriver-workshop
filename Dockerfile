FROM alpine:latest
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

RUN apk update
RUN apk upgrade
RUN apk add git \
            openssh \
            nodejs-current \
            yarn \
            xvfb \
            zlib-dev \
            xvfb \
            wait4ports \
            xorg-server \
            dbus \
            ttf-freefont \
            mesa-dri-swrast \
            grep \
            udev \
            chromium-chromedriver \
            chromium
RUN apk add supervisor && \
    mkdir /etc/supervisor.d

RUN adduser -D chrome
RUN echo $'[program:chromedriver] \n\
command=/usr/bin/chromedriver \n\
priority=10 \n\
user=chrome \n\
directory=/home/chrome \n\
environment=HOME="/home/chrome" \n\
redirect_stderr=true \n\
stdout_logfile=/var/log/chromedriver.log \n\
stdout_logfile_backups=4 \n\
stdout_logfile_maxbytes=10MB \n\
stderr_logfile=NONE \n\
[program:keepalive] \n\
command=/bin/sh -c "echo Keep Alive service started... && tail -f /dev/null" \n\
autostart=true \n\
autorestart=true \n\
redirect_stderr=true \n\
stdout_logfile=/var/log/keepalive-stdout.log \n\
stdout_logfile_maxbytes=1MB \n\
stderr_logfile=NONE \n\
'>/etc/supervisor.d/chromedriver.ini

RUN echo $'#!/bin/sh\nset -e; /usr/bin/supervisord -c /etc/supervisord.conf; exec "$@";' > /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

#CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/bin/sh"]

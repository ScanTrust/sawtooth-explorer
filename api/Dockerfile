FROM node:lts-jessie

COPY ./entrypoint.sh /entrypoint/

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Copy or mount node app here
WORKDIR /api

EXPOSE 3000

ENTRYPOINT ["sh","/entrypoint/entrypoint.sh"]

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm run serve

FROM node:16-alpine AS deps
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app
RUN npm install
copy ./ /usr/src/app
EXPOSE 8080
RUN echo ""
CMD ["node","./dist/index.js"]
FROM library/node:16.3.0-alpine
RUN apk update && apk upgrade && apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app
ARG IMGBB_API_KEY
ARG BUILD_MONGO_URL
ENV MONGO_URL=$BUILD_MONGO_URL
ENV NODE_ENV production
RUN npm install --production && npm cache clean --force && npm run build --if-present
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]

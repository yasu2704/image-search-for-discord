FROM node:16-alpine AS build
WORKDIR /app
COPY . /app

RUN yarn install --frozen-lockfile && \
    yarn build

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile --prod

ENTRYPOINT node /app/dist/index.js

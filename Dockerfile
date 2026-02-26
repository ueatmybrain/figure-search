FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retries 5 \
    && npm install --prefer-online --no-audit --no-fund
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
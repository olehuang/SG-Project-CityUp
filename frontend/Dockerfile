FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src .
RUN npm run build


# === runtime stage===
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .

EXPOSE 80
CMD ["nginx","-g","daemon off;"]



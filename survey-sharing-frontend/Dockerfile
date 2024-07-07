FROM node:21 AS build
WORKDIR /app
RUN apt update && apt install tzdata
ENV TZ=Europe/Rome
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/survey-sharing-frontend /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
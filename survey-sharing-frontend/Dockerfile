FROM node:21
RUN npm install -g @angular/cli
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
CMD ng serve --host 0.0.0.0 --port 4200
EXPOSE 4200
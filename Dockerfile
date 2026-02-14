# Build the React app
FROM node:20 AS build
ARG VITE_BACKEND_URL=http://localhost:8080/api/v1
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .

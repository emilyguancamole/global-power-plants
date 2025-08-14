## Build app
# alias for multi-stage builds
FROM node:20 AS build 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# build the production-ready static files - no need to ship dev dependencies, node_modules, or build tools to production.
RUN npm run build

## Serve via Nginx
FROM nginx:stable-alpine
# copy only the build output - the static files
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx base image listens on port 80 by default
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]

# multi-stage images: Node, then Nginx
# nginx serves static files (compiled https/css/js), not the actual js source
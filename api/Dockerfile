FROM node:20
WORKDIR /app
# install dependencies
COPY package*.json ./
RUN npm install
# Copy app code
COPY . .
# compile ts to js
RUN npm run build

EXPOSE 3000
# run "start" script in package.json
CMD ["npm", "start"]
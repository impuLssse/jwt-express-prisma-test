FROM node

COPY . ./app

CMD ["cd app",  "npm i", "npm run start"]

EXPOSE 3000 3001
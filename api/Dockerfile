# api/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência primeiro (cache mais eficiente)
COPY package*.json ./

RUN npm install

# Copia o restante do código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
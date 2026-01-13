FROM node:22-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluye dev)
RUN npm install

# Copiar código
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]

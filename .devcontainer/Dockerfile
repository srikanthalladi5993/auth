FROM mcr.microsoft.com/devcontainers/javascript-node:20

WORKDIR /workspaces/auth

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["sleep", "infinity"]

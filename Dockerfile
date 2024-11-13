# Wybieramy oficjalny obraz Node.js
FROM node:18

# Ustawiamy katalog roboczy w kontenerze na /app
WORKDIR /app

# Kopiujemy tylko pliki package.json oraz package-lock.json
COPY package*.json ./

# Instalujemy nodemon globalnie
RUN npm install -g nodemon

RUN npm install -g multer

# Kopiujemy pliki projektu do kontenera
COPY . .

# Instalujemy zależności projektu (bez nodemon)
RUN npm install

# Otwieramy port 3000, na którym nasza aplikacja będzie działać
EXPOSE 3000

# Uruchamiamy aplikację za pomocą nodemon
# CMD ["nodemon", "server.js"]
CMD ["npm", "run", "dev"]

# We chose node-14 since currently firebase functions work on node-14
# As from now node-16 is currently in beta for firebase functions
# But if you want to run the beta you can change node:14-alpine to node:16-alpine
# https://firebase.google.com/docs/functions/manage-functions#set_nodejs_version
FROM openjdk:11

# Instala Node.js
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install the firebase cli
RUN npm install -g firebase-tools

# Install and setup all the Firebase emulators
RUN firebase setup:emulators:database
RUN firebase setup:emulators:firestore
RUN firebase setup:emulators:storage
RUN firebase setup:emulators:ui

# Mount your firebase project directory to /app when running the container
# This is the folder containing the firebase.json
WORKDIR /firebase-emulator

# Copia los archivos de configuración de Firebase al contenedor
COPY firebase.json .
COPY firestore.rules .
COPY firestore.indexes.json .
COPY storage.rules .

# Expose the emulator ports
# If you use non standard ports change them to the ones in your firebase.json
#       AUTH  FUNC   STORE   FIRE    UI   emulator ports
EXPOSE 9099 5001 8081 5002 9199 4000 4400 4500 9150 5007

# When startup of the container is complete this is the command that will be executed
# In our case we want to start the firebase emulator suite
CMD ["firebase", "emulators:start", "--project", "retlab-dev"]

FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN apt-get update && \
    apt-get -y install python-pip

RUN pip install -r requirements.txt

RUN chmod +x ./entrypointscript.sh

ENTRYPOINT ["./entrypointscript.sh"]

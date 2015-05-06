FROM iojs:onbuild

RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install -y ruby
RUN gem install sass

RUN mkdir /app

RUN npm install gulp -g

WORKDIR /app
ADD package.json /app/package.json
RUN npm install

EXPOSE 8000

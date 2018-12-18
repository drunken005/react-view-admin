FROM node:9.11.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY ./package.json /usr/src/app/

RUN npm i yarn -g \
&& yarn install \
&& yarn add @types/react-router-dom \
&& yarn add @types/react-router

# Bundle app source
COPY . /usr/src/app
ENV PORT=3000
ENV NODE_ENV=production
ENV REACT_APP_RESTFUL=
ENV REACT_APP_RESTFUL_KEY=CXP-2V7LIL815RCQOGJ6FJ5BG15A86AD9X1XHTQ1G6L84CM9LB1SRSGRCWYAZYYON5HD

RUN npm run build

CMD ["node", "index.js"]


EXPOSE 3000
~       
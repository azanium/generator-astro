
# Astro ExpressJS ES2017 RESTful Project Generator

Yeoman generator for building RESTful APIs and microservices using Node.js, ExpressJS and Docker support.

## Features

 - No transpilers, just vanilla javascript
 - ES2017 latest features like Async/Await
 - CORS enabled
 - Uses [yarn](https://yarnpkg.com)
 - Express 
 - Consistent coding styles with [editorconfig](http://editorconfig.org)
 - [Docker](https://www.docker.com/) support
 - Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
 - Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
 - Request validation with [joi](https://github.com/hapijs/joi)
 - Gzip compression with [compression](https://github.com/expressjs/compression)
 - Linting with [eslint](http://eslint.org) with [eslint-config-astro](https://www.npmjs.com/package/eslint-config-astro) 
 - Tests with [jest](https://jestjs.io/) along with coverage
 - Git hooks with [husky](https://github.com/typicode/husky) 
 - Logging with [winston](https://www.npmjs.com/package/winston), and [winston-cloudwatch](https://github.com/lazywithclass/winston-cloudwatch) for production log stream
 - API documentation geratorion with [apidoc](http://apidocjs.com)
 - Monitoring with [pm2](https://github.com/Unitech/pm2)
 - Startup boot tasks that can be used for data migrations or pre startup task runner.

## Requirements

 - [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

Install:
```bash
npm install -g yo generator-astro
```

Generate a new project:

```bash
yo astro
```

Generate a new API:

```
yo astro:api
```

Generate a new middleware:

```
yo astro:middleware
```

Generate a new service:

```
yo astro:service
```

Generate a new utility:

```
yo astro:util
```

Generate a new boot task:

```
yo astro:boot
```

Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn start
```

## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Jest with coverage
yarn test

# run unit tests
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch
```

## Validate

```bash
# run lint and tests
yarn validate
```

## Logs

```bash
# show logs in production
pm2 logs
```

## Documentation

```bash
# generate and open api documentation
yarn docs
```

## Docker

```bash
# run container locally
yarn docker:dev
or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# run container in production
yarn docker:prod
or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# run tests
yarn docker:test
or
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

## License

[MIT License](README.md) - [Suhendra Ahmad](https://github.com/azanium)


# Astro Generator

Yeoman generator for building RESTful APIs and microservices using Node.js, ExpressJS and Docker support, and fullstack service with ReactJS, Redux, and Redux Observable.
Astro Generator was designed to be scalable on containerized environment like Kubernetes, and designed to be enterprise ready.
The principle of the project structure is isolation, so multiple developers can work on the same project without high dependency.

## Technology Stack Supported
 - ExpressJS project, with vanilla javascript, this is suitable for creating service only project.
 - ReactJS Fullstack Project, this is for creating web app using Server Side Rendering.

## Client Features (Only for Fullstack)
 - Transpiler with [Babel 6](https://babeljs.io/)
 - Rendering with [reactjs](https://reactjs.org/)
 - Component Styling with [styled-components](https://www.styled-components.com/)
 - State management with [Redux](https://redux.js.org/)
 - Redux Middleware with [redux-observable](https://redux-observable.js.org/)
 - Reactive Programming for redux-observable with [rxjs](https://github.com/ReactiveX/rxjs)
 - Routing with [react-router](https://github.com/ReactTraining/react-router)
 - Redux Routing with [react-router-redux](https://github.com/reactjs/react-router-redux)
 - Server side Routing with [react-router-dom](https://www.npmjs.com/package/react-router-dom)
 - Module bundling with HMR using [webpack](https://webpack.js.org/)
 - React DOM Testing with [react-testing-library](https://github.com/kentcdodds/react-testing-library)
 - Optional React Testing with [enzyme](https://airbnb.io/enzyme/)

## Server Features

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
 - ORM using Sequelize (optional) [sequelize](http://docs.sequelizejs.com/) with docker-compose migrations
 - HTTP using axios with retry [axios](https://github.com/axios/axios)

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
Choose your project, either service or fullstack

### Client Side Generator

Generate a new component
```
yo astro:component
```
Upon creation on a component, a new component folder will be created on `src/components`, and entries will be injected on the following files:
  - `src/client/ducks/routers.js`
  - `src/client/ducks/epics.js`
  - `src/client/ducks/reducers.js`

### Server Side Generator

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

## Sequelize Migrations (optional)

```bash
yarn db:migrate

# to undo the migration

yarn db:migrate:undo
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

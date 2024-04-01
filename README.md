# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Docker image
- Image of the application [Home-library](https://hub.docker.com/repository/docker/edwardbru/nodejs2024q2-service-app/general)

## Downloading

```
git clone git@github.com:EduardBrukish/nodejs2024Q1-service.git
```

## Go to the project folder

```
cd nodejs2024Q1-service
```

## Go to the development branch

```
git checkout logging-auth
```

## Installing NPM modules

```
npm install
```

## Create .env file in the root folder 

```
Create .env file or delete extension from .env.example
```

## Running application

```
open Docker Desktop
```

in terminal run command
```
docker compose build
```

after build, run command
```
docker compose up
```
after container is running, you should migrate the db instances
in the terminal run command

```
npm run migrate
```

After starting the app on port (4000 as default, or check value of the port in the .env file) you can open
in your browser OpenAPI documentation by typing exmp: http://localhost:4000/api
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

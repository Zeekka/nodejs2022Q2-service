# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
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

# Как запустить

### Если запускаешь приложение в Docker
1) Создаешь Dockerfile в корне проекта с таким содержимым
```
FROM node:16-alpine
WORKDIR /app
```
2) Билдишь образ контейнера `docker build -t nodejs_task6 .`
3) Рапускаешь контейнер и входишь в консоль `docker run --network host -v $(pwd):/app nodejs_task6 sh`
4) Со втрого терминала тоже заходишь в консоль `docker exec -it <id контейнера> sh`

### Если не юзаешь Docker
1) Выполняешь `npm install`
2) Создаешь из `.env.example` просто `.env`, где указываешь свои параметры PORT
3) Запускаешь прилагу `npm start`
4) Запускаешь тесты `npm test` и за каждый пройтенный тест ставишь 10 баллов

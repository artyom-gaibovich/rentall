# Проект по недвижимости. Rentall

## Инструкция по локальному развертыванию


- Убедитесь что у вас установлен Node.js версии v12.11.0
```bash
nvm install 12.11.0
node --version
```
- Переключитесь на версию Node.js v12.11.0
```bash
nvm use 12.11.0
```
- Уберитесь, что у вас заполнены все .env переменные в соответсвтии с .env.sample

- Установка зависимостей производится с помощью yarn
```bash
yarn install --frozen-lockfile
```
- Запуска проекта в продакшене
```bash
yarn run build -- --release
node build/server.js
```

- Запуск проекта в dev режиме

```bash
yarn run start
```

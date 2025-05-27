# Kinda-Messenger

This project is designed to practice working with asynchronous data. The main parts of this project is Socket IO and RTK query.

## Getting started

Project contains frontend and backend parts (used node express).

To install all dependencies run
```cmd
npm i
```

To start front server run:

```cmd
npm run dev
```

To start backend server run:

```cmd
cd backend
node index.cjs
```

## Usage notes

There are two users by default - Guest and Incognito. You can login via one of them or use your own user by texting username on login page.

Enable two themes - light (default) and dark.

Change const BACKEND_URL if you host express service on different domain/port.
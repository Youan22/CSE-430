# SafeMeds

SafeMeds is a single-page application for managing a simple medication list. It follows the **MEAN** stack: **M**ongoDB, **E**xpress, **A**ngular, and **N**ode.js.

## Features

- List medications with name, dosage, frequency, and start date
- **Create**, **read**, **update**, and **delete** medications (full CRUD)
- Angular **components** (list, form, page shell) and an Angular **service** that talks to the REST API
- Data persisted in **MongoDB** (recommended: MongoDB Atlas)

## Project layout

| Path | Purpose |
|------|---------|
| `client/` | Angular 19 SPA (`ng serve` on port 4200) |
| `server/` | Express API with Mongoose (`PORT` defaults to 3000) |
| `docker-compose.yml` | Optional local MongoDB (port 27017) |

## Prerequisites

- **Node.js** (LTS recommended) and npm
- A **MongoDB** database (Atlas connection string, or Docker for local MongoDB)

## Setup

1. **Install dependencies** (from the repository root):

   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

2. **Configure the API environment** — copy the example env file and add your MongoDB URI:

   ```bash
   npm run mean:setup
   ```

   Edit `server/.env` and set `MONGODB_URI` (see comments in `server/.env.example`).  
   Do **not** commit `server/.env`; it is listed in `.gitignore`.

3. **Optional: local MongoDB with Docker**

   ```bash
   npm run mean:db
   ```

   Then in `server/.env` you can use:

   `MONGODB_URI=mongodb://127.0.0.1:27017/safemeds`

## Running the app

From the **repository root**:

| Command | What it runs |
|---------|----------------|
| `npm run mean:dev` | API and Angular together (recommended for development) |
| `npm run api` | Express API only (`http://localhost:3000`) |
| `npm run angular` | Angular dev server only (`http://127.0.0.1:4200`) |

During `ng serve`, the client proxies `/api` to the API (see `client/proxy.conf.json`), so the browser calls the same origin for API requests.

**Health check:** `GET http://localhost:3000/api/health`

**Medications API:** base path `/api/medications` (list, get by id, create, update, delete).

## Production build (client)

```bash
npm --prefix client run build
```

Static output is under `client/dist/`. Point `environment.prod.ts` at your deployed API URL if the API is not on `localhost:3000`.

## Optional: CORS

If the Angular app is served from a different origin than in development, set `CLIENT_ORIGIN` in `server/.env` to that origin (the server allows `http://localhost:4200` and `http://127.0.0.1:4200` by default).

## Author / course

Built for **Web Full-Stack Development** (WDD/CSE 430) — MEAN stack SPA with CRUD over application data.

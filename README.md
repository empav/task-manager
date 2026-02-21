# Task Manager

## Project overview

Task Manager is a full-stack web app for organizing tasks. It provides a simple UI to create, track, and manage tasks, backed by a REST API and a database. The repository includes:

- `frontend/`: React-based UI.
- `backend/`: fastAPI service.
- `docker-compose.yml`: Local orchestration for the stack.

## Installation and run instructions

### Option A: Docker (recommended)

1. Ensure Docker and Docker Compose are installed.
2. Create the backend environment file (see Environment variables below).
3. Start the stack:

```bash
docker compose --env-file backend/.env up --build
```

4. Visit the app in your browser at the URL printed by the frontend container (`http://localhost:5173`).

### Option B: Run services locally

1. Install dependencies:

```bash
cd backend
# Could be python3 -m venv .venv if you have python3 installed
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm ci
```

2. Create the backend/frontend environment file (see Environment variables below).
3. In a terminal, start a postgresql database

```bash
docker compose --env-file backend/.env up postgres
```

4. In another terminal, start the backend:

```bash
cd backend
python main.py
```

5. In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

5. Open the frontend URL shown in the terminal output (`http://localhost:5173`)

## Environment variables

Create `backend/.env` `frontend/.env` and set the variables required by the backend and frontend service.

Example `backend/.env.example`:

```dotenv
JWT_SECRET=<your-secret-key>
JWT_ALGORITHM=HS256

AUTH_USERNAME=<your-username>
AUTH_PASSWORD=<your-password>

POSTGRES_DB=<your-database-name>
POSTGRES_USER=<your-postgres-username>
POSTGRES_PASSWORD=<your-postgres-password>
POSTGRES_HOST=<your-postgres-host>
POSTGRES_PORT=<your-postgres-port>
```

Example `frontend/.env.example`:

```dotenv
VITE_API_BASE_URL=<http://host:port>
```

Notes:

- `JWT_SECRET`: JWT secret
- `JWT_ALGORITHM`: HS256
- `AUTH_USERNAME/AUTH_PASSWORD`: Login credentials
- `POSTGRES_*`: Connection string for the database used by the backend.
- `VITE_API_BASE_URL`: Backend API URL (`http://localhost:8000`)

## Usage instructions

1. Open the app in the browser (`http://localhost:5173`)
2. Login in using AUTH_USERNAME/AUTH_PASSWORD configured in `backend/.env` file
3. Add a new task using the button `Create Task`.
4. Update task props using the table actions.

## Assumptions and possible improvements

Assumptions:

- PostgreSQL is used as database when running the app. Make sure you run it using docker compose from the project's root (`docker compose --env-file backend/.env up postgres`) before running the backend.
- The backend is a python-based fastAPI service. Make sure you install python and create a venv (for instance running `python3 -m venv .venv` does it). As soon as you run it `python main.py` it creates an empty task table. That's for ease of development.
- The frontend is a React app served via `npm run dev`. Make sure you have node and npm installed (for instance node>=22 and npm>=11).

Possible improvements:

- Improve FE bundle size using dynamic import() to code-split the application.
- Secure APIs validating token from request headers.
- Maybe authentication against database creating a users table or possibly adding social login using OAuth2.
- Add pagination, filtering, and search server-side. At the moment those are handled by ant client-side.
- At the moment db migrations are not handled cause there's only one table. Evaluate another framework in place of `sqlmodel` to handle them.
- Add API documentation (OpenAPI/Swagger).
- Add production build instructions and deployment manifests.

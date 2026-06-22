# TaskFlow

TaskFlow is a MERN stack task management app with JWT authentication, protected task CRUD APIs, a dark React dashboard, and Docker-based deployment support.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router DOM, Axios, Context API
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, dotenv, cors
- DevOps: Docker, Docker Compose, Nginx reverse proxy

## Project Structure

```text
taskflow/
  backend/
    src/
      config/db.js
      controllers/authController.js
      controllers/taskController.js
      middleware/authMiddleware.js
      models/User.js
      models/Task.js
      routes/authRoutes.js
      routes/taskRoutes.js
      server.js
    .dockerignore
    .env.example
    Dockerfile
    package-lock.json
    package.json
  frontend/
    src/
      components/Loader.jsx
      components/Navbar.jsx
      components/TaskCard.jsx
      context/AuthContext.js
      context/AuthProvider.jsx
      pages/Dashboard.jsx
      pages/Login.jsx
      pages/Profile.jsx
      pages/Signup.jsx
      services/api.js
      App.jsx
      index.css
      main.jsx
    .dockerignore
    Dockerfile
    index.html
    nginx.conf
    package-lock.json
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
  docker-compose.yml
  README.md
```

## Features

- User signup and login
- Password hashing with bcrypt
- JWT authentication with `Authorization: Bearer <token>`
- Protected profile endpoint
- Create, read, update, delete, complete, search, and filter tasks
- Dark responsive Tailwind UI
- Frontend Nginx container proxies `/api` requests to the backend container
- MongoDB container with persistent Docker volume

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

For local backend development:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

For Docker Compose, use the MongoDB service name:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongo:27017/taskflow
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost
```

The frontend API base URL is currently `/api`. In Docker, `frontend/nginx.conf` proxies `/api` to `taskflow-backend:5000`.

## Local Development

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start MongoDB locally, then run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Backend runs on `http://localhost:5000`.

Frontend runs on `http://localhost:5173`.

Note: the frontend currently calls `/api`. For separate local frontend/backend development, add a Vite proxy or change the Axios base URL for development.

If PowerShell blocks `npm`, use `npm.cmd`:

```bash
npm.cmd install
npm.cmd run dev
```

## NPM Scripts

Backend:

| Command | Description |
| --- | --- |
| `npm run dev` | Start backend with Node watch mode |
| `npm start` | Start backend normally |
| `npm run lint` | Syntax-check `src/server.js` |

Frontend:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

## API Endpoints

Health:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API status |

Authentication:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create a user account |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/me` | Get logged-in user profile |
| PUT | `/api/auth/profile` | Update logged-in user's name |

Tasks:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get logged-in user's tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Protected endpoints require:

```http
Authorization: Bearer <token>
```

## Docker

Build and run the full stack:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove the MongoDB volume:

```bash
docker compose down -v
```

Services:

| Service | Container | Port |
| --- | --- | --- |
| MongoDB | `taskflow-mongo` | internal only |
| Backend | `taskflow-backend` | `5000:5000` |
| Frontend | `taskflow-frontend` | `80:80` |

After Docker Compose starts, open:

```text
http://localhost
```

## Docker Files

- `backend/Dockerfile`: multi-stage backend image using Node 22 Alpine for dependencies and distroless Node.js for runtime
- `frontend/Dockerfile`: builds the Vite app with Node 22 Alpine and serves it with Nginx
- `frontend/nginx.conf`: serves the React app and proxies `/api` requests to the backend service
- `docker-compose.yml`: runs MongoDB, backend, and frontend on one Docker network

## Git Notes

Ignored files include:

- `node_modules`
- `.env`
- `dist`
- `build`
- `coverage`

Do not commit real secrets. Keep only `.env.example` in Git.

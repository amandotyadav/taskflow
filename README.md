# TaskFlow

TaskFlow is a production-ready MERN stack task management application with JWT authentication, protected task CRUD APIs, and a modern dark React dashboard.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router DOM, Axios, Context API
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, dotenv, cors
- DevOps practice: Docker, Jenkins, and deployment files should be written by you

## Folder Structure

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
    .env.example
    package-lock.json
    package.json
  frontend/
    src/
      components/Navbar.jsx
      components/TaskCard.jsx
      components/Loader.jsx
      pages/Login.jsx
      pages/Signup.jsx
      pages/Dashboard.jsx
      pages/Profile.jsx
      context/AuthContext.js
      context/AuthProvider.jsx
      services/api.js
      App.jsx
      main.jsx
    .env.example
    package-lock.json
    package.json
  README.md
```

## Environment Variables

Backend: copy `backend/.env.example` to `backend/.env`.

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend: copy `frontend/.env.example` to `frontend/.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running Locally

Start MongoDB locally, then run the backend:

```bash
cd backend
npm run dev
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API runs on `http://localhost:5000`.

If PowerShell blocks `npm`, use `npm.cmd` instead:

```bash
npm.cmd install
npm.cmd run dev
```

## API Endpoints

Authentication:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create a user account |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/me` | Get the logged-in user profile |
| PUT | `/api/auth/profile` | Update the logged-in user's name |

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

## DevOps Practice

This repository intentionally does not document completed Docker or Jenkins commands. As DevOps practice, create these files yourself:

- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `docker-compose.yml`
- `Jenkinsfile`

Recommended practice path:

1. Containerize the backend with Node.js.
2. Containerize the frontend with a build stage and an Nginx runtime stage.
3. Add MongoDB with Docker Compose.
4. Add environment variable handling for local and container runs.
5. Create a Jenkins pipeline for install, build, and Docker image creation.
6. Deploy the containers on an AWS EC2 instance.

## Features

- Secure signup and login with hashed passwords
- JWT storage in `localStorage` and `Authorization: Bearer` API requests
- Protected dashboard and profile routes
- Create, edit, delete, complete, search, and filter tasks
- Dark Tailwind UI with responsive cards, modal forms, loading states, and empty states
- Centralized backend error responses with proper status codes

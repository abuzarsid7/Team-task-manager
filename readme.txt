Team Task Manager
=================

Overview
--------
Team Task Manager is a simple task and project management app with a Node/Express + MongoDB backend and a React frontend.

Tech stack
----------
- Backend: Node.js, Express, Mongoose (MongoDB), JWT auth
- Frontend: React, React Router, Axios

Repository layout
-----------------
backend/    - Express server, routes, controllers, models
frontend/   - React app, components, pages, context

Quick setup
-----------
1. Backend
   - Copy `.env.example` (if present) to `.env` and set:
     - `MONGO_URI` (MongoDB connection string)
     - `JWT_SECRET` (secret for signing tokens)
     - `PORT` (optional, default 5001)
   - Install and run:
     npm install
     npm run dev    # or `node server.js` depending on scripts

2. Frontend
   - Change into `frontend/` and install:
     npm install
     npm run dev    # starts Vite/React dev server

API base URL
------------
- Default backend port: 5001 (see `backend/server.js`).
- API base (example): http://localhost:5001/api

Auth
----
- Authentication uses JWT. Include header `Authorization: Bearer <token>` on protected requests.

Key API endpoints (summary)
---------------------------
- POST /api/auth/login         - login, returns JWT
- POST /api/auth/signup        - create user
- GET  /api/projects/          - list projects where user is member
- POST /api/projects/create    - create a project
- POST /api/projects/add-member - add member to project (admin)
- POST /api/projects/remove-member - remove member (admin)
- GET  /api/tasks/dashboard    - dashboard stats (total, overdue, status breakdown, tasksPerUser)
- GET  /api/tasks/project/:projectId - list tasks for a project
- GET  /api/tasks/my-tasks     - list tasks assigned to current user
- POST /api/tasks/create       - create a task
- PUT  /api/tasks/update-status - update task status (only assignee or project admin)

Frontend notes
--------------
- Routes are defined in `frontend/src/routes/AppRoutes.jsx`:
  - `/` (Login), `/signup`, `/dashboard`, `/projects`, `/project/:id`, `/my-tasks`
- `AuthContext` (frontend/src/context/AuthContext.jsx) provides `login`, `logout`, and token persistence.
- `Navbar` includes links to Dashboard, Projects, New Project (opens projects modal), and My Tasks.

Development tips
----------------
- Start backend first so frontend API calls succeed.
- If you get 401 responses, ensure the token is present in localStorage and sent in `Authorization` header by the Axios instance at `frontend/src/api/axios.js`.
- To enable CORS for a specific origin, update the `cors()` configuration in `backend/server.js`.

Next improvements (suggestions)
-----------------------------
- Replace `alert()` calls with a toast/notification system on the frontend.
- Add optimistic UI updates for task status changes.
- Add drag-and-drop Kanban (react-beautiful-dnd) for better UX.

Contact
-------
For local development help, run the backend and frontend dev servers and check browser console + server logs for errors.


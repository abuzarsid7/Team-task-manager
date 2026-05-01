# 📌 Team Task Manager

A full-stack web application where teams can manage projects, assign tasks, and track progress efficiently.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 📁 Project Management (Admin & Members)
- ✅ Task Creation & Assignment
- 📊 Dashboard (task stats, overdue tasks)
- 🔑 Role-Based Access Control

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Deployment
- Railway (Frontend + Backend)

---

## 📂 Folder Structure
```

root/
│
├── frontend/          # React frontend
│
├── backend/           # Node backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│
├── .env
├── package.json

```
---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```
---
## 2️⃣ Setup Backend
```bash
cd server
npm install
```
Create a .env file inside server/:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run backend:
```bash
npm run dev
```
---
## 3️⃣ Setup Frontend
```bash
cd client
npm install
```
Create .env in frontend:

```bash
VITE_API_URL=http://localhost:5000/api
```
Run frontend:
```bash 
npm run dev
```
---
## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint                | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/auth/register     | Register a new user      |
| POST   | /api/auth/login        | Login user               |

---

### 📁 Projects

| Method | Endpoint                      | Description                      |
|--------|------------------------------|----------------------------------|
| GET    | /api/projects                | Get all projects for user        |
| POST   | /api/projects                | Create a new project             |
| POST   | /api/projects/add-member     | Add member to a project          |

---

### ✅ Tasks

| Method | Endpoint              | Description                  |
|--------|----------------------|------------------------------|
| POST   | /api/tasks           | Create a new task            |
| GET    | /api/tasks           | Get tasks                    |
| PUT    | /api/tasks/:id       | Update task status/details   |
---
## 🚀 Deployment (Railway)

### 1️⃣ Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repository-url>
git push -u origin main
```
### 2️⃣ Deploy Backend on Railway
1. Go to Railway: https://railway.app
2. Click “New Project” → “Deploy from GitHub Repo”
3. Select your repository
4. Choose the backend (server) folder if prompted

Set Environment Variables:
```bash
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

PORT=5000
```

5. Click Deploy
6. After deployment, Railway will provide a public backend URL
---

### 3️⃣ Deploy Frontend on Railway

1. In the same Railway project, click “New Service”
2. Select your repository again
3. Choose the frontend (client) folder

Set Environment Variable:
```bash
VITE_API_URL=https://your-backend.up.railway.app/api
```
4. Click Deploy
   
---

### 4️⃣ Connect Frontend & Backend
Make sure your frontend is calling the deployed backend URL.
* Update API base URL in your frontend config (if needed)

---

### 6️⃣ Verify Deployment

* Open your frontend URL in browser
* Try logging in / creating a project
* Ensure API calls are working
  
---

### 🌐 Live URLs

* Frontend: https://team-task-manager-production-1e08.up.railway.app/
* Backend: https://team-task-manager-production-320b.up.railway.app/

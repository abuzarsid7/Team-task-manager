# Team Task Manager Backend Specs

This document describes the backend behavior that the frontend should be built against.

## 1. Product Overview

Team Task Manager is a JWT-protected web app for managing users, projects, and tasks.

Core capabilities:

- User signup and login
- View the current user's projects
- Create projects
- Add members to projects by email
- View dashboard stats for assigned tasks
- View tasks for a project
- View the current user's assigned tasks
- Create tasks inside a project
- Update task status

## 2. Backend Base URL

All API routes are mounted under:

- `http://localhost:5001/api`

Route groups:

- `POST /auth/*`
- `GET /projects/*`, `POST /projects/*`
- `GET /tasks/*`, `POST /tasks/*`, `PUT /tasks/*`

## 3. Authentication

Authentication is JWT-based.

### Token flow

1. User signs up or logs in.
2. Login returns a JWT token.
3. Frontend stores the token securely on the client.
4. Protected requests must send:

```http
Authorization: Bearer <token>
```

### Protected endpoints

All project and task endpoints require `authMiddleware`.

## 4. Data Models

### User

Fields:

- `name` string, required
- `email` string, required, unique
- `password` string, required
- `projects` array of project IDs
- `createdAt`, `updatedAt`

### Project

Fields:

- `name` string, required
- `description` string, optional
- `admin` user ID, required
- `members` array of user IDs
- `createdAt`, `updatedAt`

### Task

Fields:

- `title` string, required
- `description` string, optional
- `dueDate` date, optional
- `priority` enum: `Low | Medium | High`, default `Medium`
- `status` enum: `To Do | In Progress | Done`, default `To Do`
- `project` project ID, required
- `assignedTo` user ID, optional
- `createdAt`, `updatedAt`

## 5. API Endpoints

### 5.1 Auth

#### POST `/api/auth/signup`

Creates a new user account.

Request body:

```json
{
	"name": "Jane Doe",
	"email": "jane@example.com",
	"password": "secret123"
}
```

Success response:

```json
{
	"message": "User created",
	"user": {
		"_id": "...",
		"name": "Jane Doe",
		"email": "jane@example.com",
		"projects": [],
		"createdAt": "...",
		"updatedAt": "..."
	}
}
```

Error responses:

- `400 { "message": "User already exists" }`
- `500 { "error": "..." }`

#### POST `/api/auth/login`

Authenticates a user and returns a JWT.

Request body:

```json
{
	"email": "jane@example.com",
	"password": "secret123"
}
```

Success response:

```json
{
	"message": "Login successful",
	"token": "<jwt-token>"
}
```

Error responses:

- `404 { "message": "User not found" }`
- `400 { "message": "Invalid credentials" }`
- `500 { "error": "..." }`

### 5.2 Projects

#### GET `/api/projects/`

Returns all projects where the current user is a member.

Success response:

```json
{
	"count": 2,
	"projects": [
		{
			"_id": "...",
			"name": "Website Redesign",
			"description": "...",
			"admin": {
				"_id": "...",
				"name": "Jane Doe",
				"email": "jane@example.com"
			},
			"members": [
				{
					"_id": "...",
					"name": "Jane Doe",
					"email": "jane@example.com"
				}
			],
			"createdAt": "...",
			"updatedAt": "..."
		}
	]
}
```

Frontend usage:

- Show the current user's project list.
- Display admin and member names/emails.
- Use `count` for list empty/loading summaries if needed.

#### POST `/api/projects/create`

Creates a project and automatically sets the current user as admin and a member.

Request body:

```json
{
	"name": "Website Redesign",
	"description": "Design and ship the new marketing site"
}
```

Success response:

```json
{
	"message": "Project created",
	"project": {
		"_id": "...",
		"name": "Website Redesign",
		"description": "Design and ship the new marketing site",
		"admin": "...",
		"members": ["..."],
		"createdAt": "...",
		"updatedAt": "..."
	}
}
```

Frontend usage:

- Submit from a create-project modal or page.
- On success, refresh the project list.

#### POST `/api/projects/add-member`

Adds an existing user to a project by email.

Request body:

```json
{
	"projectId": "...",
	"email": "teammate@example.com"
}
```

Rules:

- Only the project admin can add members.
- The user must already exist.
- Duplicate members are rejected.

Success response:

```json
{
	"message": "Member added successfully",
	"project": {
		"...": "..."
	}
}
```

Error responses:

- `404 { "message": "Project not found" }`
- `403 { "message": "Only admin can add members" }`
- `404 { "message": "User not found" }`
- `400 { "message": "User already a member" }`

Frontend usage:

- Only show this action for project admins.
- Use email entry, not user search by ID.

#### POST `/api/projects/remove-member`

Removes an existing project member by email.

Request body:

```json
{
	"projectId": "...",
	"email": "teammate@example.com"
}
```

Rules:

- Only the project admin can remove members.
- The user must already exist.
- The admin cannot be removed.
- Non-members are rejected.

Success response:

```json
{
	"message": "Member removed successfully",
	"project": {
		"...": "..."
	}
}
```

Error responses:

- `404 { "message": "Project not found" }`
- `403 { "message": "Only admin can remove members" }`
- `404 { "message": "User not found" }`
- `400 { "message": "Admin cannot be removed" }`
- `400 { "message": "User is not a member" }`

Frontend usage:

- Only show this action for project admins.
- Use a confirmation step before removal.
- Refresh the project list after success.

### 5.3 Tasks

#### GET `/api/tasks/project/:projectId`

Returns all tasks for a specific project.

Rules:

- The project must exist.
- The current user must be a member of the project.

Success response:

```json
{
	"count": 3,
	"tasks": [
		{
			"_id": "...",
			"title": "Create login screen",
			"description": "Build the auth form",
			"dueDate": "...",
			"priority": "High",
			"status": "To Do",
			"project": {
				"_id": "...",
				"name": "Website Redesign",
				"description": "..."
			},
			"assignedTo": {
				"_id": "...",
				"name": "Jane Doe",
				"email": "jane@example.com"
			},
			"createdAt": "...",
			"updatedAt": "..."
		}
	]
}
```

Frontend usage:

- Use this for the project detail page or board view.
- Render tasks grouped by status if you want a kanban layout.
- Use populated `project` and `assignedTo` data directly in the UI.

#### GET `/api/tasks/my-tasks`

Returns all tasks assigned to the current user.

Success response:

```json
{
	"count": 5,
	"tasks": [
		{
			"_id": "...",
			"title": "Create login screen",
			"description": "Build the auth form",
			"dueDate": "...",
			"priority": "High",
			"status": "In Progress",
			"project": {
				"_id": "...",
				"name": "Website Redesign",
				"description": "..."
			},
			"assignedTo": {
				"_id": "...",
				"name": "Jane Doe",
				"email": "jane@example.com"
			},
			"createdAt": "...",
			"updatedAt": "..."
		}
	]
}
```

Frontend usage:

- Use this for a personal tasks page or "My Tasks" widget.
- Sort and filter on the client if needed, but the backend already returns newest tasks first.

#### GET `/api/tasks/dashboard`

Returns dashboard stats for the current user.

Success response:

```json
{
	"totalTasks": 12,
	"statusStats": [
		{ "_id": "To Do", "count": 4 },
		{ "_id": "In Progress", "count": 5 },
		{ "_id": "Done", "count": 3 }
	],
	"overdueTasks": 2,
	"projectStats": [
		{ "_id": "...projectId...", "count": 7 },
		{ "_id": "...projectId2...", "count": 5 }
	],
	"tasksPerUser": [
		{ "_id": "...userId...", "count": 9 },
		{ "_id": "...userId2...", "count": 4 }
	]
}
```

Frontend usage:

- Render summary cards for total tasks and overdue tasks.
- Render charts or breakdown widgets for status and project distribution.
- Render a user breakdown chart from `tasksPerUser`.
- `projectStats` returns project IDs only, so the frontend may need to map those IDs to project names from the project list.

#### POST `/api/tasks/create`

Creates a task in a project.

Request body:

```json
{
	"title": "Create login screen",
	"description": "Build the auth form",
	"dueDate": "2026-05-10T00:00:00.000Z",
	"priority": "High",
	"projectId": "...",
	"assignedTo": "...userId..."
}
```

Rules:

- The project must exist.
- The current user must be a member of the project.

Success response:

```json
{
	"message": "Task created",
	"task": {
		"_id": "...",
		"title": "Create login screen",
		"description": "Build the auth form",
		"dueDate": "...",
		"priority": "High",
		"status": "To Do",
		"project": "...",
		"assignedTo": "...",
		"createdAt": "...",
		"updatedAt": "..."
	}
}
```

Frontend usage:

- Show a create-task form inside a selected project.
- Allow choosing priority and assignee.
- Refresh project/task data after creation.

#### PUT `/api/tasks/update-status`

Updates a task's status.

Request body:

```json
{
	"taskId": "...",
	"status": "In Progress"
}
```

Allowed values:

- `To Do`
- `In Progress`
- `Done`

Success response:

```json
{
	"message": "Task updated",
	"task": {
		"...": "..."
	}
}
```

Frontend usage:

- Use drag-and-drop boards or status dropdowns.
- Persist status changes immediately after user action.

## 6. Frontend Screens To Build

### Auth screens

- Login page
- Signup page

### Main app screens

- Dashboard overview
- Project list page
- Project detail page
- Task board or task list page
- Create project modal/page
- Add member modal
- Create task modal/page

## 7. Recommended UI Behavior

- After login, redirect to the dashboard.
- Load dashboard stats and project list in parallel.
- Keep the project list as the source of truth for project names and member data.
- After creating a project, adding a member, creating a task, or updating task status, refresh the relevant data.
- Show inline validation or toast messages for backend errors.

## 8. Error Handling Contract

The backend typically returns one of these shapes:

```json
{ "message": "..." }
```

or

```json
{ "error": "..." }
```

Frontend should:

- Display `message` when present.
- Fallback to `error`.
- Handle `401` by redirecting to login and clearing the token.

## 9. Frontend Data Mapping Notes

- `getProjects` returns `members` and `admin` already populated with `name` and `email`.
- `projectStats` in the dashboard returns project IDs, not names.
- `assignedTo` on task create is optional in the backend, but the dashboard counts only tasks assigned to the current user.
- Task status values should be treated as fixed enums, not free text.

## 10. Suggested Frontend State

Minimum state the frontend will need:

- `auth.token`
- `auth.user`
- `projects[]`
- `selectedProject`
- `tasks[]` or per-project task lists
- `dashboardStats`
- `loading` states for auth, projects, dashboard, tasks
- `error` state for API failures

## 11. Implementation Notes

- Include the JWT in every protected request.
- Use the project list response to derive membership and admin UI affordances.
- Prefer refreshing data after mutations instead of trying to patch every cache by hand unless you add a client cache layer.
- Since the backend does not currently expose task listing endpoints, the frontend should expect to receive task data only from create/update responses or from future API additions.


# AI Coding Agent Instructions

## Project Overview

This is a **full-stack blog application** with a React frontend and Express.js backend using MongoDB. The architecture separates frontend (`/src`) and backend (`/backend/src`) into independent services orchestrated via Docker Compose.

## Architecture & Data Flow

### Frontend (Vite + React + TanStack Query)

- **Entry**: `src/main.jsx` → `src/App.jsx` (QueryClientProvider wrapper) → `src/Blog.jsx`
- **State Management**: TanStack Query (React Query) for server-state via `useQuery` with queryKey pattern: `['posts', { author, sortBy, sortOrder }]`
- **API Layer**: `src/API/posts.js` abstracts fetch calls using `VITE_BACKEND_URL` environment variable
- **Components**: Functional, prop-validated with PropTypes (see `PostList.jsx`)
  - `Blog.jsx`: Manages filter/sort state, orchestrates child components
  - `PostList.jsx`: Renders posts from query results
  - `CreatePost.jsx`, `PostFilter.jsx`, `PostSorting.jsx`: Controlled input components

### Backend (Express.js + Mongoose + MongoDB)

- **Entry**: `backend/src/index.js` → `backend/src/app.js`
- **Routes**: `backend/src/routes/posts.js` handles RESTful endpoints
  - `GET /api/v1/posts` with query params: `sortBy`, `sortOrder`, `author`, `tag` (mutually exclusive)
  - `GET /api/v1/posts/:id`, `POST /api/v1/posts`, `PUT /api/v1/posts/:id`, `DELETE /api/v1/posts/:id`
- **Services**: `backend/src/services/posts.js` contains business logic (list, filter, CRUD operations)
- **Database**: Mongoose schema in `backend/src/db/models/post.js`
  - Post model: `title` (required), `author`, `contents`, `tags` (array), `timestamps`
- **Database Connection**: Initialized in `backend/src/db/init.js`

### Data Flow

1. User interacts with React component (e.g., filter, sort)
2. State updates trigger TanStack Query invalidation/refetch
3. `src/API/posts.js` → HTTP request to `VITE_BACKEND_URL/api/v1/posts`
4. `backend/src/routes/posts.js` receives request, calls service layer
5. Service queries MongoDB via Mongoose, returns JSON
6. Frontend updates UI via Query cache

## Docker Orchestration

**docker-compose.yml** defines three services:

- **frontend**: Builds from root Dockerfile, exposes port 3000, passes `VITE_BACKEND_URL=http://backend:8080/api/v1`
- **backend**: Builds from `backend/Dockerfile`, exposes port 8080, loads `backend/.env`
- **mongo**: MongoDB image, volume `mongo-data`, port 27017

**Known Issue**: Last command failed with exit code 1. Check:

- `.env` file exists in `backend/` with MongoDB connection string
- Ports 3000, 8080, 27017 are not already in use
- Docker daemon is running

## Development Workflows

### Frontend Development

- **Dev Server**: `npm run dev` (Vite HMR enabled, runs on http://localhost:5173)
- **Build**: `npm run build` (outputs to `dist/`)
- **Lint**: `npm run lint` (ESLint + Prettier auto-fix on commit)
- **Dependencies**: React 18, TanStack Query 5, Vite 5

### Backend Development

- **Dev Server**: `npm run dev` (nodemon watches `src/` at http://localhost:8080)
- **Start**: `npm run start` (production)
- **Test**: `npm run test` (Jest with in-memory MongoDB via `mongodb-memory-server`)
  - Setup: `src/test/globalSetup.js`, `src/test/setupFileAfterEnv.js`
  - Teardown: `src/test/globalTeardown.js`
- **Dependencies**: Express 4, Mongoose 7, MongoDB driver 6, CORS enabled

### Testing & Linting

- Backend tests: `backend/npm run test` (runs `src/__tests__/*.test.js`)
- Both packages: `npm run lint` (ESLint + Prettier)
- Commit hooks: Commitlint enforces conventional commits via `simple-git-hooks`

## Code Patterns & Conventions

### Frontend

- **Query Key Pattern**: Always include variables in queryKey for proper invalidation
  ```jsx
  useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })
  ```
- **PropTypes**: Validate all component props, use `PropTypes.arrayOf` for lists
- **Environment Variables**: Access via `import.meta.env.VITE_*` (Vite convention)
- **API Abstraction**: All fetch calls go through `src/API/posts.js`, never call fetch directly

### Backend

- **Route Handlers**: Use async/await, wrap in try/catch, return appropriate HTTP status codes
- **Service Layer**: Business logic (queries, transformations) lives in `services/posts.js`, not routes
- **Error Handling**: Log errors to console, return 500 on unexpected failures, 404 for missing resources
- **Query Parameters**: Routes accept `sortBy`, `sortOrder`, `author`, `tag` as filters
- **Request/Response**: Expect JSON request body, respond with JSON. CORS enabled globally.

### Database

- **Mongoose Models**: Define schema in `db/models/post.js`, export model instance
- **Timestamps**: All models include `{ timestamps: true }` for `createdAt`/`updatedAt`
- **Validation**: Use Mongoose schema validation (required fields)

## Critical Integration Points

1. **Environment Variables**: Frontend needs `VITE_BACKEND_URL` (passed by docker-compose), backend needs MongoDB connection string in `.env`
2. **API Versioning**: All endpoints prefixed with `/api/v1/`
3. **CORS**: Express app has global `cors()` middleware; frontend can call backend freely
4. **Mongo Memory Server**: Tests use in-memory MongoDB; never persists test data
5. **Git Hooks**: Commits must follow conventional commits format; husky + commitlint enforced

## Quick Debugging Checklist

- **Docker fails**: Check `.env` file, port availability, `docker-compose.yml` service names
- **Frontend can't reach backend**: Verify `VITE_BACKEND_URL` in docker-compose, check network mode
- **MongoDB connection fails**: Ensure `mongodb://` URI in `.env`, mongo service is running
- **Query not refetching**: Check queryKey includes all filter dependencies
- **Tests fail**: Run `npm run test` in `backend/`, check `jest` config in `backend/package.json`

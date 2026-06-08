# youtube-clone

`youtube-clone` is a MERN stack capstone project that recreates the core YouTube experience: authentication, searchable video feeds, category filters, native video playback, likes and dislikes, channel management, and full comment CRUD.

## Technology Stack

- Frontend: React, Vite latest, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JSON Web Tokens with bcrypt password hashing
- Styling: responsive CSS with only `rgb(...)` and `rgba(...)` color values

## Folder Structure

```text
youtube-clone/
  client/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      utils/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    seed.js
    server.js
  README.md
```

## Features

- Register and login with JWT authentication
- Header shows Sign In before login and username after login
- Search videos by title through the backend API
- Filter videos by category with 10 filter buttons
- Responsive YouTube-style header, sidebar, filter row, and video grid
- Native HTML5 video player
- Like and dislike toggles stored per user
- Comment add, edit, and delete operations
- Channel creation for signed-in users
- Channel owner video upload, edit, and delete
- MongoDB seed file with users, channels, videos, and comments

## Prerequisites

- Node.js
- MongoDB locally or a MongoDB Atlas connection string
- Git for the required commit history

## Backend Setup

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_very_long_secret_key_here
```

Seed the database:

```powershell
npm run seed
```

Start the backend:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`.

## Frontend Setup

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Seeded Login Credentials

- Email: `john@example.com`
- Password: `password123`

- Email: `jane@example.com`
- Password: `password123`

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/videos`
- `GET /api/videos/:id`
- `POST /api/videos`
- `PUT /api/videos/:id`
- `DELETE /api/videos/:id`
- `PUT /api/videos/:id/like`
- `PUT /api/videos/:id/dislike`
- `POST /api/channels`
- `GET /api/channels/:id`
- `GET /api/channels/:id/videos`
- `GET /api/videos/:videoId/comments`
- `POST /api/videos/:videoId/comments`
- `PUT /api/videos/:videoId/comments/:commentId`
- `DELETE /api/videos/:videoId/comments/:commentId`

## RGB Color Rule

Every CSS color value is written with `rgb(...)` or `rgba(...)`. Do not use hex, HSL, or named CSS colors.

## Commit Strategy

The capstone requires at least 30 meaningful commits. This repository uses backend, frontend, styling, documentation, and verification commits to keep the history clear.

## Submission Notes

- Do not submit `node_modules`.
- Keep `.env` private.
- Use `server/.env.example` and `client/.env.example` for evaluator setup.
- Provide a demo video link in your final GitHub README before submission.

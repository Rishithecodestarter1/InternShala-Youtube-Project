# youtube-clone

`youtube-clone` is a MERN stack capstone project with JWT authentication, channel management, video playback, likes/dislikes, comments, search, filters, and a reusable JWT secret utility built with Node.js crypto.

## Tech Stack

- Frontend: React, Vite 8, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT with bcrypt password hashing

## Folder Structure

```text
youtube-clone/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    seed.js
    server.js
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      utils/
  README.md
```

## Setup

Install dependencies from the project root:

```powershell
npm run install:all
```

Create or refresh a secure JWT secret:

```powershell
npm run secret:generate
npm run secret:verify
```

Edit `backend/.env` and set MongoDB:

```env
PORT=5000
MONGO_URI="mongodb://127.0.0.1:27017/youtube-clone"
JWT_SECRET="generated_by_the_secret_utility"
```

Seed the database:

```powershell
npm run seed
```

The seed script loads 16 demo videos across `Education`, `Entertainment`, `Music`, `Gaming`, `Sports`, `News`, `Web Development`, `Cooking`, and `Live`, plus comments on multiple videos so the watch page has realistic activity.

Start the app in two terminals:

```powershell
npm run dev:server
npm run dev:client
```

Open:

```text
Frontend: http://127.0.0.1:5173/
Backend: http://localhost:5000/
```

## Seeded Login

Use these demo accounts after running `npm run seed`:

```text
Email: john@example.com
Password: password123
```

```text
Email: jane@example.com
Password: password123
```

## Features

- Register and login with JWT
- Secure JWT secret generation and verification
- Search videos by title, channel, or category
- Category filters with pagination-ready backend API
- Seeded demo feed with 16 videos across the required capstone categories
- Native video playback with view count increments
- Like/dislike toggles
- Full comment CRUD
- Channel create/update flow
- Owner-only video upload, edit, and delete
- Responsive YouTube-style layout

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/videos`
- `GET /api/videos?search=music&category=Music&page=1&limit=3`
- `GET /api/videos/:id`
- `POST /api/videos`
- `PUT /api/videos/:id`
- `DELETE /api/videos/:id`
- `PUT /api/videos/:id/like`
- `POST /api/videos/:id/like`
- `PUT /api/videos/:id/dislike`
- `POST /api/videos/:id/dislike`
- `GET /api/videos/:videoId/comments`
- `POST /api/videos/:videoId/comments`
- `PUT /api/videos/:videoId/comments/:commentId`
- `DELETE /api/videos/:videoId/comments/:commentId`
- `PUT /api/comments/:commentId`
- `DELETE /api/comments/:commentId`
- `POST /api/channels`
- `GET /api/channels/:id`
- `PUT /api/channels/:id`
- `GET /api/channels/:id/videos`

## Verification

```powershell
npm run lint
npm run build
Get-ChildItem backend -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
Invoke-RestMethod http://localhost:5000/
Invoke-RestMethod "http://localhost:5000/api/videos?search=music&category=Music&page=1&limit=3"
Invoke-RestMethod "http://127.0.0.1:5173/api/videos"
npm run verify:runtime
```

## Demo Recording Guide

Record the short submission demo separately after starting both servers. A complete walkthrough should show:

- Home page with header, toggleable sidebar, filter row, and seeded video grid.
- Sign In before login, then login with `john@example.com` / `password123`.
- Search for `react`, then filter by `Education`, `Music`, `Gaming`, `Sports`, and `News`.
- Watch page with video playback, like/dislike, description, and comment add/edit/delete.
- Channel page with channel details, upload form validation, video upload/edit/delete, and success messages.
- Mobile or narrow browser width to show the responsive layout.

Do not commit the recorded video file unless the submission portal explicitly asks for it in the repository.

## Security Notes

- Never commit `backend/.env`.
- Keep `JWT_SECRET` private.
- If the secret leaks, generate a new one and make users log in again.
- The project already has more than 20 meaningful Git commits.

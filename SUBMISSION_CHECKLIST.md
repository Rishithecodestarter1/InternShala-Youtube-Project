# Capstone Submission Checklist

Use this file as the final verification guide before submitting the `youtube-clone` MERN capstone project.

## Project Setup

- Repository uses the required MERN structure: `frontend/` for React + Vite and `backend/` for Express + MongoDB.
- Root scripts can run both sides:
  - `npm run dev:server`
  - `npm run dev:client`
  - `npm run build`
  - `npm run lint`
- `backend/.env` exists locally with `PORT`, `MONGO_URI`, and `JWT_SECRET`.
- `.env`, `.env.*`, `node_modules`, build output, and logs are ignored by Git.
- Git commits use `Rishi Nandan Choudhary <rishinandan1431@gmail.com>`.

## Capstone PDF Requirement Map

- Frontend home page: `Header`, toggleable `Sidebar`, `FilterBar`, and responsive `VideoCard` grid are implemented.
- User authentication: registration, login, JWT storage, validation messages, and signed-in username display are implemented.
- Search and filters: header search uses URL query state, and category buttons filter videos through the backend API.
- Video player page: native video playback, metadata, description, like/dislike buttons, and full comment CRUD are implemented.
- Channel page: signed-in users can create/update a channel and upload/edit/delete their own videos.
- Backend API: Express routes cover auth, channel management, video management, reactions, and comments.
- MongoDB data: users, channels, videos, comments, video URLs, and thumbnail URLs are stored with Mongoose models.
- Submission rules: Vite is used instead of CRA, ES Modules are used instead of CommonJS, and ignored folders/files stay out of Git.

## Static Verification

- Run `npm run lint` from the repository root.
- Run `npm run build` from the repository root.
- Run backend syntax checks:
  ```powershell
  Get-ChildItem backend -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
  ```
- Confirm the codebase uses ES Modules and does not use `require` or `module.exports`.
- Confirm frontend CSS colors use only `rgb(...)` or `rgba(...)`.
- Confirm no `node_modules` folders are tracked:
  ```powershell
  git ls-files | Select-String "node_modules"
  ```

## Backend Requirements

- Run `npm run secret:verify` to confirm a strong local JWT secret is configured.
- Run `npm run seed` to load demo data into MongoDB.
- `GET /` returns a JSON health response.
- `GET /api/videos` returns at least 14 seeded videos.
- `GET /api/videos?search=react` searches by video title, channel name, and category.
- `GET /api/videos?category=Education` filters by category.
- `GET /api/videos?page=1&limit=5` returns paginated metadata.
- Register validates username, email, and password.
- Login returns a JWT and user payload.
- Protected routes reject missing or invalid tokens with `401`.
- Channel routes support create, update, and owner-only video management.
- Video routes support create, read, update, delete, like, and dislike.
- Comment routes support add, fetch, edit, and delete.
- Compatibility aliases are available for video reactions and comment edit/delete routes.

## Seed Data Coverage

- Seeded videos cover the required categories:
  - `Education`
  - `Entertainment`
  - `Music`
  - `Gaming`
  - `Sports`
  - `News`
- Extra practical categories are also included: `Web Development`, `Cooking`, and `Live`.
- Each seeded video includes a title, thumbnail URL, video URL, description, views, channel data, like/dislike arrays, and category.
- Seeded comments are attached across multiple videos so the watch page feels active.
- Demo login credentials:
  - `john@example.com` / `password123`
  - `jane@example.com` / `password123`

## Frontend Requirements

- Home page shows a YouTube-like header, sidebar, filter row, and responsive video grid.
- Video cards show thumbnail, title, channel name, views, and category metadata.
- Search filters videos through the URL query and backend API.
- Category buttons work together with search.
- Sign In button appears before login.
- Username/avatar state appears after successful login.
- Registration shows a friendly success message and returns the user to Sign In.
- Login stores the JWT/user data in `localStorage`.
- Stale or invalid JWT responses clear auth state and redirect to `/auth`.
- Watch page displays the native video player, title, description, channel details, like/dislike buttons, and comments.
- Comments can be added, edited, and deleted without reloading the page.
- Channel page lets an authenticated user create/update a channel and upload/edit/delete their own videos.
- Not Found page displays the invalid URL.
- Mobile, tablet, and desktop layouts remain usable.

## Runtime Demo

- Start the backend:
  ```powershell
  npm run dev:server
  ```
- Start the frontend:
  ```powershell
  npm run dev:client
  ```
- Open the frontend at `http://127.0.0.1:5173/`.
- Verify the Vite proxy reaches the backend:
  ```powershell
  Invoke-RestMethod http://127.0.0.1:5173/api/videos
  ```
- Run the automated runtime smoke check:
  ```powershell
  npm run verify:runtime
  ```
- Confirm the terminal logs show no runtime errors.

## Short Video Demo Checklist

- Show the home page with the header, sidebar toggle, filters, and seeded videos.
- Sign in with a seeded user and show the username/avatar state in the header.
- Demonstrate search by title and category filtering.
- Open a video and show playback, like/dislike, and comment add/edit/delete.
- Open the channel page and show create/update channel plus video upload/edit/delete.
- Resize the browser or use responsive tools to show mobile/tablet usability.
- Keep the demo video outside Git unless the submission instructions specifically require committing it.

## Git And Submission

- Run `git status --short --branch` and confirm the tree is clean.
- Run `git rev-list --count HEAD` and confirm the repository has at least 72 commits after final polish.
- Run `git log --format="%h | %an <%ae> | %s" --max-count=10` and confirm the newest commits are under your name.
- Confirm the remote URL:
  ```powershell
  git remote -v
  ```
- Push the final branch:
  ```powershell
  git push origin main
  ```

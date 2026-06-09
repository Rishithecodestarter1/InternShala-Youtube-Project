# youtube-clone server

Express + MongoDB backend for the MERN capstone.

## Scripts

```powershell
npm run dev
npm start
npm run seed
```

## Environment

Copy `.env.example` to `.env` and provide:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_very_long_secret_key_here
```

## Seed Data

`npm run seed` creates:

- 2 users
- 1 channel
- 6 videos
- 3 comments

Seeded login credentials:

| User | Email | Password |
| --- | --- | --- |
| John Creator | `john@example.com` | `password123` |
| Jane Viewer | `jane@example.com` | `password123` |

Use either seeded user to test login, comments, likes, dislikes, and channel-owned video actions after seeding the database.

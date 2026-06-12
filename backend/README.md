# youtube-clone backend

Express, MongoDB, JWT authentication, video APIs, channels, comments, and the reusable JWT secret utility.

## Scripts

```powershell
npm run dev
npm start
npm run seed
npm run secret:generate
npm run secret:verify
```

## Environment

Copy `.env.example` to `.env`, then generate the JWT secret:

```powershell
node utils/generateSecret.js
node utils/verifySecret.js
```

Use local MongoDB or Atlas:

```env
PORT=5000
MONGO_URI="mongodb://127.0.0.1:27017/youtube-clone"
JWT_SECRET="generated_by_the_secret_utility"
```

## Seeded Users

| User | Email | Password |
| --- | --- | --- |
| John Creator | `john@example.com` | `password123` |
| Jane Viewer | `jane@example.com` | `password123` |

# youtube-clone frontend

React + Vite frontend for the MERN YouTube clone.

## Scripts

```powershell
npm run dev
npm run build
npm run lint
```

## Local Development

The frontend runs at:

```text
http://127.0.0.1:5173/
```

Axios uses `VITE_API_URL` when present, and Vite also proxies `/api` to the backend at `http://localhost:5000`.

```env
VITE_API_URL=http://localhost:5000/api
```

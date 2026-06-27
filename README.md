# BUS TRACK

Full-stack MERN bus ticket booking demo: **React (Vite) + Tailwind**, **Node.js + Express**, **MongoDB Atlas**, **JWT** auth. Frontend targets **Vercel**; API targets **Render**.

## Folder structure

```
Bus_booking/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── controllers/busController.js
│   ├── middleware/authMiddleware.js
│   ├── models/User.js
│   ├── models/Bus.js
│   ├── routes/authRoutes.js
│   ├── routes/busRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── routes/PrivateRoute.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## API routes

| Method | Path | Auth | Description |
|--------|------|------|---------------|
| POST | `/api/auth/register` | No | Register user (bcrypt hash) |
| POST | `/api/auth/login` | No | Login, returns JWT + user |
| GET | `/api/auth/me` | Yes | Current user profile |
| GET | `/api/buses/search?from=&to=&date=` | Yes | Buses for route |
| GET | `/api/buses?from=&to=` | Yes | List buses (both params for route results) |
| GET | `/api/health` | No | Health check |

## Local setup

### 1. MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Database Access → create a DB user.
3. Network Access → allow your IP (or `0.0.0.0/0` for quick dev only).
4. Connect → Drivers → copy connection string and replace `<password>` and database name if needed.

### 2. Backend

```bash
cd backend
copy .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET (long random string), PORT optional
npm install
npm run dev
```

Server default: `http://localhost:5000`

On first successful connection, if the `buses` collection is empty, **sample buses** are inserted automatically.

### 3. Frontend

```bash
cd frontend
copy .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

Open `http://localhost:5173`

### 4. Try the flow

1. **Sign Up** → creates user in `users` collection → redirects to **Sign In**.
2. **Sign In** → JWT stored in `localStorage` → **Dashboard**.
3. Choose **From / To / Date** → **Search Buses** → **Bus results** (calls `GET /api/buses?from=&to=`; `GET /api/buses/search` is also available with the same filters).

## Environment variables

**Backend (`backend/.env`)**

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | Server port (default `5000`) |
| `CLIENT_ORIGIN` | Optional extra CORS origin (e.g. Vercel URL) |

**Frontend (`frontend/.env`)**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of API (no trailing slash), e.g. `https://your-api.onrender.com` |

## Deployment

### Backend (Render)

1. New **Web Service** → connect repo or deploy from Git.
2. Root directory: `backend`
3. Build: `npm install`  
4. Start: `npm start`
5. Environment: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel site URL, e.g. `https://your-app.vercel.app`).

### Frontend (Vercel)

1. Import project; set **Root Directory** to `frontend`.
2. Framework: Vite.
3. Environment variable: `VITE_API_URL` = your Render API URL (e.g. `https://bus-track-api.onrender.com`).

After deploy, ensure Atlas **Network Access** allows connections from the internet (or Render outbound IPs if you restrict).

## Build order (learning path)

1. UI pages only  
2. Routing (`react-router-dom`)  
3. Backend APIs (Express)  
4. MongoDB connection  
5. JWT authentication  
6. Bus search + results  
7. Deployment (Vercel + Render)

## Tech

- React 18, Vite, Tailwind CSS, React Router, Axios, react-hot-toast  
- Express, Mongoose, CORS, dotenv, jsonwebtoken, bcryptjs  

Project name everywhere: **BUS TRACK**.

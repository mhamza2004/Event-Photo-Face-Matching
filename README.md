# 📸 Event Photo Face Matching Platform

An AI-powered event photo management platform that automatically identifies people in event photos using facial recognition. Users can upload event images, search with a selfie, and instantly retrieve all matching photos.

---

## 🚀 Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📅 Event Management
- 📷 Upload Event Photos
- 🤖 AI Face Recognition
- 🧠 Face Embedding Storage
- 🔎 Selfie-Based Photo Search
- 🖼 Event-wise Photo Gallery
- ⚡ FastAPI REST API
- 🎨 Modern React Dashboard
- 🗄 PostgreSQL Database

---

# 📸 Screenshots

> Add screenshots inside the `screenshots/` folder.

| Login | Dashboard |
|-------|-----------|
| ![](screenshots/login.png) | ![](screenshots/dashboard.png) |

| Upload | Gallery |
|--------|---------|
| ![](screenshots/upload.png) | ![](screenshots/gallery.png) |

| AI Search | Match Result |
|-----------|--------------|
| ![](screenshots/search.png) | ![](screenshots/result.png) |

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- React Toastify
- React Icons

### Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic
- Uvicorn

### Database

- PostgreSQL

### AI

- InsightFace
- ONNX Runtime
- Face Embeddings
- Cosine Similarity

---

# 📂 Project Structure

```
Event-Photo-Face-Matching
│
├── backend
│   ├── app
│   ├── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│
├── screenshots
│
├── README.md
└── LICENSE
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/mhamza2004/Event-Photo-Face-Matching.git
```

---

## Backend

```bash
cd backend

python -m venv .venv

.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=YOUR_DATABASE_URL

SECRET_KEY=YOUR_SECRET_KEY

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

# 🤖 AI Workflow

```
Upload Event Photos

        │

        ▼

Detect Faces

        │

        ▼

Generate Face Embeddings

        │

        ▼

Store in PostgreSQL

        │

        ▼

Upload Selfie

        │

        ▼

Generate Embedding

        │

        ▼

Cosine Similarity Matching

        │

        ▼

Return Matching Event Photos
```

---

# 🌐 API Endpoints

## Authentication

- POST `/auth/register`
- POST `/auth/login`

## Events

- GET `/events`
- POST `/events`
- PUT `/events/{id}`
- DELETE `/events/{id}`

## Photos

- POST `/photos/upload`
- GET `/photos/event/{id}`

## AI Matching

- POST `/match`

---

# 🔮 Future Improvements

- Email Invitations
- QR Code Event Access
- Multi-Face Group Matching
- Face Clustering
- Cloud Storage
- Admin Dashboard
- Download Matched Album
- Mobile Responsive PWA

---

# 👨‍💻 Author

**Muhammad Hamza**

- GitHub: https://github.com/mhamza2004

---

# 📜 License

This project is licensed under the MIT License.
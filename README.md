# 🛡️ ShadowAI – AI-Powered Digital Identity Protection Platform

## 📌 Overview

ShadowAI is an AI-powered web application that helps users identify and reduce digital identity risks before sharing resumes or personal information online.

The platform analyzes uploaded resumes using AI, detects sensitive personal information (PII), calculates a Digital Identity Risk Score, and provides actionable recommendations to improve privacy and prevent identity theft.

---

## 🚀 Features

- 🔐 Secure User Authentication (JWT)
- 📄 AI-Powered Resume Analysis
- 🧠 Digital Identity Risk Score
- 📊 Interactive Dashboard
- ⚠️ Detection of Sensitive Personal Information
- 💡 Personalized Privacy Recommendations
- ☁️ Cloud Deployment (Vercel + Render)

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python

### Database
- MongoDB

### AI
- Google Gemini API

### Deployment
- Vercel
- Render

---

## 📂 Project Structure

```
shadowai/
│
├── frontend/
├── backend/
├── README.md
└── docker-compose.yml
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/shadowai.git
cd shadowai
```

---

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at:

```
http://localhost:8001
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### 4. Environment Variables

Backend:

```
APP_NAME=ShadowAI API
ENV=development
SECRET_KEY=your_secret_key
MONGO_URI=
MONGO_DB_NAME=shadowai
GEMINI_API_KEY=your_api_key
```

Frontend:

```
VITE_API_URL=http://localhost:8001
```

For production:

```
VITE_API_URL=https://shadowai-wg2x.onrender.com
```

---

## 🌐 Live Demo

Frontend:
(Add your Vercel URL)

Backend:
https://shadowai-wg2x.onrender.com

Health Check:
https://shadowai-wg2x.onrender.com/health

---

## 👨‍💻 Team

Volety N L M Sri Ramya

Integrated M.Tech (CSE)

VIT-AP University

---

## 📄 License

This project is developed for the IDEA2IMPACT Online AI Hackathon 2026.

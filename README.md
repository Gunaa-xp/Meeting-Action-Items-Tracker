# Meeting Action Items Tracker

A full-stack web application that converts meeting transcripts into structured action items.
The app supports AI-assisted extraction (Google Gemini) with a rule-based fallback for reliability.

## Tech Stack

Frontend

* React (Vite)
* Tailwind CSS
* Axios

Backend

* Node.js
* Express

Database

* MongoDB Atlas

AI

* Google Gemini 

---

## Features Implemented

* Paste meeting transcript and extract action items
* AI-based extraction using Gemini (if API key provided)
* Automatic fallback to rule-based parsing if AI is unavailable
* Edit, add, delete action items
* Mark items as Open / Done
* Filters by status, tags, and step type
* Transcript history (last 5)
* Templates and step types
* Home page with usage steps
* System Status page

  * Backend health
  * Database connection
  * LLM configuration status
* Input validation and error handling

---

## How to Run Locally

### 1. Clone the repository

```
git clone <your-repo-url>
cd <project-folder>
```

---

### 2. Backend Setup

```
cd backend
cp .env.example .env
npm install
```

update a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key   (optional)
```

Run backend:

```
npm run dev
```

---

### 3. Frontend Setup

```
cd frontend
cp .env.example .env
npm install
```

Update a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Run frontend:

```
npm run dev
```

Open:
http://localhost:5173

---

## What is Done

* Full-stack working application
* MongoDB integration
* AI + non-AI extraction modes
* Health monitoring endpoint
* Clean UI with responsive design
* Basic validation and error handling
* Deployment-ready structure (Vercel + Render)

---

## What is Not Done / Future Improvements

* User authentication
* Multi-user workspace
* Real-time collaboration
* Advanced NLP accuracy improvements
* File/audio transcript upload
* Production-level logging and monitoring

---


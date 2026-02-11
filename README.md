# Meeting Action Items Tracker

Production-ready full-stack application to extract and manage action items from meeting transcripts.

## Folder Structure

```text
Meeting-Action-Items-Tracker/
├── backend/
│   ├── controllers/
│   │   ├── actionController.js
│   │   └── transcriptController.js
│   ├── models/
│   │   ├── ActionItem.js
│   │   └── Transcript.js
│   ├── routes/
│   │   ├── actionRoutes.js
│   │   └── transcriptRoutes.js
│   ├── utils/
│   │   └── transcriptParser.js
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionItemModal.jsx
│   │   │   ├── ActionItemsTable.jsx
│   │   │   ├── FiltersBar.jsx
│   │   │   ├── HistoryPanel.jsx
│   │   │   ├── TemplateBar.jsx
│   │   │   └── TranscriptPanel.jsx
│   │   ├── pages/
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
└── README.md
```

## Backend API Endpoints

- `POST /api/transcripts/process`
- `GET /api/transcripts/history`
- `GET /api/actions`
- `POST /api/actions`
- `PUT /api/actions/:id`
- `DELETE /api/actions/:id`

## Setup Instructions

### 1) Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Update `.env`:

- `PORT=5000`
- `MONGO_URI=<your-mongodb-atlas-connection-string>`

### 2) Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Update `.env`:

- `VITE_API_URL=http://localhost:5000/api`

## Deployment

### Deploy Backend to Render

1. Push repository to GitHub.
2. In Render, create a new **Web Service**.
3. Set root directory to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGO_URI`
   - `PORT=10000`
7. Deploy.

### Deploy Frontend to Vercel

1. Import repository in Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL=<your-render-backend-url>/api`
6. Deploy.

## Notes

- Transcript history stores only the latest 5 transcript records.
- Transcript parser uses keyword and regex-based extraction logic.
- App supports manual action creation, editing, tagging, filtering, templates, and status updates.

This file contains the main prompts used during development.
Only prompts are included. No AI responses, API keys, or sensitive information.

The prompts reflect the iterative development approach used to build and improve the application.

---

## Prompt 1 – Initial Project Generation

Used to generate the complete full-stack application with core features.

**Purpose**

* Create full-stack structure (React + Express + MongoDB)
* Implement transcript processing using rule-based extraction
* Add action item management, filters, history, templates
* Ensure clean architecture, environment configuration, and deployment readiness

**Prompt Summary**

> Build a production-ready full-stack web application called *Meeting Action Items Tracker* using React (Vite + Tailwind), Node.js, Express, and MongoDB.
>
> Features include:
>
> * Transcript input and action item extraction (regex-based)
> * CRUD operations for action items
> * Status tracking (Open/Done)
> * Filters (status, tags, step type)
> * Transcript history (last 5)
> * Templates and predefined step types
>
> Requirements:
>
> * Clean folder structure
> * REST APIs
> * Proper error handling
> * .env examples
> * Deployment-ready for Vercel and Render
> * No runtime errors

---

## Prompt 2 – System Extension (Home, Status, Validation)

Used to extend the existing project without rewriting it.

**Purpose**

* Add Home page with usage steps
* Add system health monitoring page
* Implement backend `/api/status` endpoint
* Improve input validation and error handling

**Prompt Summary**

> Extend the existing full-stack project without breaking current functionality.
>
> Add:
>
> * Home page (`/`) with application overview and steps
> * Status page (`/status`) showing:
>
>   * Backend health
>   * MongoDB connection status
>   * LLM configuration status
> * Backend health endpoint (`GET /api/status`)
> * Validation for empty transcript input
> * User-friendly error messages
>
> Requirements:
>
> * Keep structure intact
> * Add only necessary files
> * Maintain clean UI and no runtime errors

---

## Prompt 3 – LLM Integration (Google Gemini)

Used to add AI-based extraction with safe fallback.

**Purpose**

* Integrate Google Gemini for action item extraction
* Keep regex parser as fallback
* Make LLM optional using environment variable
* Update system health to reflect LLM configuration

**Prompt Summary**

> Add LLM-based transcript extraction using Google Gemini (`gemini-1.5-flash`).
>
> Requirements:
>
> * Use `@google/generative-ai`
> * Environment variable: `GEMINI_API_KEY`
> * If key exists → use Gemini
> * If Gemini fails or key is missing → fallback to regex parser
> * Add `backend/utils/geminiParser.js`
> * Update transcript processing logic
> * Update `/api/status` to show LLM configuration
> * Ensure application works without Gemini and does not crash

---

## Notes

* AI was used iteratively to assist with architecture, feature implementation, and integration.
* All prompts focused on controlled changes to avoid breaking existing functionality.
* The final application was tested manually to ensure end-to-end functionality.

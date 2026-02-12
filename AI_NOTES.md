## How AI was used

AI was used as a development assistant during the project. It helped with:

* Generating initial full-stack project structure (React + Express + MongoDB)
* Creating boilerplate code for routes, controllers, and components
* Designing the Gemini integration for transcript extraction
* Suggesting UI layout improvements using Tailwind
* Helping with error handling patterns and environment configuration

AI was mainly used to speed up development and reduce repetitive setup work.

---

## What I implemented and verified manually

The following parts were reviewed, modified, and tested manually:

* Fixed integration issues between frontend and backend
* Tested all API endpoints using real data
* Verified MongoDB connection and data flow
* Implemented and tested fallback logic (Gemini → regex parser)
* Added input validation and error handling
* Built and tested the Home page and Status page
* Verified application behavior with and without GEMINI_API_KEY
* Cleaned and organized project structure
* Tested the full application flow locally

The final application was run end-to-end to ensure there were no runtime errors.

---

## LLM Used in the Application

Provider: Google
Model: Gemini 1.5 Flash
SDK: @google/generative-ai

---

## Why Gemini was chosen

Gemini was selected because:

* It provides a free tier suitable for this project
* Easy API setup and integration
* Good performance for structured text extraction
* No additional infrastructure required

If the GEMINI_API_KEY is not provided, the application automatically falls back to a rule-based (regex) extraction method to ensure the system continues to work.

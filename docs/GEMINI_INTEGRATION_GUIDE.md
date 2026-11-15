# Google Gemini AI Integration & Grounding Architecture

## Configuration
- Environment Variables: `GEMINI_API_KEY`, `GEMINI_MODEL`.
- Default Model: `gemini-1.5-flash`.

## Grounding Protocol
When a copilot prompt executes, the backend service:
1. Queries the active database for relevant pain points, user stories, and telemetry.
2. Formats a structured system prompt injecting the live context and citing entity IDs.
3. If API credentials are present, invokes `google.generativeai.GenerativeModel.generate_content`.
4. If unset, seamlessly routes to verified deterministic domain intelligence rules.\n
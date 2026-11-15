# Product Analytics Plan & First-Party Philosophy

## 1. Analytics Philosophy
ThreadIQ rejects black-box third-party tracking scripts (such as Mixpanel or Amplitude) in favor of internal, first-party event instrumentation connected directly to PostgreSQL. This guarantees:
- Complete compliance with data residency standards.
- Immunity to ad-blockers and Safari ITP cookie restrictions.
- Zero per-event SaaS licensing fees at enterprise scale.
- Native SQL joinability with orders, inventory, and supply chain records.

## 2. Event Collection Architecture
`React Client (SPA)` $\rightarrow$ `POST /api/analytics/events` $\rightarrow$ `FastAPI Ingestion Worker` $\rightarrow$ `PostgreSQL product_events Table` $\rightarrow$ `Real-time Analytical Views`.\n
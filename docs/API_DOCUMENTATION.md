# ThreadIQ REST API Reference

## Base URL
`/api`

## Core Endpoint Directory
- `POST /api/auth/login`: Authenticate and issue demo JWT session.
- `GET /api/overview/metrics`: Aggregate executive PM cockpit metrics.
- `GET /api/research/pain-points`: List customer pain points with severity.
- `GET /api/storefront/products`: Filterable fashion catalog with multi-attribute search.
- `POST /api/storefront/checkout`: Simulated e-commerce checkout.
- `POST /api/analytics/events`: Ingest first-party telemetry events.
- `GET /api/analytics/funnel`: Calculate 6-stage unique user conversion funnel.
- `GET /api/experiments/{id}/statistics`: Calculate two-proportion z-test & p-values.
- `POST /api/delivery/stories/move`: Transition Kanban user story stages.
- `GET /api/reports/export/excel`: Download multi-sheet executive workbook.
- `POST /api/copilot/generate`: Execute grounded AI PM workflows.\n
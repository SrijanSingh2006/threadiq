# Testing Guide & Test Execution

## Backend Test Execution
Run the complete Pytest suite with HTTPX:
```bash
python -m pytest backend/tests/test_all_modules.py -v
```

## Frontend Test Execution
Run the Vitest React Testing Library suite:
```bash
cd frontend
npm test
```\n
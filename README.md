# Mission 02 – Insurance API Project

This project is a multi-language (Node.js/Express and Python/FastAPI) backend for insurance-related business logic and API endpoints. It demonstrates API design, input validation, and business rule implementation.

## Features

- **Car Value Suggestion API** (`/route1`):  
  Calculates a car's suggested value based on its model and year using alphabetic position logic.

- **Risk Rating API** (`/route2/api/v1/risk-rating`):  
  Analyzes free-text claim history and returns a risk rating (1–5) based on keyword occurrences.

- **Discount Rate API** (`/discount` via FastAPI):  
  Calculates insurance discount rates based on driver's age and experience, with business rules and error handling.

## Tech Stack

- **Node.js / Express**: Main API server (`index.js`), routes in `/routes`, business logic in `/services`.
- **Python / FastAPI**: Discount rate endpoint (`main.py`), business logic in `discount_logic.py`.
- **Jest & Supertest**: Automated tests for Node.js endpoints.
- **Pytest**: Automated tests for Python logic and API.

## Project Structure

```
mission-02/
  index.js                # Express app entry point
  routes/                 # Express route handlers (route1.js, route2.js, etc.)
  services/               # Business logic modules (riskRating.js)
  main.py                 # FastAPI app for discount endpoint
  discount_logic.py       # Discount calculation logic
  tests/                  # Jest/Supertest tests for Node.js APIs
  test_discount.py        # Pytest for discount logic and API
  test_all_thirty_scenarios.py # Comprehensive TDD for discount logic/API
  package.json            # Node.js dependencies and scripts
```

## Running the Project

### Node.js/Express APIs

```sh
npm install
npm run dev
```

Server runs on `http://localhost:4000`.

### FastAPI (Python) Discount API

```sh
pip install fastapi uvicorn pytest
uvicorn main:app --reload
```

API available at `http://localhost:8000/discount`.

## Testing

- **Node.js:**  
  `npm test` (runs Jest/Supertest tests in `/tests`)
- **Python:**  
  `pytest` (runs all `test_*.py` files)

---

## Notes

- All endpoints include robust input validation and error handling.
- See `/tests` and `test_discount.py` for detailed test cases

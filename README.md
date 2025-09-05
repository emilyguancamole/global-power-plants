# Global Power Plants Dashboard

An interactive full-stack dashboard for exploring and editing data from the [Global Power Plant Database](https://datasets.wri.org/datasets/global-power-plant-database).

The app provides:
* Interactive map of global power plants, scaled by generating capacity and colored by fuel type
* Charts of country-level electricity generation over time and by fuel mix
* Editable overrides via a form that lets users update country-level generation or capacity data
* Real-time updates: changes submitted through the form are reflected in the charts without refresh

## Implementation Details
### Tech Stack
Backend
* PostgreSQL: relational schema for plants, countries, generation data, and override tables
* Express/Node.js: REST API server

Frontend
* React, TypeScript: component-based UI with static type safety
* Material UI: layout system and typography
* Shadcn, Tailwind CSS: fine-grained styling and modern components
* Leaflet: library for interactive maps
* Recharts: library for line and pie charts

DevOps / Infra
* Docker + Docker Compose: provides containerized API, frontend, and Postgres DB. Allows user to run locally with a single command.

### Project Structure (High-Level)
```
.
├── api/               # Express backend (routes, middleware, SQL queries)
├── web/               # React + TypeScript frontend
├── docker-compose.yml # Containerized services
├── data/              # CSVs for loading into Postgres. Note that this is not pushed to the repo
```

### Database Design
Normalized relational schema with the following tables:
* countries: country metadata
* power_plants: individual plant info (capacity, fuel, country)
* generation_data: annual generation data per plant
* country_capacity_overrides: manual edits to country-level capacity
* country_generation_overrides: manual edits to country-level generation

### API
Features:
* Endpoints for fetching plants, countries, generation data, and submitting overrides
    * Example: `GET /api/countries` returns list of countries with total capacity and generation, applying any overrides
* SQL queries with joins and aggregations to compute country-level summaries
* Basic API key authentication middleware

### Frontend
Features:
* Map: Leaflet map with markers sized by capacity and colored by fuel type
* Country Table: Top 25 countries by capacity (MUI DataGrid)
* Line Chart: Country's electricity generation trends (Recharts, with dynamic selection of up to 2 countries via Shadcn’s Command component)
* Pie Chart: Global fuel type breakdown
* Update Form: Shadcn form with validation to submit capacity or generation overrides

The UI is responsive and will resize with device/screen size.

Here's a screenshot of the full dashboard:

<img width="800" height="732" alt="power_plants_dashboard" src="https://github.com/user-attachments/assets/d088ce37-a4bc-4d80-85c2-755698bfd720" />

## To run locally

1. Clone this repository and navigate to the project directory.

2. To run in dev mode:
    - Navigate to the `api` directory and run `npm run dev`. This starts the API server on `http://localhost:3000`.
    - Next, add `.env` file to `web` directory with the following content:
        ```env
        VITE_API_URL=http://localhost:3000
        VITE_API_KEY=<your API_KEY from api/.env>
        ```
    - Start the application with `npm run dev` inside the `web` directory. This runs the application on `http://localhost:5173`.

3. To run with Docker:
    - From the project root: `docker compose up --build -d`. This builds and starts the API server, web app, and Postgres database in separate containers. The application runs on `http://localhost:5173`.
  
## Future Improvements
Add form validation with React Hook Form + Zod
Better error handling (API + UI toast notifications)
Migrate from local to global state management (using Redux or Nanostores) for scalability
Add unit tests for API and frontend components
Improve UI consistency by consolidating MUI + Shadcn theme systems

## Reference
Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2021. Global Power Plant Database version 1.3.0. Accessed through https://datasets.wri.org/datasets/global-power-plant-database.

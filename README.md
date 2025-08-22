# Global Power Plants Dashboard

This dashboard displays several statistics from the Global Power Plant Database and includes a form to edit country-level data.

**Reference:** 
Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2021. Global Power Plant Database version 1.3.0. Accessed through https://datasets.wri.org/datasets/global-power-plant-database.

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
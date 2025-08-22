# Global Power Plants Dashboard

This dashboard displays several statistics from the Global Power Plant Database and includes a form to edit country-level data.

Reference:

Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2021. Global Power Plant Database version 1.3.0. Accessed through https://datasets.wri.org/datasets/global-power-plant-database.

## To run locally

1. Clone this repository.

2. Navigate to the project directory.

3. To run in dev mode:
    - Navigate to the `api` directory and run `npm run dev`. This will start the mock server on `http://localhost:3000`.
    - Next, add `.env` file to `web` directory with the following content:
        ```bash
        VITE_API_URL=http://localhost:3000
        VITE_API_KEY=key that matches your API_KEY in api/.env
        ```
    - Start the application with `npm run dev` inside the `web` directory. This will run the application on `http://localhost:5173`.

4. To run in Docker container:
    - Stay in the project root directory. 
    - Run `docker compose up --build -d` to build and start the containers. This starts the api server, web app, and Postgres database in separate containers.
    - The application will run on `http://localhost:5173`.
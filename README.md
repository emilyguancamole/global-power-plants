# Global Power Plants Data


## Run locally

1. Clone this repository.

2. Navigate to the project directory.

3. To run the mock server API, navigate to the `api` directory and run `npm run dev`. This will start the mock server on `http://localhost:3000`.

4. Next, add `.env` file to `web` directory with the following content:

    ```bash
    VITE_API_URL=http://localhost:3000
    ```

5. Finally, start the application with `npm run dev` inside the `web` directory. This will run the application on `http://localhost:5173`.
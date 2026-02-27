# DeafCat Dubbing Dashboard (Web)

A React-based dashboard for the adaptation team, hosted on GitHub Pages.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    - Create a `.env` file for local development:
      ```
      VITE_SUPABASE_URL="your-project-url"
      VITE_SUPABASE_ANON_KEY="your-anon-key"
      ```
    - **For GitHub Pages:** Go to Repo Settings > Secrets and Variables > Actions > New Repository Secret. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3.  **Run Locally:**
    ```bash
    npm run dev
    ```

## Deployment

This repo is configured to auto-deploy to **GitHub Pages** on every push to `main`.
Ensure "GitHub Pages" is enabled in repository settings (Source: GitHub Actions).

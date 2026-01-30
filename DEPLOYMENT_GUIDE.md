# Deployment Guide for ConverteType

Since your hosting provider (`wuaze.com`) only supports PHP/HTML and not Node.js, we must split the application into two parts:

1.  **Server (Backend)**: Hosted on a free Node.js provider (like **Render**).
2.  **Client (Frontend)**: Hosted on your existing `wuaze.com` domain.

---

## Part 1: Deploying the Server (free)

We will use **Render** (render.com) because it supports Docker, which is required for tools like FFmpeg and Pandoc.

1.  **Push your code to GitHub**
    *   Create a new repository on GitHub.
    *   Push your entire `converteType` folder to it.

2.  **Create a Service on Render**
    *   Go to [dashboard.render.com](https://dashboard.render.com/) and create a free account.
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub account and select your repository.
    *   **Root Directory**: Set this to `server`.
    *   **Runtime**: Select **Docker**.
    *   **Instance Type**: Select **Free**.
    *   Click **Create Web Service**.

3.  **Wait for Deployment**
    *   Render will read the `Dockerfile` I created and install all necessary tools.
    *   Once valid, it will give you a URL (e.g., `https://project-name.onrender.com`).
    *   **Copy this URL.**

---

## Part 2: Building the Client

Now we need to tell the frontend website where your new server lives.

1.  **Update Configuration**
    *   Open the file `client/.env.production`.
    *   Replace `https://REPLACE_WITH_YOUR_RENDER_URL.onrender.com/api` with your **actual Render URL** (keep the `/api` at the end).
    *   Example: `VITE_API_URL=https://my-cool-converter.onrender.com/api`

2.  **Build the Website**
    *   Open your terminal in VS Code.
    *   Navigate to the client folder: `cd client`
    *   Run the build command:
        ```bash
        npm install
        npm run build
        ```
    *   This will create a new folder called `dist` inside `client/`.

---

## Part 3: Uploading to Wuaze.com

1.  **Access your Hosting**
    *   Log in to your control panel or use an FTP client (like FileZilla).
    *   Go to the `htdocs` folder (or where your site files should be).

2.  **Upload Files**
    *   Open the `client/dist` folder on your computer.
    *   Select **ALL** files inside `dist` (index.html, assets folder, etc.).
    *   Upload them to your hosting server.

3.  **Done!**
    *   Visit `convertfiles.wuaze.com`. Your site should now load and successfully convert files using the Render backend.

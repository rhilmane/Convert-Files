# ConverteType - Ultimate File Converter

A professional, scalable, and secure file conversion platform supporting Documents, Images, Audio, and Video.

##  Features

*   **Universal Conversion:** Support for Markdown, PDF, DOCX, Images, MP3, MP4, and more.
*   **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for a premium user experience.
*   **Real-time Progress:** Live progress bars for uploads and conversion via polling.
*   **Security:** Input validation, automatic file cleanup, and secure handling.
*   **Scalable Architecture:** Designed with separation of concerns (Client/Server) & Job Queue pattern.

##  Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, Axios, React Dropzone
*   **Backend:** Node.js, Express, Multer
*   **Processing:** Sharp (Images), Fluent-FFmpeg (Media), Pandoc/LibreOffice (Docs)

##  Installation & Setup

### Prerequisites
1.  **Node.js** (v18 or higher)
2.  **FFmpeg**: [Download here](https://ffmpeg.org/download.html) and add to system PATH.
3.  **Pandoc**: [Download here](https://pandoc.org/installing.html) (for Document conversion).
4.  **LibreOffice**: [Download here](https://www.libreoffice.org/download/download/) (for Office docs to PDF).

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
# client starts on http://localhost:5173
```

##  Testing the App

1.  Open the frontend URL.
2.  Drag and drop a file (e.g., an image `test.jpg`).
3.  Select target format (e.g., `png`).
4.  Click **Convert Now**.
5.  Watch the progress bar and download the result!

##  Note on Converters
The backend relies on system binaries for certain conversions:
*   **Images (JPG/PNG/WEBP):** Works out of the box (uses `sharp`).
*   **Audio/Video:** Requires FFmpeg installed on the host.
*   **Documents:** Requires Pandoc/LibreOffice installed on the host.
*   If a binary is missing, the conversion job will fail with an error in the console.

##  Security Measures
*   **File Limits:** Uploads limited to 500MB.
*   **Input Sanitization:** Filenames are UUID-generated internally to prevent overwrites and shell injection.
*   **Auto-Cleanup:** (To be configured) Use a cron job to delete files in `server/processed` older than 15 mins.

##  Deployment
*   **Frontend:** Deploy to Vercel/Netlify (build with `npm run build`).
*   **Backend:** Deploy to AWS EC2, DigitalOcean, or Heroku. Ensure `ffmpeg` and `pandoc` are installed in the environment (e.g. use a Dockerfile).

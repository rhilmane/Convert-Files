# ConverteType - Professional File Conversion Platform
## Project Architecture & Technical Specification

### 1. High-Level Architecture
The platform follows a **Client-Server** architecture (Separation of Concerns).

*   **Frontend (Client):** Single Page Application (SPA) built with **React (Vite)** and **Tailwind CSS**. It handles user interaction, file selection, drag-and-drop, and real-time progress updates.
*   **Backend (Server):** **Node.js** with **Express**. It handles API requests, file uploads, validation, and orchestrates the conversion processes using various system CLI tools and libraries.
*   **Storage:** Local temporary storage (for the MVP/Starter) with auto-cleanup capabilities.
*   **Worker/Queue System:** (Designed for) utilizing a job queue for dealing with heavy conversions asynchronously.

### 2. Technology Stack

#### Frontend
*   **Framework:** React 18+ (Vite)
*   **Styling:** Tailwind CSS (v3/v4), Framer Motion (animations), Lucide React (icons)
*   **State Management:** React Hooks / Context API
*   **HTTP Client:** Axios

#### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **File Uploads:** Multer
*   **Validation:** `file-type` (check buffer magic numbers), `joi` (schema validation)
*   **Security:** `helmet`, `cors`, `express-rate-limit`
*   **Utils:** `uuid` (unique IDs)

#### Conversion Engines (Dependencies)
*   **Documents (MD, DOCX, PDF):** `pandoc`, `libreoffice` (headless), `pdf-lib`
*   **Images:** `sharp` (Node.js high performance), `imagemagick` (CLI fallback)
*   **Audio/Video:** `ffmpeg` (via `fluent-ffmpeg`)

### 3. Folder Structure
```
converteType/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Dropzone, ProgressBar, FormatSelector)
│   │   ├── pages/          # Main Views
│   │   ├── hooks/          # Custom Hooks (useFileUpload)
│   │   └── api/            # API services
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # System paths, constants
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API definitions
│   │   ├── services/       # Conversion logic (Converter Factory)
│   │   │   ├── docConverter.js
│   │   │   ├── imgConverter.js
│   │   │   └── mediaConverter.js
│   │   ├── middleware/     # Upload, Validation, Error Handling
│   │   └── utils/          # File cleanup, helpers
│   ├── uploads/            # Temp raw files
│   └── processed/          # Converted files
├── README.md               # Documentation
└── architecture.md         # This file
```

### 4. API Routes
*   `POST /api/convert`: Primary endpoint. Accepts `multipart/form-data`, source format, target format. Returns Job ID.
*   `GET /api/status/:jobId`: Polling endpoint to check conversion status (Queued, Processing, Completed, Failed).
*   `GET /api/download/:jobId`: Stream the converted file.

### 5. Security & Scalability Strategy
*   **Sanitization:** Input filenames are sanitized to prevent shell injection.
*   **Validation:** Mime-type sniffing (not just extension check).
*   **Sandboxing:** Conversions run in spawned child processes. In a production cloud env, these would run in ephemeral Docker containers.
*   **Cleanup:** Cron job or `setTimeout` to delete files after X minutes (e.g., 15 mins).
*   **Rate Limiting:** IP-based limiting to prevent abuse.

### 6. Installation Requirements (System)
To run the full suite, the host machine must have:
*   Node.js (v18+)
*   FFmpeg (added to PATH)
*   Pandoc (added to PATH)
*   LibreOffice (optional, for DOCX/PDF exact conversions)

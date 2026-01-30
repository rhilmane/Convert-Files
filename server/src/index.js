import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Routes
import convertRoutes from './routes/convert.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for downloading processed files)
// In production, you'd use S3 or Nginx to serve these
app.use('/downloads', express.static(path.join(__dirname, '../processed')));

// Routes
app.use('/api', convertRoutes);

// Health Check (Deep check of binaries)
app.get('/api/health', async (req, res) => {
  const check = async (cmd, path) => {
    try {
      const { exec } = await import('child_process');
      const util = await import('util');
      const execPromise = util.promisify(exec);
      await execPromise(`"${path || cmd}" --version`);
      return 'ready';
    } catch { return 'missing'; }
  };

  const status = {
    server: 'online',
    engines: {
      images: 'ready', // sharp is internal
      pandoc: await check('pandoc'),
      latex: await check('pdflatex'),
      ffmpeg: await check('ffmpeg'),
      libreoffice: await check('soffice')
    }
  };
  res.json(status);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Ensure directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const processedDir = path.join(__dirname, '../processed');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);

// Background Cleanup (Every 30 minutes)
setInterval(() => {
  const folders = ['uploads', 'processed'];
  const now = Date.now();
  const MAX_AGE = 60 * 60 * 1000; // 1 Hour

  folders.forEach(folder => {
    const dir = path.join(__dirname, '..', folder);
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > MAX_AGE) {
          try { fs.unlinkSync(filePath); } catch (e) { }
        }
      });
    }
  });
  console.log('Cleanup task: Old files purged.');
}, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

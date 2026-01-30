import { createJob, getJob } from '../services/jobQueue.js';
import { processConversion } from '../services/converter.js';
import path from 'path';
import fs from 'fs';

export const submitConversion = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { outputFormat } = req.body;
        if (!outputFormat) {
            return res.status(400).json({ error: 'Target format is required' });
        }

        // Create a job
        const job = createJob(outputFormat, req.file.originalname);

        // Start processing asynchronously (don't await)
        processConversion(job.id, req.file.path, outputFormat);

        res.status(202).json({
            message: 'Conversion started',
            jobId: job.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getConversionStatus = (req, res) => {
    const { jobId } = req.params;
    const job = getJob(jobId);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
};

export const downloadFile = (req, res) => {
    // This could also just be served via static middleware, but this allows for checks
    // Currently handled by static in index.js for simplicity, but let's keep this if we want secure links later.
    // For now, the job.downloadUrl points to /downloads/filename which is static.
    // We can add a controller method if we want to stream it directly.
    res.status(501).json({ message: "Use the static /downloads URL provided in the job status." });
};

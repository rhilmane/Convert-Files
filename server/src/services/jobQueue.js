import { v4 as uuidv4 } from 'uuid';

// In-memory job store (Use Redis/Database for production)
const jobs = new Map();

export const createJob = (type, originalFilename) => {
    const id = uuidv4();
    const job = {
        id,
        type,
        originalFilename,
        status: 'queued', // queued, processing, completed, failed
        progress: 0,
        resultPath: null,
        downloadUrl: null,
        error: null,
        createdAt: new Date(),
    };
    jobs.set(id, job);
    return job;
};

export const getJob = (id) => jobs.get(id);

export const updateJob = (id, updates) => {
    const job = jobs.get(id);
    if (job) {
        Object.assign(job, updates);
        jobs.set(id, job);
    }
};

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, XCircle, ArrowRight, Loader2, Download } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [targetFormat, setTargetFormat] = useState('pdf');
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, error
    const [progress, setProgress] = useState(0);
    const [jobId, setJobId] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            setStatus('idle');
            setProgress(0);
            setDownloadUrl(null);
            setErrorMsg('');

            // Simple Auto-selection logic
            const ext = uploadedFile.name.split('.').pop().toLowerCase();
            if (ext === 'md') setTargetFormat('html');
            else if (['jpg', 'jpeg', 'png'].includes(ext)) setTargetFormat('webp');
            else if (['docx', 'xlsx', 'pptx'].includes(ext)) setTargetFormat('pdf');
            else {
                // Set the first available format if no specific logic matches
                const formats = getSupportedFormatsForExt(ext);
                if (formats.length > 0) setTargetFormat(formats[0].value);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: 500 * 1024 * 1024 // 500MB
    });

    const handleConvert = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', targetFormat);

        try {
            const res = await axios.post(`${API_URL}/convert`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setJobId(res.data.jobId);
            setStatus('processing');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.response?.data?.error || 'Upload failed');
        }
    };

    // Polling effect
    useEffect(() => {
        let interval;
        if (status === 'processing' && jobId) {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(`${API_URL}/status/${jobId}`);
                    const { status: jobStatus, progress: jobProgress, downloadUrl: url, error } = res.data;

                    if (jobStatus === 'completed') {
                        setStatus('completed');
                        setDownloadUrl(`http://localhost:5000${url}`);
                        setProgress(100);
                        clearInterval(interval);
                    } else if (jobStatus === 'failed') {
                        setStatus('error');
                        setErrorMsg(error || 'Conversion failed');
                        clearInterval(interval);
                    } else {
                        // processing or queued
                        setProgress(jobProgress || 0);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, jobId]);

    const getSupportedFormatsForExt = (ext) => {
        const audioFormats = ['mp3', 'wav', 'flac'];
        const videoFormats = ['mp4', 'avi', 'mov'];

        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
            return [
                { value: 'webp', label: 'WebP Image' },
                { value: 'png', label: 'PNG Image' },
                { value: 'jpg', label: 'JPG Image' },
            ];
        }

        if (ext === 'md') {
            return [
                { value: 'html', label: 'HTML Web Page' },
                { value: 'pdf', label: 'PDF Document' },
                { value: 'docx', label: 'Word Document (DOCX)' },
                { value: 'txt', label: 'Plain Text (TXT)' },
            ];
        }

        if (['docx', 'doc', 'pptx', 'xlsx'].includes(ext)) {
            return [
                { value: 'pdf', label: 'PDF Document' },
                { value: 'html', label: 'HTML Web Page' },
                { value: 'txt', label: 'Plain Text (TXT)' },
            ];
        }

        if (ext === 'pdf') {
            return [
                { value: 'docx', label: 'Word Document (DOCX)' },
                { value: 'txt', label: 'Plain Text (TXT)' },
                { value: 'html', label: 'HTML Web Page' },
            ];
        }

        if (audioFormats.concat(['m4a', 'ogg']).includes(ext)) {
            return audioFormats.map(f => ({ value: f, label: `${f.toUpperCase()} Audio` }));
        }

        if (videoFormats.concat(['mkv', 'webm']).includes(ext)) {
            return [
                ...videoFormats.map(f => ({ value: f, label: `${f.toUpperCase()} Video` })),
                { value: 'mp3', label: 'Extract MP3 Audio' }
            ];
        }

        // Default fallback
        return [
            { value: 'pdf', label: 'PDF Document' },
            { value: 'txt', label: 'Plain Text (TXT)' }
        ];
    };

    const allowedFormats = file ? getSupportedFormatsForExt(file.name.split('.').pop().toLowerCase()) : [];

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="glass-card rounded-3xl shadow-2xl overflow-hidden shadow-blue-500/5">

                {/* Dropzone */}
                {!file && (
                    <div className="relative group">
                        <div {...getRootProps()}
                            className={`p-10 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[350px]
                            ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/30'}`}>
                            <input {...getInputProps()} />

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-3xl mb-6 shadow-inner border border-white/5"
                            >
                                <Upload className="w-10 h-10 text-blue-400" />
                            </motion.div>

                            <p className="text-2xl font-bold text-white mb-2">
                                {isDragActive ? "Release to convert" : "Drop your files here"}
                            </p>
                            <p className="text-slate-400 mb-8">or click to browse from your device</p>

                            <div className="flex gap-4 flex-wrap justify-center">
                                <Badge label="Docs" />
                                <Badge label="Images" />
                                <Badge label="Audio" />
                                <Badge label="Video" />
                            </div>
                        </div>
                    </div>
                )}

                {/* File Selected State */}
                <AnimatePresence>
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8"
                        >
                            <div className="flex items-center justify-between mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-700 p-3 rounded-lg">
                                        <File className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-200 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                {status === 'idle' && (
                                    <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400 transition-colors">
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                )}
                            </div>

                            {/* Controls */}
                            {status === 'idle' && (
                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                                        <span className="text-slate-400">Convert to:</span>
                                        <select
                                            value={targetFormat}
                                            onChange={(e) => setTargetFormat(e.target.value)}
                                            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
                                        >
                                            {allowedFormats.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white select-item">{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleConvert}
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Convert Now
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}

                            {/* Processing State */}
                            {(status === 'uploading' || status === 'processing') && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>{status === 'uploading' ? 'Uploading...' : 'Converting...'}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-blue-500 relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </motion.div>
                                    </div>
                                    {status === 'processing' && (
                                        <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Processing your file...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Success State */}
                            {status === 'completed' && (
                                <div className="text-center space-y-6">
                                    <div className="inline-flex p-4 bg-green-500/10 rounded-full mb-2">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Conversion Successful!</h3>

                                    <div className="flex gap-4 justify-center">
                                        <a
                                            href={downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer" // Security best practice
                                            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all flex items-center gap-2"
                                            download
                                        >
                                            <Download className="w-5 h-5" />
                                            Download File
                                        </a>
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                setStatus('idle');
                                            }}
                                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all"
                                        >
                                            Convert Another
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {status === 'error' && (
                                <div className="text-center space-y-4">
                                    <div className="inline-flex p-4 bg-red-500/10 rounded-full">
                                        <XCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div className="text-red-400">
                                        <p className="font-bold">Conversion Failed</p>
                                        <p className="text-sm opacity-80">{errorMsg}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setStatus('idle');
                                        }}
                                        className="text-slate-400 hover:text-white text-sm underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Badge = ({ label }) => (
    <span className="px-3 py-1 bg-slate-800/80 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
    </span>
);

export default FileUpload;

import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { updateJob } from './jobQueue.js';
import { exec } from 'child_process';
import util from 'util';
import { marked } from 'marked';
import mammoth from 'mammoth';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROCESSED_DIR = path.join(__dirname, '../../processed');
const PANDOC_PATH = 'C:\\Users\\117\\AppData\\Local\\Pandoc\\pandoc.exe';
const PDF_ENGINE_PATH = 'C:\\Users\\117\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe';

const checkBinary = async (cmd) => {
    try {
        const command = (cmd === 'pandoc') ? PANDOC_PATH : cmd;
        await execPromise(`${command} --version`);
        return true;
    } catch {
        return false;
    }
};

export const processConversion = async (jobId, filePath, format) => {
    updateJob(jobId, { status: 'processing', progress: 0 });

    const outputFilename = `${jobId}.${format}`;
    const outputPath = path.join(PROCESSED_DIR, outputFilename);

    try {
        const inputExt = path.extname(filePath).toLowerCase().replace('.', '');

        // --- IMAGE CONVERSION ---
        const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'avif', 'svg'];
        if (imageFormats.includes(format) && imageFormats.includes(inputExt)) {
            await convertImage(filePath, outputPath, format);
        }

        // --- AUDIO/VIDEO/DOC CONVERSION ---
        else {
            // Check for required binaries
            if (['mp3', 'mp4', 'wav', 'avi', 'mkv', 'mov', 'flac'].includes(format)) {
                if (!(await checkBinary('ffmpeg'))) {
                    throw new Error('FFmpeg is not installed on the server. Audio/Video conversion requires FFmpeg.');
                }
                await convertMedia(jobId, filePath, outputPath, format);
            }
            else if (['pdf', 'docx', 'md', 'html', 'txt', 'epub'].includes(format)) {
                if (inputExt === 'md') {
                    // Pure JS supports MD to HTML and TXT
                    if (!['html', 'txt'].includes(format)) {
                        if (!(await checkBinary('pandoc'))) {
                            throw new Error('Pandoc is not installed on the server. MD to PDF/DOCX conversion requires Pandoc.');
                        }
                    }
                } else if (['docx', 'xlsx', 'pptx'].includes(inputExt)) {
                    // Pure JS supports DOCX to HTML and TXT
                    const canDoPureJS = inputExt === 'docx' && ['html', 'txt'].includes(format);
                    if (!canDoPureJS) {
                        if (!(await checkBinary('soffice'))) {
                            throw new Error('LibreOffice is not installed on the server. Office conversion requires LibreOffice.');
                        }
                    }
                }
                await convertDocument(filePath, outputPath, format, inputExt);
            } else {
                throw new Error(`Conversion from ${inputExt} to ${format} is not supported yet.`);
            }
        }

        updateJob(jobId, {
            status: 'completed',
            progress: 100,
            resultPath: outputFilename,
            downloadUrl: `/downloads/${outputFilename}`
        });

    } catch (error) {
        console.error("Conversion failed:", error);
        updateJob(jobId, { status: 'failed', error: error.message });
    }
};

// --- Helpers ---

const convertImage = async (input, output, format) => {
    // Sharp handles most standard formats
    // If output is .ico or specific formats, might need special handling
    let pipeline = sharp(input);

    if (format === 'jpg' || format === 'jpeg') {
        pipeline = pipeline.jpeg();
    } else if (format === 'png') {
        pipeline = pipeline.png();
    } else if (format === 'webp') {
        pipeline = pipeline.webp();
    }

    await pipeline.toFile(output);
};

const convertMedia = (jobId, input, output, format) => {
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .toFormat(format)
            .on('progress', (progress) => {
                // ffmpeg progress object has 'percent' (0-100)
                if (progress.percent) {
                    updateJob(jobId, { progress: Math.round(progress.percent) });
                }
            })
            .on('end', resolve)
            .on('error', reject)
            .save(output);
    });
};

const convertDocument = async (input, output, format, inputFormat) => {
    let command = '';

    // --- PURE JS CONVERSIONS (No external binaries required) ---

    // Markdown -> HTML (Pure JS)
    if (inputFormat === 'md' && format === 'html') {
        const content = fs.readFileSync(input, 'utf8');
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
                pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
                code { font-family: monospace; background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            </style>
        </head>
        <body>${marked(content)}</body>
        </html>`;
        fs.writeFileSync(output, html);
        return;
    }

    // Markdown -> Text (Pure JS - strip tags/markdown)
    if (inputFormat === 'md' && format === 'txt') {
        const content = fs.readFileSync(input, 'utf8');
        // Very basic MD to TXT (strip common MD chars)
        const txt = content.replace(/[#*`_~\[\]()<>]/g, '');
        fs.writeFileSync(output, txt);
        return;
    }

    // DOCX -> HTML (Pure JS using Mammoth)
    if (inputFormat === 'docx' && format === 'html') {
        const result = await mammoth.convertToHtml({ path: input });
        const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body>${result.value}</body>
        </html>`;
        fs.writeFileSync(output, html);
        return;
    }

    // DOCX -> Text (Pure JS using Mammoth)
    if (inputFormat === 'docx' && format === 'txt') {
        const result = await mammoth.extractRawText({ path: input });
        fs.writeFileSync(output, result.value);
        return;
    }

    // --- EXTERNAL BINARY CONVERSIONS ---

    // Markdown -> PDF/DOCX (Pandoc)
    if (inputFormat === 'md' && ['pdf', 'docx', 'epub'].includes(format)) {
        if (format === 'pdf') {
            command = `"${PANDOC_PATH}" "${input}" -o "${output}" --pdf-engine="${PDF_ENGINE_PATH}"`;
        } else {
            command = `"${PANDOC_PATH}" "${input}" -o "${output}"`;
        }
    }
    // PDF -> Text
    else if (inputFormat === 'pdf' && format === 'txt') {
        command = `pdftotext "${input}" "${output}"`;
    }
    // Office -> PDF (LibreOffice)
    else if (['docx', 'xlsx', 'pptx'].includes(inputFormat) && format === 'pdf') {
        const outDir = path.dirname(output);
        command = `soffice --headless --convert-to pdf --outdir "${outDir}" "${input}"`;
    }
    else {
        throw new Error(`No suitable converter found for ${inputFormat} to ${format}. Please install required system tools (Pandoc/LibreOffice).`);
    }

    if (command) {
        await execPromise(command);
        // Rename logic for LibreOffice
        if (command.includes('soffice')) {
            const baseName = path.basename(input, path.extname(input));
            const expectedOutput = path.join(path.dirname(output), `${baseName}.pdf`);
            if (fs.existsSync(expectedOutput) && expectedOutput !== output) {
                fs.renameSync(expectedOutput, output);
            }
        }
    }
};

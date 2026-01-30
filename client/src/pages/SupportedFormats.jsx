import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Image, FileText, Music, Video, ArrowRight,
    ArrowLeft, Check, X, Info, Sparkles, ChevronDown
} from 'lucide-react';

const SupportedFormats = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedFormat, setExpandedFormat] = useState(null);

    const categories = [
        { id: 'all', name: 'All Formats', icon: <Sparkles className="w-4 h-4" />, color: 'from-blue-500 to-purple-500' },
        { id: 'image', name: 'Images', icon: <Image className="w-4 h-4" />, color: 'from-pink-500 to-rose-500' },
        { id: 'document', name: 'Documents', icon: <FileText className="w-4 h-4" />, color: 'from-green-500 to-emerald-500' },
        { id: 'audio', name: 'Audio', icon: <Music className="w-4 h-4" />, color: 'from-amber-500 to-orange-500' },
        { id: 'video', name: 'Video', icon: <Video className="w-4 h-4" />, color: 'from-cyan-500 to-blue-500' },
    ];

    const formatGroups = {
        image: {
            title: 'Image Formats',
            description: 'Convert between all major image formats with high-quality processing using Sharp.',
            icon: <Image className="w-6 h-6" />,
            color: 'from-pink-500 to-rose-500',
            formats: [
                { ext: 'JPG/JPEG', desc: 'Joint Photographic Experts Group' },
                { ext: 'PNG', desc: 'Portable Network Graphics' },
                { ext: 'WebP', desc: 'Modern web format by Google' },
                { ext: 'GIF', desc: 'Graphics Interchange Format' },
                { ext: 'TIFF', desc: 'Tagged Image File Format' },
                { ext: 'AVIF', desc: 'AV1 Image File Format' },
                { ext: 'SVG', desc: 'Scalable Vector Graphics' },
            ],
            conversions: [
                { from: 'JPG', to: ['PNG', 'WebP', 'GIF', 'TIFF', 'AVIF'], status: 'full' },
                { from: 'PNG', to: ['JPG', 'WebP', 'GIF', 'TIFF', 'AVIF'], status: 'full' },
                { from: 'WebP', to: ['JPG', 'PNG', 'GIF', 'TIFF'], status: 'full' },
                { from: 'GIF', to: ['JPG', 'PNG', 'WebP'], status: 'full' },
                { from: 'TIFF', to: ['JPG', 'PNG', 'WebP'], status: 'full' },
                { from: 'SVG', to: ['PNG', 'JPG', 'WebP'], status: 'full' },
            ],
            requirements: 'No external dependencies required (Pure JavaScript with Sharp)'
        },
        document: {
            title: 'Document Formats',
            description: 'Convert documents between various formats. Some conversions require external tools.',
            icon: <FileText className="w-6 h-6" />,
            color: 'from-green-500 to-emerald-500',
            formats: [
                { ext: 'PDF', desc: 'Portable Document Format' },
                { ext: 'DOCX', desc: 'Microsoft Word Document' },
                { ext: 'MD', desc: 'Markdown' },
                { ext: 'HTML', desc: 'HyperText Markup Language' },
                { ext: 'TXT', desc: 'Plain Text' },
                { ext: 'EPUB', desc: 'Electronic Publication' },
                { ext: 'XLSX', desc: 'Microsoft Excel Spreadsheet' },
                { ext: 'PPTX', desc: 'Microsoft PowerPoint' },
            ],
            conversions: [
                { from: 'MD', to: ['HTML', 'TXT'], status: 'full', note: 'Pure JavaScript' },
                { from: 'MD', to: ['PDF', 'DOCX', 'EPUB'], status: 'requires', note: 'Requires Pandoc' },
                { from: 'DOCX', to: ['HTML', 'TXT'], status: 'full', note: 'Pure JavaScript (Mammoth)' },
                { from: 'DOCX', to: ['PDF'], status: 'requires', note: 'Requires LibreOffice' },
                { from: 'PDF', to: ['TXT'], status: 'requires', note: 'Requires pdftotext' },
                { from: 'XLSX', to: ['PDF'], status: 'requires', note: 'Requires LibreOffice' },
                { from: 'PPTX', to: ['PDF'], status: 'requires', note: 'Requires LibreOffice' },
            ],
            requirements: 'Some conversions require Pandoc, LibreOffice, or pdftotext'
        },
        audio: {
            title: 'Audio Formats',
            description: 'Convert audio files between popular formats using FFmpeg.',
            icon: <Music className="w-6 h-6" />,
            color: 'from-amber-500 to-orange-500',
            formats: [
                { ext: 'MP3', desc: 'MPEG Audio Layer III' },
                { ext: 'WAV', desc: 'Waveform Audio File' },
                { ext: 'FLAC', desc: 'Free Lossless Audio Codec' },
                { ext: 'AAC', desc: 'Advanced Audio Coding' },
                { ext: 'OGG', desc: 'Ogg Vorbis' },
                { ext: 'M4A', desc: 'MPEG-4 Audio' },
            ],
            conversions: [
                { from: 'MP3', to: ['WAV', 'FLAC', 'OGG'], status: 'requires' },
                { from: 'WAV', to: ['MP3', 'FLAC', 'OGG'], status: 'requires' },
                { from: 'FLAC', to: ['MP3', 'WAV', 'OGG'], status: 'requires' },
                { from: 'OGG', to: ['MP3', 'WAV', 'FLAC'], status: 'requires' },
                { from: 'M4A', to: ['MP3', 'WAV'], status: 'requires' },
            ],
            requirements: 'Requires FFmpeg installed on the server'
        },
        video: {
            title: 'Video Formats',
            description: 'Convert video files with full progress tracking using FFmpeg.',
            icon: <Video className="w-6 h-6" />,
            color: 'from-cyan-500 to-blue-500',
            formats: [
                { ext: 'MP4', desc: 'MPEG-4 Video' },
                { ext: 'AVI', desc: 'Audio Video Interleave' },
                { ext: 'MKV', desc: 'Matroska Video' },
                { ext: 'MOV', desc: 'QuickTime File Format' },
                { ext: 'WebM', desc: 'WebM Video' },
                { ext: 'FLV', desc: 'Flash Video' },
            ],
            conversions: [
                { from: 'MP4', to: ['AVI', 'MKV', 'MOV', 'WebM'], status: 'requires' },
                { from: 'AVI', to: ['MP4', 'MKV', 'MOV', 'WebM'], status: 'requires' },
                { from: 'MKV', to: ['MP4', 'AVI', 'MOV', 'WebM'], status: 'requires' },
                { from: 'MOV', to: ['MP4', 'AVI', 'MKV', 'WebM'], status: 'requires' },
                { from: 'WebM', to: ['MP4', 'AVI', 'MKV'], status: 'requires' },
            ],
            requirements: 'Requires FFmpeg installed on the server'
        }
    };

    const filteredGroups = activeCategory === 'all'
        ? Object.entries(formatGroups)
        : Object.entries(formatGroups).filter(([key]) => key === activeCategory);

    return (
        <div className="min-h-screen relative overflow-hidden bg-darker">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-green-600/5 blur-[100px] rounded-full animate-pulse-slow"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-darker/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <img src="/logo.jpg" alt="ConverteType Logo" className="w-10 h-10 rounded-xl object-cover group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-2xl font-bold tracking-tight text-white">ConverteType</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <Link to="/supported-formats" className="text-blue-400 transition-colors">Supported Formats</Link>
                        <a href="#" className="hover:text-blue-400 transition-colors">API</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Pricing</a>
                        <button className="px-5 py-2.5 bg-white text-darker rounded-full hover:bg-blue-50 transition-all font-semibold">Sign In</button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                            200+ Conversion Paths
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Supported <span className="gradient-text">Formats</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                            A comprehensive list of all file formats supported by ConverteType. Convert between images, documents, audio, and video files effortlessly.
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-wrap justify-center gap-3 mb-12"
                    >
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category.id
                                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {category.icon}
                                {category.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* Format Groups */}
                    <div className="space-y-8">
                        <AnimatePresence mode="wait">
                            {filteredGroups.map(([key, group], index) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="glass-card rounded-[2rem] overflow-hidden"
                                >
                                    {/* Group Header */}
                                    <div className={`bg-gradient-to-r ${group.color} p-6 md:p-8`}>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                                {group.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-white">{group.title}</h2>
                                                <p className="text-white/80 text-sm mt-1">{group.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Supported Formats Pills */}
                                    <div className="p-6 md:p-8 border-b border-white/5">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Supported Extensions</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {group.formats.map((format) => (
                                                <div
                                                    key={format.ext}
                                                    className="group relative"
                                                >
                                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-default">
                                                        <span className="text-white font-bold text-sm">.{format.ext.toLowerCase()}</span>
                                                    </div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                        {format.desc}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Conversion Matrix */}
                                    <div className="p-6 md:p-8">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Conversion Paths</h3>
                                        <div className="space-y-3">
                                            {group.conversions.map((conv, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                    className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/5"
                                                >
                                                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                                                        <span className="text-blue-400 font-bold text-sm">{conv.from}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-slate-500" />
                                                    <div className="flex flex-wrap gap-2 flex-1">
                                                        {conv.to.map((target) => (
                                                            <span
                                                                key={target}
                                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm font-medium"
                                                            >
                                                                {target}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {conv.status === 'full' ? (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                                                                <Check className="w-3 h-3" />
                                                                Built-in
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                                                                <Info className="w-3 h-3" />
                                                                External
                                                            </span>
                                                        )}
                                                    </div>
                                                    {conv.note && (
                                                        <span className="text-xs text-slate-500 hidden md:block">{conv.note}</span>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Requirements Note */}
                                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-slate-400">
                                                <span className="text-white font-medium">Requirements:</span> {group.requirements}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                    >
                        {[
                            { label: 'Image Formats', value: '7+', color: 'from-pink-500 to-rose-500' },
                            { label: 'Document Formats', value: '8+', color: 'from-green-500 to-emerald-500' },
                            { label: 'Audio Formats', value: '6+', color: 'from-amber-500 to-orange-500' },
                            { label: 'Video Formats', value: '6+', color: 'from-cyan-500 to-blue-500' },
                        ].map((stat, idx) => (
                            <div key={idx} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                                <div className={`text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 text-sm mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-center mt-20"
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Start Converting Now
                        </Link>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="ConverteType Logo" className="w-6 h-6 rounded-md object-cover" />
                        <span className="font-bold text-white">ConverteType</span>
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 ConverteType. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Github</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SupportedFormats;

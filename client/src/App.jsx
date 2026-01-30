import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Layers } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-darker">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      </div>

      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-darker/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <img src="/logo.jpg" alt="ConverteType Logo" className="w-10 h-10 rounded-xl object-cover group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">ConverteType</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link to="/supported-formats" className="hover:text-blue-400 transition-colors">Supported Formats</Link>
            <a href="#" className="hover:text-blue-400 transition-colors">API</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Pricing</a>
            <ThemeToggle />
            <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-darker rounded-full hover:bg-slate-800 dark:hover:bg-blue-50 transition-all font-semibold">Sign In</button>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              Cloud Powered • Ultra Fast
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-6 leading-tight">
              Convert Files <br />
              <span className="gradient-text">Anytime, Anywhere.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
              The free, secure, and unlimited file converter. Convert documents, images, audio, and video quickly without losing quality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <FileUpload />
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-blue-400" />}
              title="Lightning Fast"
              description="Powered by advanced cloud servers to ensure your conversions are processed in seconds, not minutes."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-purple-400" />}
              title="Secure & Private"
              description="Your files are encrypted during transfer and automatically deleted from our servers after 15 minutes."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-green-400" />}
              title="All Formats"
              description="From Markdown to PDF, MP4 to MP3, or PNG to WebP. We support over 200+ file format combinations."
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="ConverteType Logo" className="w-6 h-6 rounded-md object-cover" />
            <span className="font-bold text-slate-800 dark:text-white">ConverteType</span>
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

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card p-10 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-500 group text-left relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

export default App;

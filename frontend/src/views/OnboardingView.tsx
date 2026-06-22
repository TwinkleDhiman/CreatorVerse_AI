import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Upload, Sparkles, ArrowRight, FileText, CheckCircle, X } from 'lucide-react';

interface Props {
  onAnalyze: (url: string, contextData: string) => void;
}

// Platform icon SVGs as simple inline components
const YTIcon = () => <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>;
const IGIcon = () => <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const LIIcon = () => <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const XIcon = () => <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.622 5.906-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;

const DEMO_LINKS = [
  // YouTube
  { label: 'MrBeast', url: 'https://www.youtube.com/@MrBeast', tag: 'Entertainment', platform: 'youtube', color: 'text-red-400' },
  { label: 'MKBHD', url: 'https://www.youtube.com/@mkbhd', tag: 'Tech', platform: 'youtube', color: 'text-red-400' },
  { label: 'GaryVee', url: 'https://www.youtube.com/@garyvee', tag: 'Business', platform: 'youtube', color: 'text-red-400' },
  { label: 'Veritasium', url: 'https://www.youtube.com/@veritasium', tag: 'Science', platform: 'youtube', color: 'text-red-400' },
  // Instagram
  { label: 'Nat Geo', url: 'https://www.instagram.com/natgeo/', tag: 'Photography', platform: 'instagram', color: 'text-pink-400' },
  { label: 'GaryVee', url: 'https://www.instagram.com/garyvee/', tag: 'Business', platform: 'instagram', color: 'text-pink-400' },
  { label: 'NASA', url: 'https://www.instagram.com/nasa/', tag: 'Science', platform: 'instagram', color: 'text-pink-400' },
  // LinkedIn
  { label: 'Neil Patel', url: 'https://www.linkedin.com/in/neilkpatel/', tag: 'Marketing', platform: 'linkedin', color: 'text-blue-400' },
  { label: 'GaryVee', url: 'https://www.linkedin.com/in/garyvaynerchuk/', tag: 'Business', platform: 'linkedin', color: 'text-blue-400' },
  { label: 'Satya Nadella', url: 'https://www.linkedin.com/in/satyanadella/', tag: 'Tech CEO', platform: 'linkedin', color: 'text-blue-400' },
  // X (Twitter)
  { label: 'Elon Musk', url: 'https://x.com/elonmusk', tag: 'Tech', platform: 'x', color: 'text-white/80' },
  { label: 'GaryVee', url: 'https://x.com/garyvee', tag: 'Business', platform: 'x', color: 'text-white/80' },
  { label: 'Naval', url: 'https://x.com/naval', tag: 'Startups', platform: 'x', color: 'text-white/80' },
];

const platformGroups = [
  { id: 'youtube', label: 'YouTube', Icon: YTIcon, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
  { id: 'instagram', label: 'Instagram', Icon: IGIcon, color: 'text-pink-400', border: 'border-pink-500/20', bg: 'bg-pink-500/5' },
  { id: 'linkedin', label: 'LinkedIn', Icon: LIIcon, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
  { id: 'x', label: 'X / Twitter', Icon: XIcon, color: 'text-white/70', border: 'border-white/10', bg: 'bg-white/5' },
];

export default function OnboardingView({ onAnalyze }: Props) {
  const [url, setUrl] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target?.result as string || '');
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = () => {
    const canSubmit = (activeTab === 'url' && url.trim()) || (activeTab === 'upload' && fileContent);
    if (!canSubmit) return;
    onAnalyze(activeTab === 'url' ? url.trim() : '', fileContent);
  };

  const canSubmit = (activeTab === 'url' && url.trim()) || (activeTab === 'upload' && fileContent.trim());

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full relative z-10">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-purple-500/20 border border-purple-500/30 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <Sparkles size={40} className="text-purple-400" />
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tight">Initiate DNA Analysis</h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto">
          Connect your platform link or upload your raw analytics file to generate a hyper-personalized creator strategy.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-white/10 rounded-[2rem] p-2 w-full max-w-2xl backdrop-blur-sm"
      >
        {/* Tabs */}
        <div className="flex gap-2 p-2 mb-2 bg-white/5 rounded-3xl">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'url' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Link size={18} /> Platform Link
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'upload' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Upload size={18} /> Upload File
          </button>
        </div>

        <div className="px-6 py-4">
          <AnimatePresence mode="wait">
            {activeTab === 'url' ? (
              <motion.div key="url" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                <label className="block text-white/70 font-medium text-sm">Target URL (YouTube, Instagram, LinkedIn, X)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Link size={20} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="e.g., https://youtube.com/@mkbhd or https://x.com/naval"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all text-base"
                    onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  />
                </div>

                {/* Multi-platform demo quick-links */}
                <div className="space-y-3">
                  <p className="text-xs text-white/40">Or try a demo creator:</p>
                  <div className="space-y-2">
                    {platformGroups.map(pg => {
                      const links = DEMO_LINKS.filter(d => d.platform === pg.id);
                      const PIcon = pg.Icon;
                      return (
                        <div key={pg.id} className={`rounded-2xl border ${pg.border} ${pg.bg} px-3 py-2.5`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={pg.color}><PIcon /></span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${pg.color}`}>{pg.label}</span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {links.map(d => (
                              <button
                                key={d.url}
                                onClick={() => setUrl(d.url)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                  url === d.url
                                    ? 'bg-purple-600 border-purple-500 text-white'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {d.label} · <span className="opacity-60">{d.tag}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-white/30">The AI analyzes the public metadata of this URL to establish your core brand identity.</p>
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <label className="block text-white/70 font-medium text-sm">Upload Analytics File (CSV, JSON, TXT)</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.txt,.pdf"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    isDragging
                      ? 'border-purple-400 bg-purple-500/10'
                      : fileContent
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-white/15 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  {fileContent ? (
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle size={36} className="text-green-400" />
                      <div>
                        <p className="font-bold text-green-400 text-sm">{fileName}</p>
                        <p className="text-xs text-white/40 mt-1">{fileContent.split('\n').length} rows loaded — ready to analyze</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setFileContent(''); setFileName(''); }}
                        className="mt-1 text-white/30 hover:text-white/60 text-xs flex items-center gap-1"
                      >
                        <X size={12} /> Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <FileText size={28} className="text-white/40" />
                      </div>
                      <div>
                        <p className="font-semibold text-white/70 text-sm">Drop your file here or click to browse</p>
                        <p className="text-xs text-white/30 mt-1">Supports .csv, .json, .txt, .pdf — max 5MB</p>
                      </div>
                      <div className="flex gap-2 text-xs text-white/30 mt-1">
                        <span className="bg-white/5 px-2 py-0.5 rounded-md">.CSV</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded-md">.JSON</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded-md">.TXT</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded-md">.PDF</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/30">Your raw data overrides public estimates — Audience Council and revenue splits will exactly reflect your actual numbers.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={handleAnalyze}
            disabled={!canSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
          >
            Commence Analysis <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

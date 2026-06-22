import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Globe, Lightbulb, MessageSquare, BarChart3, Settings, Sparkles, Zap } from 'lucide-react';
import { glass } from './shared';
import IntroSplash from './components/IntroSplash';
import ShaderBackground from './components/ShaderBackground';
import DashboardView from './views/DashboardView';
import AIAdvisorView from './views/AIAdvisorView';
import MultiverseView from './views/MultiverseView';
import OpportunitiesView from './views/OpportunitiesView';
import AudienceView from './views/AudienceView';
import AnalyticsView from './views/AnalyticsView';
import BrandOracleView from './views/BrandOracleView';
import SettingsView from './views/SettingsView';
import OnboardingView from './views/OnboardingView';
import AnalysisLoadingView from './components/AnalysisLoadingView';

type View = 'onboarding' | 'dashboard' | 'audience' | 'multiverse' | 'opportunities' | 'oracle' | 'advisor' | 'analytics' | 'settings';
export type AIModelType = 'gemini' | 'claude' | 'gpt4' | 'hybrid';

const themeMap = {
  gemini: { glow1: 'bg-violet-500/25', glow2: 'bg-pink-500/20', glow3: 'bg-blue-500/20', particle: 'shadow-[0_0_12px_2px_rgba(255,255,255,0.9)]' },
  claude: { glow1: 'bg-orange-500/25', glow2: 'bg-amber-500/20', glow3: 'bg-yellow-500/20', particle: 'shadow-[0_0_12px_2px_rgba(249,115,22,0.8)]' },
  gpt4: { glow1: 'bg-emerald-500/25', glow2: 'bg-teal-500/20', glow3: 'bg-green-400/20', particle: 'shadow-[0_0_12px_2px_rgba(16,185,129,0.8)]' },
  hybrid: { glow1: 'bg-pink-500/25', glow2: 'bg-rose-500/20', glow3: 'bg-fuchsia-500/20', particle: 'shadow-[0_0_12px_2px_rgba(236,72,153,0.8)]' }
};

const navItems: { id: View; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'audience', label: 'Audience Council', icon: Users },
  { id: 'multiverse', label: 'Multiverse', icon: Globe },
  { id: 'opportunities', label: 'Opportunities', icon: Lightbulb },
  { id: 'oracle', label: 'Brand Oracle', icon: Zap },
  { id: 'advisor', label: 'AI Advisor', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Generate particles once (stable across renders)
const particles = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  width: Math.random() * 3 + 1,
  height: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 10 + Math.random() * 20,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.4 + 0.1,
}));

// PlaceholderView removed

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname === '/' ? 'onboarding' : location.pathname.substring(1) as View;
  const [aiModel, setAiModel] = useState<AIModelType>('gpt4');
  const [creatorName, setCreatorName] = useState('Creator');
  const [niche, setNiche] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [contextData, setContextData] = useState('');
  const [platform, setPlatform] = useState<string>('youtube');
  
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeTrigger, setAnalyzeTrigger] = useState(0);

  const handleAnalyze = (url: string, context: string) => {
    setSourceUrl(url);
    setContextData(context);
    setDashboard(null);
    setIsAnalyzing(true);
    setLoading(true);

    let detectedPlatform = platform;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) detectedPlatform = 'instagram';
    else if (lowerUrl.includes('linkedin.com')) detectedPlatform = 'linkedin';
    else if (lowerUrl.includes('x.com') || lowerUrl.includes('twitter.com')) detectedPlatform = 'x';
    else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) detectedPlatform = 'youtube';
    
    setPlatform(detectedPlatform);
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!sourceUrl && !contextData) return;

    setLoading(true);
    axios.post(`/api/dashboard?model=${aiModel}&platform=${platform}`, {
      sourceUrl,
      contextData,
      name: creatorName,
      niche
    })
      .then(r => {
        setDashboard(r.data);
        if (r.data.creator?.name) setCreatorName(r.data.creator.name);
        if (r.data.creator?.niche) setNiche(r.data.creator.niche);
      })
      .catch((err) => {
        console.error('Failed to fetch dynamic dashboard', err);
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
        setDashboard({
          _error: true,
          _errorMessage: `API Error: ${errorMsg}`,
          creator: { name: creatorName || 'Creator', followers: 0, monthlyRevenue: 0, engagementRate: 0, growthScore: 0 }
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [platform, sourceUrl, contextData, creatorName, analyzeTrigger]);

  // If user reloads the page on a dashboard route, data is lost. Redirect back to onboarding.
  useEffect(() => {
    if (!showSplash && currentView !== 'onboarding' && !dashboard && !isAnalyzing && !sourceUrl && !contextData) {
      navigate('/');
    }
  }, [showSplash, currentView, dashboard, isAnalyzing, sourceUrl, contextData, navigate]);

  const content = useMemo(() => {
    if (dashboard?._error) return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold">Analysis Failed</h2>
        <p className="text-white/50 max-w-sm text-sm">
          {dashboard._errorMessage || "The backend could not be reached or returned an error. Make sure the backend is running on port 5000 and your OPENROUTER_API_KEY is set in backend/.env."}
        </p>
        <button onClick={() => navigate('/')} className="mt-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-semibold transition-all">← Try Again</button>
      </div>
    );
    return (
      <Routes>
        <Route path="/" element={<OnboardingView onAnalyze={handleAnalyze} />} />
        <Route path="/dashboard" element={<DashboardView dashboard={dashboard} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/audience" element={<AudienceView audience={dashboard?.audience || []} />} />
        <Route path="/multiverse" element={<MultiverseView scenarios={dashboard?.scenarios || []} aiModel={aiModel} creatorName={creatorName} niche={niche} sourceUrl={sourceUrl} contextData={contextData} />} />
        <Route path="/opportunities" element={<OpportunitiesView aiModel={aiModel} creatorName={creatorName} niche={niche} sourceUrl={sourceUrl} contextData={contextData} />} />
        <Route path="/advisor" element={<AIAdvisorView aiModel={aiModel} creatorName={creatorName} niche={niche} sourceUrl={sourceUrl} contextData={contextData} />} />
        <Route path="/analytics" element={<AnalyticsView analytics={dashboard?.analytics} aiModel={aiModel} />} />
        <Route path="/oracle" element={<BrandOracleView oracle={dashboard?.oracle} aiModel={aiModel} creatorName={creatorName} niche={niche} sourceUrl={sourceUrl} contextData={contextData} />} />
        <Route path="/settings" element={<SettingsView aiModel={aiModel} setAiModel={setAiModel} creatorName={creatorName} setCreatorName={setCreatorName} niche={niche} setNiche={setNiche} />} />
        <Route path="*" element={<OnboardingView onAnalyze={handleAnalyze} />} />
      </Routes>
    );
  }, [currentView, dashboard, loading, aiModel, creatorName, niche, sourceUrl, contextData]);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <IntroSplash key="splash" onComplete={() => setShowSplash(false)} />
      ) : (<>
      {/* Full-screen Analysis Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            key="analysis-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b2a]/40 backdrop-blur-md"
          >
            <AnalysisLoadingView
              platform={platform}
              data={loading ? null : dashboard}
              onComplete={() => setIsAnalyzing(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden bg-[#070B2A] -z-20">
        <ShaderBackground />
        <div className={`absolute top-[-10%] left-[-10%] w-225 h-225 rounded-full ${themeMap[aiModel].glow1} blur-[250px] transition-colors duration-1000`} />
        <div className={`absolute bottom-[-20%] left-0 w-175 h-175 rounded-full ${themeMap[aiModel].glow2} blur-[220px] transition-colors duration-1000`} />
        <div className={`absolute top-[15%] right-[5%] w-150 h-150 rounded-full ${themeMap[aiModel].glow3} blur-[220px] transition-colors duration-1000`} />
        <div className="absolute top-[40%] right-[20%] w-75 h-75 rounded-full bg-cyan-400/25 blur-[120px] animate-[float_12s_ease-in-out_infinite]" />
        <div className={`absolute top-[10%] left-[-30%] w-250 h-250 rounded-full ${themeMap[aiModel].glow1} blur-[260px] animate-[slideX_40s_linear_infinite] transition-colors duration-1000`} />
        <div className={`absolute top-[50%] left-[-20%] w-175 h-175 rounded-full ${themeMap[aiModel].glow3} blur-[220px] animate-[slideX_25s_linear_infinite_reverse] transition-colors duration-1000`} />
        <div className="absolute top-[5%] right-[3%] w-125 h-125 rounded-full border border-white/10" />
        <div className="absolute left-[2%] top-[25%] w-70 h-70 rounded-full border border-white/5" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        {particles.map(p => (
          <div key={p.id} className={`absolute rounded-full bg-white ${themeMap[aiModel].particle} pointer-events-none transition-all duration-1000`}
            style={{ 
              width: p.width, 
              height: p.height, 
              left: `${p.left}%`, 
              top: `${p.top}%`, 
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate` 
            }} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#020617_100%)] pointer-events-none" />
      </div>

      {/* Layout */}
      {!isAnalyzing && (
        <div className="relative min-h-screen p-8 text-white z-10 max-w-[1700px] mx-auto flex flex-col font-sans">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="text-purple-400" size={28} />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">CreatorVerse</span>
              <span className="bg-purple-600/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/20 ml-2">PRO</span>
            </div>
            <p className="text-white/40 text-sm mt-1">AI-Powered Creator Strategy Engine</p>
          </div>
          {currentView !== 'onboarding' && (
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white hover:border-purple-500/50 transition-colors flex items-center gap-2">
                  {platform === 'youtube' && 'YouTube'}
                  {platform === 'instagram' && 'Instagram'}
                  {platform === 'linkedin' && 'LinkedIn'}
                  {platform === 'x' && 'X (Twitter)'}
                  {platform === 'combined' && 'Combined Profile'}
                  <span className="text-white/40 text-xs">▼</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 bg-[#0a0f2e]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                  {['youtube', 'instagram', 'linkedin', 'x', 'combined'].map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setPlatform(p);
                        setDashboard(null);
                        setIsAnalyzing(true);
                        setLoading(true);
                        setAnalyzeTrigger(t => t + 1);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${platform === p ? 'bg-purple-500/20 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                      {p === 'youtube' && 'YouTube'}
                      {p === 'instagram' && 'Instagram'}
                      {p === 'linkedin' && 'LinkedIn'}
                      {p === 'x' && 'X (Twitter)'}
                      {p === 'combined' && 'Combined Profile'}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { 
                  setDashboard(null);
                  setIsAnalyzing(true);
                  setLoading(true); 
                  setAnalyzeTrigger(t => t + 1); 
                }}
                className="text-xs text-white/40 hover:text-purple-400 transition-all border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <Zap size={11} /> Re-analyze
              </button>
              <div className="text-right">
                <p className="text-sm font-bold">{creatorName}</p>
                <p className="text-[10px] text-white/50">{niche}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px]">
                <div className="w-full h-full bg-[#0a0f2e] rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold">{creatorName.charAt(0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8 flex-1 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          {currentView !== 'onboarding' && (
            <aside className={`w-60 rounded-3xl p-5 ${glass} flex flex-col gap-1 shrink-0`}>
              <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0 rounded-3xl" />
              <div className="relative z-10 mb-4 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center border border-purple-500/30">
                  <Sparkles className="text-purple-300" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{dashboard?.creator?.name || 'Creator'}</p>
                  <p className="text-white/40 text-xs">Score: {dashboard?.creator?.growthScore || 85}/100</p>
                </div>
              </div>

              <nav className="relative z-10 flex flex-col gap-1 flex-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/${item.id}`)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all w-full text-left ${active
                          ? 'bg-white/15 text-white font-medium border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`}
                    >
                      <Icon size={17} className={active ? 'text-purple-300' : ''} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="relative z-10 mt-2 pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Creator Score</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold">{dashboard?.creator?.growthScore || 85}</span>
                  <span className="text-white/40 text-sm">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full">
                  <div className="h-full bg-linear-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${dashboard?.creator?.growthScore || 85}%` }} />
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-w-0"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      )}
    </>
    )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { glass } from '../shared';

const Reflection = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />
);

const scenarioColors = [
  { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'text-green-400', bar: 'from-blue-400 to-indigo-500', shadow: 'shadow-[0_0_10px_rgba(99,102,241,0.5)]', icon: '👨‍🏫' },
  { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'text-purple-300', bar: 'from-purple-400 to-pink-500', shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.5)]', icon: '🤝' },
  { bg: 'bg-pink-500/20 text-pink-400 border-pink-500/30', label: 'text-pink-400', bar: 'from-pink-400 to-rose-500', shadow: 'shadow-[0_0_10px_rgba(236,72,153,0.5)]', icon: '📧' },
];

const modelLabels: Record<string, string> = {
  gemini: 'Gemini',
  claude: 'Claude',
  gpt4: 'GPT-4',
  hybrid: 'Hybrid Consensus',
};

interface Props {
  scenarios: any[];
  aiModel?: string;
  creatorName?: string;
  niche?: string;
  sourceUrl?: string;
  contextData?: string;
}

export default function MultiverseView({ scenarios: initialScenarios, aiModel = 'gemini', creatorName = 'Creator', niche = '', sourceUrl = '', contextData = '' }: Props) {
  const [customAction, setCustomAction] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>(initialScenarios);
  const [scenariosLoading, setScenariosLoading] = useState(false);

  // Re-fetch scenarios when AI model changes
  useEffect(() => {
    if (!sourceUrl && !contextData && !creatorName) {
      setScenarios(initialScenarios);
      return;
    }
    setScenariosLoading(true);
    axios.post(`/api/dashboard?model=${aiModel}&platform=combined`, {
      sourceUrl, contextData, name: creatorName, niche
    })
      .then(r => {
        if (r.data?.scenarios) setScenarios(r.data.scenarios);
      })
      .catch(() => setScenarios(initialScenarios))
      .finally(() => setScenariosLoading(false));
  }, [aiModel]);

  const simulate = async () => {
    if (!customAction.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/multiverse/simulate', {
        action: customAction, model: aiModel
      });
      setResult(res.data);
    } catch {
      setResult({ error: 'Simulation failed. Check your API keys.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1">Creator Multiverse</h2>
          <p className="text-white/50">Simulate any scenario. Decide with confidence.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Scenarios via <span className="text-purple-300 font-semibold ml-1">{modelLabels[aiModel] || aiModel}</span>
        </div>
      </div>

      {/* Default Scenarios */}
      <div className="grid grid-cols-3 gap-5 mb-6 relative">
        <AnimatePresence mode="wait">
          {scenariosLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-3 flex items-center justify-center gap-3 py-16 text-white/40"
            >
              <Loader2 size={20} className="animate-spin text-purple-400" />
              <span className="text-sm">Regenerating scenarios with {modelLabels[aiModel]}...</span>
            </motion.div>
          ) : (
            <motion.div
              key={`scenarios-${aiModel}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="contents"
            >
              {scenarios.map((s, i) => {
                const c = scenarioColors[i % 3];
                return (
                  <motion.div key={s.title} whileHover={{ scale: 1.02, y: -4, boxShadow: '0 20px 60px rgba(168,85,247,.25)' }}
                    className={`${glass} rounded-2xl p-6 flex flex-col cursor-default`}>
                    <Reflection />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-xl">{s.title}</h4>
                        <span className="text-2xl">{c.icon}</span>
                      </div>
                      <p className={`${c.label} text-xs font-bold uppercase tracking-wider mb-5`}>{s.type}</p>
                      <div className="flex justify-between mb-5">
                        <div>
                          <p className="text-white/40 text-xs mb-1">Impact</p>
                          <p className="font-bold text-lg">{s.revenue}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-xs mb-1">Audience Fit</p>
                          <p className="text-green-400 font-bold text-lg">{s.growth}</p>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span>Success Probability</span>
                          <span className="text-white font-bold">{s.probability}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full">
                          <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full ${c.shadow}`} style={{ width: `${s.probability}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Simulation */}
      <div className={`${glass} rounded-3xl p-7`}>
        <Reflection />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold">Simulate Your Own Scenario</h3>
            <span className="text-xs text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg ml-auto">
              via {modelLabels[aiModel] || aiModel}
            </span>
          </div>
          <p className="text-white/50 text-sm mb-5">Describe any action and our AI will predict Best, Expected &amp; Worst outcomes.</p>
          <div className="flex gap-3 mb-5">
            <input
              value={customAction}
              onChange={e => setCustomAction(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && simulate()}
              placeholder='e.g. "Launch a paid membership community"'
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <button onClick={simulate} disabled={loading || !customAction.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Simulating...</> : 'Simulate →'}
            </button>
          </div>

          <AnimatePresence>
            {result && !result.error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Best Case', rev: result.bestRevenue, growth: result.bestGrowth, color: 'text-green-400', bg: 'border-green-500/20 bg-green-500/5' },
                  { label: 'Expected', rev: result.expectedRevenue, growth: result.expectedGrowth, color: 'text-purple-300', bg: 'border-purple-500/20 bg-purple-500/5' },
                  { label: 'Worst Case', rev: result.worstRevenue, growth: result.worstGrowth, color: 'text-pink-400', bg: 'border-pink-500/20 bg-pink-500/5' },
                ].map(r => (
                  <div key={r.label} className={`border rounded-2xl p-4 ${r.bg}`}>
                    <p className={`${r.color} text-xs font-bold uppercase mb-3`}>{r.label}</p>
                    <p className="font-bold text-lg mb-1">{r.rev}</p>
                    <p className="text-green-400 text-sm">{r.growth}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {result?.error && <p className="text-red-400 text-sm">{result.error}</p>}
        </div>
      </div>
    </div>
  );
}

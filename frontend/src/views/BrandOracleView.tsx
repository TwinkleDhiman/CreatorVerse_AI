import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Target, Zap, Shield, Compass, Star, Loader2 } from 'lucide-react';
import { glass } from '../shared';
import { motion, AnimatePresence } from 'framer-motion';

const modelLabels: Record<string, string> = {
  gemini: 'Gemini',
  claude: 'Claude',
  gpt4: 'GPT-4',
  hybrid: 'Hybrid Consensus',
};

interface Props {
  oracle?: any;
  aiModel?: 'gemini' | 'claude' | 'gpt4' | 'hybrid';
  creatorName?: string;
  niche?: string;
  sourceUrl?: string;
  contextData?: string;
}

export default function BrandOracleView({ oracle, aiModel = 'gemini', creatorName = 'Creator', niche = '', sourceUrl = '', contextData = '' }: Props) {
  const perceptionData = oracle?.perception || [];
  const competitors = oracle?.competitors || [];
  const healthScore = oracle?.healthScore || { score: 0, text: 'Awaiting AI analysis...' };

  const [expansionIdeas, setExpansionIdeas] = useState<any[]>(oracle?.expansion || []);
  const [expansionLoading, setExpansionLoading] = useState(false);

  useEffect(() => {
    setExpansionLoading(true);
    axios.post('/api/oracle/expansion', {
      model: aiModel, creatorName, niche, sourceUrl, contextData
    })
      .then(r => setExpansionIdeas(r.data))
      .catch(() => {
        if (oracle?.expansion) setExpansionIdeas(oracle.expansion);
      })
      .finally(() => setExpansionLoading(false));
  }, [aiModel]);

  return (
    <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-6 custom-scrollbar">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Brand Oracle</h2>
          <p className="text-white/50">AI-driven brand positioning and market gap analysis.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Analysis via <span className="text-purple-300 font-semibold ml-1">{modelLabels[aiModel] || aiModel}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Brand Health Score */}
        <div className={`${glass} p-8 rounded-3xl flex flex-col items-center justify-center text-center col-span-1`}>
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
            <Shield size={32} className="text-purple-400" />
          </div>
          <p className="text-white/50 uppercase tracking-widest text-xs font-bold mb-2">Brand Health Score</p>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 mb-4 transition-all duration-500">
            {healthScore.score}<span className="text-3xl text-white/30">/100</span>
          </div>
          <p className="text-white/70 text-sm transition-all duration-500">{healthScore.text}</p>
        </div>

        {/* Brand Perception Radar */}
        <div className={`${glass} p-6 rounded-3xl col-span-2 flex flex-col`}>
          <h3 className="font-bold flex items-center gap-2 mb-2"><Target size={18} className="text-blue-400"/> Audience Perception</h3>
          <p className="text-white/50 text-xs mb-4">How your audience categorizes your content</p>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={perceptionData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Brand" dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Brand Expansion - Live refresh on model change */}
        <div className={`${glass} p-6 rounded-3xl flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2"><Compass size={18} className="text-pink-400"/> Expansion Ideas</h3>
            {expansionLoading && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Loader2 size={12} className="animate-spin" />
                <span>{modelLabels[aiModel]} thinking...</span>
              </div>
            )}
          </div>
          <AnimatePresence mode="wait">
            {expansionLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="h-2 bg-white/5 rounded w-3/4" />
                      <div className="h-2 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`expansion-${aiModel}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                {expansionIdeas.map((idea: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                      <Zap size={20} className="text-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-bold text-white/90 leading-tight">{idea.title}</h4>
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">{idea.match}% Match</span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed mb-2">{idea.desc}</p>
                      {(idea.expectedRevenue || idea.expectedGrowth) && (
                        <div className="flex gap-3 text-xs mt-1">
                          {idea.expectedRevenue && (
                            <span className="text-green-400/80 font-medium">{idea.expectedRevenue}</span>
                          )}
                          {idea.expectedGrowth && (
                            <span className="text-blue-400/80 font-medium">{idea.expectedGrowth}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Competitor Analysis */}
        <div className={`${glass} p-6 rounded-3xl flex flex-col`}>
          <h3 className="font-bold flex items-center gap-2 mb-6"><Star size={18} className="text-yellow-400"/> Competitor Gap Analysis</h3>
          <div className="flex flex-col gap-4">
            {competitors.map((comp: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-white">{comp.name}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${comp.opportunity === 'High' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                    {comp.opportunity} Opp
                  </span>
                </div>
                <div className="text-sm text-white/60">
                  <span className="text-white/40 uppercase tracking-wider text-[10px] block mb-1">Identified Gap</span>
                  {comp.gap}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

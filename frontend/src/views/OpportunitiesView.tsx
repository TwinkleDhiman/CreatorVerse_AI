import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Zap, BookOpen, Users, Mail, Package, ExternalLink, Clock, DollarSign } from 'lucide-react';
import { glass } from '../shared';

const Reflection = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0 rounded-2xl" />
);

const typeIcon: Record<string, { icon: any; color: string; bg: string }> = {
  course:      { icon: BookOpen,  color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/20' },
  community:   { icon: Users,     color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/20' },
  newsletter:  { icon: Mail,      color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/20' },
  sponsorship: { icon: TrendingUp,color: 'text-green-400',  bg: 'bg-green-500/15 border-green-500/20' },
  product:     { icon: Package,   color: 'text-pink-400',   bg: 'bg-pink-500/15 border-pink-500/20' },
};

interface Props {
  aiModel?: 'gemini' | 'claude' | 'gpt4' | 'hybrid';
  creatorName?: string;
  niche?: string;
  sourceUrl?: string;
  contextData?: string;
}

const opsCache: Record<string, any[]> = {};

export default function OpportunitiesView({ aiModel = 'gemini', creatorName = 'Creator', niche = 'General', sourceUrl, contextData }: Props) {
  const [ops, setOps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cacheKey = `${aiModel}-${creatorName}-${niche}-${sourceUrl}`;
    if (opsCache[cacheKey]) {
      setOps(opsCache[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    axios.post(`/api/opportunities?model=${aiModel}`, {
      name: creatorName, niche, sourceUrl, contextData
    })
      .then(r => {
        setOps(r.data);
        opsCache[cacheKey] = r.data;
      })
      .catch(() => {
        setError('Could not load opportunities. Showing defaults.');
        setOps([]);
      })
      .finally(() => setLoading(false));
  }, [aiModel, creatorName, niche, sourceUrl, contextData]);

  const scoreColor = (s: number) => s >= 85 ? 'text-green-400' : s >= 70 ? 'text-yellow-400' : 'text-pink-400';
  const scoreBg   = (s: number) => s >= 85 ? 'from-green-400 to-emerald-500' : s >= 70 ? 'from-yellow-400 to-orange-400' : 'from-pink-400 to-rose-500';

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1">Opportunity Engine</h2>
        <p className="text-white/50">
          AI-ranked revenue opportunities for <span className="text-purple-400 font-semibold">{creatorName}</span>
          {sourceUrl && <> · sourced from <span className="text-white/40 text-xs font-mono">{sourceUrl.replace('https://','')}</span></>}
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/50">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
          </div>
          <p className="text-sm">Generating opportunities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {error && <p className="text-yellow-400/70 text-xs mb-2">⚠ {error}</p>}
          {ops.map((op, i) => {
            const meta = typeIcon[op.type] || { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/20' };
            const Icon = meta.icon;
            return (
              <div key={op.id || i} className={`relative ${glass} rounded-2xl p-6 flex items-center gap-6 hover:bg-white/10 transition-all`}>
                <Reflection />
                {/* Type icon */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${meta.bg}`}>
                  <Icon size={22} className={meta.color} />
                </div>

                {/* Main content */}
                <div className="relative z-10 flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-lg leading-tight">{op.title}</h3>
                    <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${meta.bg} ${meta.color}`}>{op.type}</span>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed mb-3">{op.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    {op.estimatedRevenue && (
                      <span className="flex items-center gap-1 text-green-400/80">
                        <DollarSign size={12} /> {op.estimatedRevenue}
                      </span>
                    )}
                    {op.timeToLaunch && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {op.timeToLaunch} to launch
                      </span>
                    )}
                  </div>
                </div>

                {/* Demand score */}
                <div className="relative z-10 text-right shrink-0 hidden sm:block">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Demand</p>
                  <p className={`text-3xl font-bold ${scoreColor(op.demandScore)}`}>{op.demandScore}</p>
                  <div className="w-20 h-1.5 bg-white/10 rounded-full mt-2 ml-auto">
                    <div className={`h-full bg-gradient-to-r ${scoreBg(op.demandScore)} rounded-full`} style={{ width: `${op.demandScore}%` }} />
                  </div>
                </div>

                {/* CTA */}
                <div className="relative z-10 shrink-0">
                  {op.actionUrl ? (
                    <a
                      href={op.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 hover:bg-purple-500 transition-all px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] whitespace-nowrap"
                    >
                      <ExternalLink size={13} /> Explore
                    </a>
                  ) : (
                    <button className="bg-purple-600 hover:bg-purple-500 transition-all px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <TrendingUp size={13} /> Explore
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

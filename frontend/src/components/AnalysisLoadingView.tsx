import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Users, LineChart, Zap, Lightbulb, CheckCircle } from 'lucide-react';

const STAGES = [
  { id: 1, title: 'Analyzing Creator DNA', desc: 'Understanding creator identity, niche, and content themes.', icon: Activity },
  { id: 2, title: 'Building Audience Council', desc: 'Identifying audience personas and behavioral patterns.', icon: Users },
  { id: 3, title: 'Detecting Growth Signals', desc: 'Analyzing engagement patterns and momentum indicators.', icon: LineChart },
  { id: 4, title: 'Consulting Brand Oracle', desc: 'Generating strategic recommendations and brand opportunities.', icon: Zap },
  { id: 5, title: 'Discovering Opportunities', desc: 'Finding monetization paths and growth opportunities.', icon: Lightbulb },
  { id: 6, title: 'Preparing Command Center', desc: 'Assembling insights and recommendations.', icon: CheckCircle },
];

const STAGE_DURATION = 900; // ms per stage
const MIN_DURATION = STAGES.length * STAGE_DURATION; // ~5.4 seconds

interface Props {
  platform: string;
  data: any | null;
  onComplete: () => void;
}

export default function AnalysisLoadingView({ platform, data, onComplete }: Props) {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTime = useRef(Date.now());
  const completed = useRef(false);
  const isCached = data?._metadata?.generatedFrom === 'Cache';

  // Advance stages on a timer
  useEffect(() => {
    if (isCached) return;
    const interval = setInterval(() => {
      setStageIdx(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
      const elapsed = Date.now() - startTime.current;
      setProgress(Math.min(100, Math.round((elapsed / MIN_DURATION) * 100)));
    }, STAGE_DURATION);
    return () => clearInterval(interval);
  }, [isCached]);

  // Smooth progress bar
  useEffect(() => {
    if (isCached) {
      setProgress(100);
      return;
    }
    const pct = ((stageIdx + 1) / STAGES.length) * 100;
    setProgress(Math.round(pct));
  }, [stageIdx, isCached]);

  // Fire onComplete once conditions are met
  useEffect(() => {
    if (completed.current) return;
    if (!data) return; // wait for backend response

    const elapsed = Date.now() - startTime.current;

    if (isCached) {
      // Cached: short deliberate delay so user reads the message
      completed.current = true;
      setTimeout(onComplete, 1200);
      return;
    }

    const doComplete = () => {
      if (completed.current) return;
      completed.current = true;
      // Jump to last stage visually, then close
      setStageIdx(STAGES.length - 1);
      setProgress(100);
      setTimeout(onComplete, 800);
    };

    const remaining = MIN_DURATION - elapsed;
    if (remaining <= 0) {
      doComplete();
    } else {
      setTimeout(doComplete, remaining);
    }
  }, [data, isCached, onComplete]);

  const stage = STAGES[stageIdx];
  const Icon = stage.icon;

  // Detect platform label
  const platformLabel = platform === 'x' ? 'X (Twitter)' : 
    platform === 'combined' ? 'Combined' :
    platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className="w-full max-w-lg mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        {/* Animated top progress bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400"
            style={{ boxShadow: '0 0 12px rgba(168,85,247,0.6)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>

        <div className="p-10 flex flex-col items-center text-center gap-8">
          {/* Animated icon orb */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-black/50 border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isCached ? 'cached' : stageIdx}
                  initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.4, rotate: 30 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {isCached ? (
                    <Sparkles size={44} className="text-purple-400" />
                  ) : (
                    <Icon size={44} className="text-purple-400" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Outer ring pulse */}
            <div className="absolute inset-[-8px] rounded-full border border-purple-500/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-[-16px] rounded-full border border-blue-500/10 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.8s' }} />
            {/* Glow */}
            <div className="absolute inset-[-24px] rounded-full bg-purple-600/15 blur-2xl" />
          </div>

          {/* Stage text */}
          <div className="h-24 flex flex-col items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {isCached ? (
                <motion.div key="cached" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">Loading Creator Intelligence</h2>
                  <p className="text-white/50 text-sm">Cached profile found · Loading instantly</p>
                </motion.div>
              ) : (
                <motion.div
                  key={stageIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-black text-white tracking-tight">{stage.title}</h2>
                  <p className="text-white/50 text-sm max-w-xs mx-auto">{stage.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stage dots */}
          {!isCached && (
            <div className="flex gap-2">
              {STAGES.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  animate={{
                    width: i === stageIdx ? 20 : 6,
                    height: 6,
                    backgroundColor: i <= stageIdx ? 'rgba(168,85,247,1)' : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>
          )}

          {/* Platform badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Platform Detected:&nbsp;<span className="text-purple-300 font-semibold">{platformLabel}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

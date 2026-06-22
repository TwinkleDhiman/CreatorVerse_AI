import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { glass, COLORS } from '../shared';

const Reflection = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />
);

interface Props {
  dashboard: any;
  onNavigate: (view: string) => void;
}

export default function DashboardView({ dashboard, onNavigate }: Props) {
  const scenarioColors = [
    { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'text-green-400', bar: 'from-blue-400 to-indigo-500', shadow: 'shadow-[0_0_10px_rgba(99,102,241,0.5)]', icon: '👨‍🏫' },
    { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'text-purple-300', bar: 'from-purple-400 to-pink-500', shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.5)]', icon: '🤝' },
    { bg: 'bg-pink-500/20 text-pink-400 border-pink-500/30', label: 'text-pink-400', bar: 'from-pink-400 to-rose-500', shadow: 'shadow-[0_0_10px_rgba(236,72,153,0.5)]', icon: '📧' },
  ];

  return (
    <div className="flex gap-8 flex-1">
      {/* Main Column */}
      <main className="flex-1 space-y-6 flex flex-col min-w-0">

        {/* Stats */}
        <section className={`${glass} rounded-3xl p-8`}>
          <Reflection />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {dashboard?.creator?.name?.split(' ')[0] || 'Creator'} 👋</h2>
                <p className="text-white/60">Here's your intelligence overview.</p>
              </div>
              <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors">
                This Month ▼
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Followers', value: dashboard?.creator?.followers?.toLocaleString() || '...', growth: '12.5%' },
                { label: 'Monthly Revenue', value: `₹${(dashboard?.creator?.monthlyRevenue / 1000).toFixed(0)}K` || '...', growth: '18.7%' },
                { label: 'Engagement Rate', value: `${dashboard?.creator?.engagementRate || '...'}%`, growth: '8.3%' },
                { label: 'Growth Score', value: `${dashboard?.creator?.growthScore || '...'}/100`, growth: '14.4%' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold mb-2">{stat.value}</p>
                  <p className="text-green-400 text-sm flex items-center gap-1"><TrendingUp size={12} /> {stat.growth}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multiverse */}
        <section className={`${glass} rounded-3xl p-8 flex-1 flex flex-col`}>
          <Reflection />
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">Creator Multiverse</h3>
                <p className="text-white/50 text-sm mt-1">Simulate. Compare. Decide.</p>
              </div>
              <button onClick={() => onNavigate('multiverse')} className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                View All Scenarios →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1">
              {(dashboard?.scenarios || []).map((s: any, i: number) => {
                const c = scenarioColors[i % 3];
                return (
                  <motion.div
                    key={s.title}
                    onClick={() => onNavigate('multiverse')}
                    whileHover={{ scale: 1.02, y: -4, boxShadow: '0 20px 60px rgba(168,85,247,.25)' }}
                    className={`${glass} rounded-2xl p-5 flex flex-col cursor-pointer`}
                  >
                    <Reflection />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg leading-tight">{s.title}</h4>
                        <span className="text-xl">{c.icon}</span>
                      </div>
                      <p className={`${c.label} text-xs mb-4 font-bold uppercase tracking-wider`}>{s.type}</p>
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-white/40 text-xs mb-1">Revenue</p>
                          <p className="font-bold">{s.revenue}<span className="text-white/40 text-xs">/mo</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-xs mb-1">Growth</p>
                          <p className="text-green-400 font-bold">↑ {s.growth}%</p>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span>Success Probability</span>
                          <span className="text-white font-bold">{s.probability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full">
                          <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full ${c.shadow}`} style={{ width: `${s.probability}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Advisor Bar */}
        <div className={`${glass} rounded-[2rem] p-5 px-8 flex items-center justify-between`}>
          <Reflection />
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-400 to-pink-500 rounded-l-[2rem]" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="text-purple-300" size={22} />
            </div>
            <div>
              <p className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">AI Advisor</p>
              <p className="text-white/90">Should I launch a course or focus on sponsorships?</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('advisor')}
            className="relative z-10 bg-purple-600 hover:bg-purple-500 transition-all px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            Ask AI Advisor →
          </button>
        </div>
      </main>

      {/* Right Panel */}
      <aside className="w-[320px] space-y-5 shrink-0 flex flex-col">
        {/* AI Copilot */}
        <div className={`${glass} p-7 rounded-3xl flex items-start gap-4`}>
          <Reflection />
          <Sparkles className="text-purple-300 mt-1 shrink-0 relative z-10" size={22} />
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">AI Copilot</h3>
            <p className="text-white/60 text-sm leading-relaxed">Your growth. Simulated.<br />Your future. Designed.</p>
          </div>
        </div>

        {/* AI Insight */}
        <div className={`${glass} p-7 rounded-3xl`}>
          <Reflection />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Sparkles className="text-indigo-400" size={18} />
            <h3 className="font-bold text-white">AI Insight</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed relative z-10">
            Your audience is most interested in{' '}
            <span className="text-white font-semibold">"{dashboard?.insight?.title || '...'}"</span>.{' '}
            {dashboard?.insight?.recommendation || '...'}
          </p>
          <button
            onClick={() => onNavigate('opportunities')}
            className="mt-5 w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all py-2.5 rounded-xl text-sm font-medium relative z-10"
          >
            View Opportunities →
          </button>
        </div>

        {/* Audience Council */}
        <div className={`${glass} p-7 rounded-3xl flex-1 flex flex-col`}>
          <Reflection />
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg">Audience Council</h3>
              <button onClick={() => onNavigate('audience')} className="text-purple-300 text-xs hover:text-purple-200 transition-colors">
                View all →
              </button>
            </div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Top Personas</p>
            <div className="h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboard?.audience || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                    {(dashboard?.audience || []).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">{dashboard?.audience?.[0]?.value || 0}%</span>
                <span className="text-white/50 text-xs mt-1">{dashboard?.audience?.[0]?.name || '...'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto pt-4">
              {(dashboard?.audience || []).map((item: any, i: number) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

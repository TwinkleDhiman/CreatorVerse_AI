import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { glass, COLORS } from '../shared';

const Reflection = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />
);

export default function AudienceView({ audience }: { audience: any[] }) {
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    axios.get('/api/audience/personas')
      .then(r => setPersonas(r.data))
      .catch(() => setPersonas([]));
  }, []);

  const fallbackPersonas = [
    { id: '1', name: 'Student Persona', goals: ['Get Job', 'Learn AI'], painPoints: ['Interview Anxiety', 'Lack of experience'] },
    { id: '2', name: 'Professional Persona', goals: ['Upskill', 'Increase Salary'], painPoints: ['Time constraints', 'Fast changing tech'] },
    { id: '3', name: 'Buyer Persona', goals: ['Buy tools', 'Save time'], painPoints: ['Too many options', 'Budget concerns'] },
    { id: '4', name: 'Superfan Persona', goals: ['Follow creator', 'Share content'], painPoints: ['Missing updates', 'Wants exclusive access'] },
  ];

  const fallbackGoals = [['Get Job', 'Learn AI'], ['Upskill', 'Increase Salary'], ['Buy tools', 'Save time'], ['Follow creator', 'Share content']];
  const fallbackPainPoints = [['Interview Anxiety', 'Lack of experience'], ['Time constraints', 'Fast changing tech'], ['Too many options', 'Budget concerns'], ['Missing updates', 'Wants exclusive access']];

  const allPersonas = audience && audience.length > 0
    ? audience.map((seg, i) => {
        const p = personas.find(p => p.name === seg.name) || personas[i] || {};
        const isPersonaSuffix = seg.name.toLowerCase().includes('persona');
        return {
          id: String(i),
          name: isPersonaSuffix ? seg.name : `${seg.name} Persona`,
          goals: p.goals || fallbackGoals[i % fallbackGoals.length],
          painPoints: p.painPoints || fallbackPainPoints[i % fallbackPainPoints.length],
        };
      })
    : (personas.length > 0 ? personas : fallbackPersonas);
  
  const items = selectedIndex !== null && allPersonas[selectedIndex] 
    ? [{ ...allPersonas[selectedIndex], originalIndex: selectedIndex }] 
    : allPersonas.map((p, i) => ({ ...p, originalIndex: i }));

  const personaColors = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1">Audience Council</h2>
        <p className="text-white/50">Deep intelligence on who your audience really is.</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Chart Panel */}
        <div className={`${glass} rounded-3xl p-7 w-[280px] shrink-0 flex flex-col`}>
          <Reflection />
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">Distribution</h3>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-5">Audience Breakdown</p>
            <div className="h-[200px] relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={audience} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={65} 
                    outerRadius={85} 
                    paddingAngle={4} 
                    dataKey="value" 
                    stroke="none"
                    onClick={(_, index) => setSelectedIndex(selectedIndex === index ? null : index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {audience.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={COLORS[i % COLORS.length]} 
                        opacity={selectedIndex === null || selectedIndex === i ? 1 : 0.3} 
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,10,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">{audience[0]?.value || 0}%</span>
                <span className="text-white/50 text-xs mt-1">{audience[0]?.name || ''}</span>
              </div>
            </div>
            <div className="space-y-3">
              {audience.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ 
                        backgroundColor: COLORS[i],
                        opacity: selectedIndex === null || selectedIndex === i ? 1 : 0.3
                      }} 
                    />
                    <span 
                      className="text-white/80 text-sm cursor-pointer"
                      style={{ opacity: selectedIndex === null || selectedIndex === i ? 1 : 0.4 }}
                      onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Persona Cards */}
        <div className="flex-1 grid grid-cols-2 gap-5 content-start">
          {items.map((p) => (
            <div key={p.id || p.originalIndex} className={`${glass} rounded-2xl p-6`}>
              <Reflection />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border border-white/10"
                    style={{ backgroundColor: `${personaColors[p.originalIndex % 4]}22`, color: personaColors[p.originalIndex % 4] }}>
                    {p.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-white/40 text-xs">{audience[p.originalIndex]?.value || '--'}% of audience</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Goals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(p.goals) ? p.goals : JSON.parse(p.goals || '[]')).map((g: string) => (
                      <span key={g} className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Pain Points</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(p.painPoints) ? p.painPoints : JSON.parse(p.painPoints || '[]')).map((pp: string) => (
                      <span key={pp} className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full">{pp}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

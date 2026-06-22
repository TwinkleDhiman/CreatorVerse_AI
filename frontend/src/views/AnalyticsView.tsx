import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, PlayCircle, Users } from 'lucide-react';
import { glass, COLORS } from '../shared';

interface Props {
  analytics?: any;
  aiModel?: 'gemini' | 'claude' | 'gpt4' | 'hybrid';
}

export default function AnalyticsView({ analytics }: Props) {
  const growthData = analytics?.growth || [];
  const engagementData = analytics?.engagement || [];
  const revenueData = analytics?.revenue || [];
  const retentionData = analytics?.retention || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${glass} p-3 rounded-xl border border-white/10 text-sm`}>
          <p className="text-white/60 mb-1">{label}</p>
          <p className="font-bold">{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-6 custom-scrollbar">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Deep Analytics</h2>
          <p className="text-white/50">Performance insights and audience retention metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
            Last 30 Days
          </button>
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white/50 hover:bg-white/10 transition-colors">
            This Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Growth Trends */}
        <div className={`${glass} p-6 rounded-3xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2"><Users size={18} className="text-blue-400"/> Growth Trends</h3>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1"><TrendingUp size={14}/> +83%</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} dx={-10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#070B2A', stroke: '#3b82f6', strokeWidth: 2}} activeDot={{r: 6, fill: '#3b82f6', stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Curve */}
        <div className={`${glass} p-6 rounded-3xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2"><Clock size={18} className="text-purple-400"/> Retention Curve</h3>
            <span className="text-red-400 text-sm font-medium flex items-center gap-1"><TrendingDown size={14}/> Dropoff</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} dx={-10} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="viewers" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement by Format */}
        <div className={`${glass} p-6 rounded-3xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2"><PlayCircle size={18} className="text-pink-400"/> Engagement by Format</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} layout="vertical" margin={{ left: 0, right: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis dataKey="format" type="category" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.8)', fontSize: 12}} axisLine={false} tickLine={false} width={80} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                <Bar dataKey="rate" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className={`${glass} p-6 rounded-3xl flex flex-col`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold flex items-center gap-2"><Activity size={18} className="text-green-400"/> Revenue Breakdown</h3>
          </div>
          <div className="flex-1 flex items-center relative">
            <div className="w-1/2 h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                    {revenueData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              {revenueData.map((item: any, i: number) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

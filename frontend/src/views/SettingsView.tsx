import { User, Cpu, Sliders, Save, Sparkles } from 'lucide-react';
import { glass } from '../shared';

interface Props {
  aiModel?: 'gemini' | 'claude' | 'gpt4' | 'hybrid';
  setAiModel?: (model: 'gemini' | 'claude' | 'gpt4' | 'hybrid') => void;
  creatorName?: string;
  setCreatorName?: (name: string) => void;
  niche?: string;
  setNiche?: (niche: string) => void;
}

export default function SettingsView({ 
  aiModel = 'gemini', setAiModel,
  creatorName = '', setCreatorName,
  niche = '', setNiche
}: Props) {
  // Removed unused loadDemo function

  return (
    <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-6 custom-scrollbar">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-white/50">Manage your creator profile and AI simulation preferences.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-purple-600 hover:bg-purple-500 transition-all px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] ml-2">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Profile Configuration */}
        <div className="space-y-6">
          <div className={`${glass} p-8 rounded-3xl flex flex-col gap-6`}>
            <h3 className="font-bold flex items-center gap-2 text-lg border-b border-white/10 pb-4">
              <User size={20} className="text-blue-400" /> Profile Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Creator Name</label>
                <input 
                  type="text" 
                  value={creatorName}
                  onChange={(e) => setCreatorName && setCreatorName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-2">Primary Content Niche</label>
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche && setNiche(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Target Audience Age</label>
                <div className="flex gap-4">
                  {['13-17', '18-24', '25-34', '35+'].map((age, i) => (
                    <label key={age} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="age" defaultChecked={i === 1} className="accent-purple-500" />
                      <span className="text-sm">{age}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="space-y-6">
          <div className={`${glass} p-8 rounded-3xl flex flex-col gap-6`}>
            <h3 className="font-bold flex items-center gap-2 text-lg border-b border-white/10 pb-4">
              <Cpu size={20} className="text-pink-400" /> AI Preferences
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Simulation Aggressiveness</label>
                <p className="text-xs text-white/40 mb-3">Controls how ambitious the Multiverse predictions are.</p>
                <input type="range" min="1" max="100" defaultValue="70" className="w-full accent-pink-500" />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white mb-1 flex items-center gap-2"><Sliders size={16} className="text-purple-400"/> Auto-Insights</h4>
                  <p className="text-xs text-white/50">Allow AI to generate background opportunities.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-3 flex items-center gap-2"><Sparkles size={16} className="text-purple-400" /> AI Engine Selection</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'gpt4', name: 'GPT-4o', desc: 'OpenAI (Default)', color: 'border-blue-500', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', bg: 'bg-blue-500/20' },
                    { id: 'claude', name: 'Claude 3.5 Sonnet', desc: 'Anthropic', color: 'border-orange-500', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]', bg: 'bg-orange-500/20' },
                    { id: 'gemini', name: 'Gemini', desc: 'Google DeepMind', color: 'border-emerald-500', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]', bg: 'bg-emerald-500/20' },
                    { id: 'hybrid', name: 'Hybrid Routing', desc: 'Auto-selects best model', color: 'border-pink-500', shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]', bg: 'bg-pink-500/20' },
                  ].map(model => (
                    <div 
                      key={model.id}
                      onClick={() => setAiModel && setAiModel(model.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${aiModel === model.id ? `${model.bg} ${model.color} ${model.shadow}` : 'bg-black/20 border-white/10 hover:border-white/30'}`}
                    >
                      <h4 className="font-bold text-sm text-white mb-0.5">{model.name}</h4>
                      <p className="text-xs text-white/50">{model.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

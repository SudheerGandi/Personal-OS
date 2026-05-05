import React, { useState } from 'react';
import { useOS } from '../hooks/useOS';
import { Brain, Search, Terminal, Filter, Layers, Zap, Info, ChevronDown, CheckCircle2 } from 'lucide-react';
import { businesses } from '../lib/data/businessDecoder';
import { businessArchetypes } from '../lib/data/businessArchetypes';
import { motion } from 'motion/react';

export default function BusinessDecoder() {
  const [tier, setTier] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const { state } = useOS();

  const decodedCount = Object.keys(state.businessDecodes).length;
  
  const filteredBusinesses = businesses.filter(b => {
    const matchTier = tier === 'all' || b.tier === tier;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.teaches.toLowerCase().includes(search.toLowerCase());
    return matchTier && matchSearch;
  });

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#e8622a] mb-2">
          <Brain size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Business Decoder OS</h1>
        </div>
        <p className="text-[#b0bac8] max-w-2xl text-lg">One business per week on Thursday. After 100 businesses, you see archetypes automatically.</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <StatCard label="DECODED" value={`${decodedCount}/100`} />
          <StatCard label="CURRENT TIER" value="1 - FOUNDATION" />
          <StatCard label="NEXT DECODE" value="McDonald's" />
          <StatCard label="PATTERN COUNT" value="0" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
             <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
                <input 
                  type="text" 
                  placeholder="Search businesses or skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#141519] border border-[#1c1e24] px-10 py-2.5 rounded-md focus:border-[#e8622a] outline-none"
                />
             </div>
             <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTier(t)}
                    className={`px-3 py-1.5 text-xs font-mono rounded ${tier === t ? 'bg-[#e8622a] text-[#0e0f12]' : 'bg-[#1c1e24] text-[#b0bac8] hover:bg-[#23262e]'}`}
                  >
                    T{t}
                  </button>
                ))}
                <button onClick={() => setTier('all')} className="text-xs text-[#6b7280] ml-2 underline">Reset</button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBusinesses.map(biz => (
              <motion.div 
                layout
                key={biz.id}
                className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg group hover:border-[#343840] transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-[10px] font-mono text-[#4b5563]">#{biz.id.toString().padStart(3, '0')}</div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1c1e24] text-[#b0bac8]">Tier {biz.tier}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#e8622a] transition-colors">{biz.name}</h3>
                <p className="text-sm text-[#b0bac8] leading-relaxed mb-4">{biz.teaches}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#1c1e24]">
                   <span className="text-[10px] text-[#4b5563] font-mono truncate max-w-[150px]">{biz.source}</span>
                   <button className="text-[10px] font-bold text-[#e8622a] uppercase tracking-widest hover:underline">Open Decode</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
           <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6">Archetypes</h3>
              <div className="space-y-4">
                 {businessArchetypes.map(ark => (
                   <div key={ark.name} className="border-l-2 border-[#1c1e24] pl-4 py-1">
                      <h4 className="text-sm font-bold">{ark.name}</h4>
                      <p className="text-[10px] text-[#6b7280] mb-1">{ark.howMoneyFlows}</p>
                      <div className="text-[9px] text-[#e8622a]">Margin: {ark.margin}</div>
                   </div>
                 ))}
              </div>
           </section>

           <section className="bg-[#1c1e24] p-6 rounded-lg border border-[#e8622a]/20">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                <Terminal size={18} className="text-[#e8622a]" /> Pattern Journal
              </h3>
              <div className="bg-[#0e0f12] p-4 rounded text-[11px] font-mono text-[#b0bac8] space-y-2">
                 <p className="text-[#e8622a]"># Template</p>
                 <p>Pattern: [Name]</p>
                 <p>Signal: [Current Observation]</p>
                 <p>History Match: [When happened before]</p>
                 <p>Prediction: [Outcome expected]</p>
                 <p>Action: [Specific research/move]</p>
              </div>
              <button className="w-full mt-4 bg-[#141519] text-[#dde3ee] py-2 text-xs font-bold rounded border border-[#343840] hover:bg-[#23262e]">
                New Entry
              </button>
           </section>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#141519] border border-[#1c1e24] p-4 rounded-md">
      <div className="text-[9px] font-mono text-[#6b7280] tracking-widest uppercase mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

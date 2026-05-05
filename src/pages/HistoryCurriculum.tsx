import React from 'react';
import { useOS } from '../hooks/useOS';
import { History as HistoryIcon, GraduationCap, Link as LinkIcon, BookOpen, Layers, Clock } from 'lucide-react';
import { historicalCurriculum, sectorHistory } from '../lib/data/historyCurriculum';
import { motion } from 'motion/react';

export default function HistoryCurriculum() {
  const { state } = useOS();

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#e8622a] mb-2">
          <GraduationCap size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Historical Curriculum</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">The pattern across history is your competitive advantage.</p>
        
        <div className="flex gap-4 mt-8">
           <StatCard label="STUDY SESSIONS" value="3x / Week" />
           <StatCard label="FOCUS PERIOD" value="30 Min" />
           <StatCard label="STRATEGY" value="Pattern Search" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
           <section>
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2">
                <BookOpen size={14} /> Global & India Major Events
              </h3>
              <div className="space-y-4">
                 {historicalCurriculum.map(item => (
                   <div key={item.id} className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg group ">
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] font-mono text-[#e8622a] bg-[#e8622a]/10 px-2 py-0.5 rounded">EVENT {item.id}</span>
                         <span className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest">{item.sessions} SESSIONS</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-[#e8622a] transition-colors">{item.event}</h4>
                      <p className="text-sm text-[#b0bac8] mb-6 leading-relaxed italic">"{item.why}"</p>
                      
                      <div className="pt-4 border-t border-[#1c1e24] flex items-center gap-4 text-[10px] font-mono text-[#6b7280]">
                         <div className="flex items-center gap-1.5"><LinkIcon size={12} /> {item.sources}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <aside className="space-y-12">
            <section>
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2">
                <Layers size={14} /> Sector Deep Dives (M7-M12)
              </h3>
              <div className="space-y-6">
                 {sectorHistory.map(sector => (
                   <div key={sector.sector} className="border-l-2 border-[#1c1e24] pl-4 py-1">
                      <div className="text-[10px] font-mono text-[#4b5563] mb-1">MONTH {sector.month}</div>
                      <h4 className="text-md font-bold mb-1">{sector.sector}</h4>
                      <p className="text-xs text-[#b0bac8] leading-tight mb-2">{sector.study}</p>
                      <div className="text-[9px] text-[#e8622a] opacity-60">{sector.sources}</div>
                   </div>
                 ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-[#1c1e24] to-[#0e0f12] p-8 rounded-lg border border-[#e8622a]/20">
               <h3 className="text-xl font-bold mb-4">The Rule</h3>
               <p className="text-sm text-[#b0bac8] leading-relaxed mb-6">
                 Study 3x per week (Tuesday, Thursday, Saturday — 30 min each). 
               </p>
               <div className="space-y-3">
                  <div className="text-[10px] font-mono text-[#6b7280] uppercase">Outcome</div>
                  <div className="text-sm border-l-2 border-[#e8622a] pl-4 py-2 bg-[#141519]">
                    When you see the same signal forming again, you already know the outcome.
                  </div>
               </div>
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

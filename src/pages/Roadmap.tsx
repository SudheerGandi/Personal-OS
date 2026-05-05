
import React from 'react';
import { aiRoadmap } from '../lib/data/aiRoadmap';
import { useOS } from '../hooks/useOS';
import { Map, Target, Book, Layers, ChevronRight, Zap } from 'lucide-react';

export default function Roadmap() {
  const { state } = useOS();

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#3b6cf7] mb-2">
          <Map size={24} />
          <h1 className="text-4xl font-bold tracking-tight">AI Roadmap</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">26-Week sequence to AI Engineering Mastery.</p>
        
        <div className="flex gap-4 mt-8">
           <StatCard label="PHASE" value="1 - FOUNDATIONS" />
           <StatCard label="CURRENT WEEK" value={`WEEK ${state.week}`} />
           <StatCard label="PROGRESS" value={`${Math.round((state.completedTasks.filter(id => id.startsWith('ai-roadmap-')).length / 182) * 100)}%`} />
        </div>
      </header>

      <div className="space-y-12">
        {aiRoadmap.map((week) => (
          <div 
            key={week.week}
            className={`relative pl-8 border-l-2 ${week.week <= state.week ? 'border-[#3b6cf7]' : 'border-[#1c1e24] opacity-50'}`}
          >
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${week.week <= state.week ? 'bg-[#3b6cf7] border-[#3b6cf7]' : 'bg-[#0e0f12] border-[#1c1e24]'}`} />
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <span className="text-[10px] font-mono text-[#3b6cf7] tracking-[0.2em] uppercase">{week.phase} · WEEK {week.week}</span>
                <h2 className="text-2xl font-bold mt-1 mb-4 flex items-center gap-2">
                  {week.title}
                  {week.week === state.week && <span className="bg-[#3b6cf7]/10 text-[#3b6cf7] text-[10px] px-2 py-0.5 rounded border border-[#3b6cf7]/30">ACTIVE</span>}
                </h2>
                <p className="text-sm text-[#b0bac8] leading-relaxed mb-6">{week.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-mono text-[#6b7280] uppercase mb-3 flex items-center gap-1.5"><Target size={12} /> Objectives</h4>
                    <ul className="space-y-2">
                      {week.objectives.map((obj, i) => (
                        <li key={i} className="text-xs text-[#dde3ee] flex items-start gap-2">
                          <span className="text-[#3b6cf7] mt-0.5">→</span> {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-[#6b7280] uppercase mb-3 flex items-center gap-1.5"><Layers size={12} /> Project</h4>
                    <div className="bg-[#141519] border border-[#1c1e24] p-4 rounded">
                       <h5 className="text-sm font-bold mb-1">{week.project.title}</h5>
                       <p className="text-[11px] text-[#b0bac8] mb-3">{week.project.description}</p>
                       <div className="flex flex-wrap gap-2">
                          {week.project.tags.map(tag => <span key={tag} className="text-[9px] bg-[#1c1e24] px-1.5 py-0.5 rounded text-[#6b7280]">{tag}</span>)}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-64 space-y-6">
                 <div>
                    <h4 className="text-[10px] font-mono text-[#6b7280] uppercase mb-3 flex items-center gap-1.5"><Book size={12} /> Resources</h4>
                    <div className="space-y-2">
                      {week.resources.map((res, i) => (
                        <a 
                          key={i} 
                          href={res.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block bg-[#141519] border border-[#1c1e24] hover:border-[#3b6cf7] p-2.5 rounded transition-all text-[11px] group"
                        >
                          <div className="font-bold mb-0.5 group-hover:text-[#3b6cf7] transition-colors">{res.name}</div>
                          <div className="text-[9px] text-[#4b5563]">{res.hrs}</div>
                        </a>
                      ))}
                    </div>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-mono text-[#6b7280] uppercase mb-3 flex items-center gap-1.5"><Zap size={12} /> Mastery Gates</h4>
                    <div className="space-y-2">
                      {week.checks.map((check, i) => (
                        <div key={i} className="text-[10px] text-[#b0bac8] flex items-start gap-1.5">
                          <input type="checkbox" disabled checked={week.week < state.week} className="mt-0.5 accent-[#3b6cf7]" />
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
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

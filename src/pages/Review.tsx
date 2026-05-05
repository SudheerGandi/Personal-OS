import React from 'react';
import { useOS } from '../hooks/useOS';
import { Target, CheckSquare, ListTodo, History, ArrowRight } from 'lucide-react';

export default function Review() {
  const { state } = useOS();

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#e8622a] mb-2">
          <Target size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Weekly Review</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">Sunday Synthesis: 8:00–9:30 PM</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
           <div className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2"><CheckSquare size={14} /> Review Protocol</h3>
              <ul className="space-y-4">
                 {[
                   { step: "1", task: "Read all this week's Intelligence Feed entries. Look for signals in 2+ buckets.", time: "15 min" },
                   { step: "2", task: "Fill synthesis: Startups signal · Global Deals signal · AI signal · Markets signal · Trade signal · The convergence · Historical match · 5 specific opportunities", time: "20 min" },
                   { step: "3", task: "Write 1 pattern journal entry with current signal + historical match + prediction + action.", time: "15 min" },
                   { step: "4", task: "Duplicate Week Template. Rename. Fill 4 blanks (AI topic, biz rotation, build target, interview target). Replace all dates.", time: "10 min" },
                   { step: "5", task: "Update My Status page: AI week number, skills phase, current book, businesses decoded, CivilMind status.", time: "5 min" },
                   { step: "6", task: "Read Rules page — night section. Sleep by 10:30 PM.", time: "5 min" }
                 ].map((p, i) => (
                   <li key={i} className="flex gap-4 items-start group">
                      <div className="flex-shrink-0">
                        <span className="text-[10px] font-mono text-[#4b5563] group-hover:text-[#e8622a] border border-[#1c1e24] px-1.5 py-0.5 rounded">STEP {p.step}</span>
                        <div className="text-[8px] font-mono text-center text-[#4b5563] mt-1">{p.time}</div>
                      </div>
                      <p className="text-sm leading-relaxed text-[#b0bac8]">{p.task}</p>
                   </li>
                 ))}
              </ul>
           </div>
        </section>

        <section className="space-y-8">
           <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4 flex items-center gap-2"><History size={14} /> Weekly Velocity</h3>
           {/* Weekly stats here */}
           <div className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <p className="text-sm text-[#4b5563] italic">"Data for Week 1 will appear here on May 10, 2026."</p>
           </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { useOS } from '../hooks/useOS';
import { Mic, Play, Radio, Bookmark, Headphones, ExternalLink, ChevronRight } from 'lucide-react';
import { podcasts, youtubeChannels } from '../lib/data/podcasts';

export default function PodcastOS() {
  const { state } = useOS();

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#7c3aed] mb-2">
          <Mic size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Podcast OS</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">Passive Learning Multiplier during non-cognitive time.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <section>
            <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2">
              <Headphones size={14} /> Business & Thought Library
            </h3>
            <div className="space-y-4">
               {podcasts.map(pod => (
                 <div key={pod.title} className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg group hover:border-[#7c3aed]/50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[9px] font-mono text-[#7c3aed]/80 py-0.5 px-2 bg-[#7c3aed]/10 rounded uppercase">{pod.when}</span>
                       <button className="text-[#4b5563] hover:text-[#7c3aed]"><Bookmark size={14} /></button>
                    </div>
                    <h4 className="text-lg font-bold mb-1 group-hover:text-[#7c3aed] transition-colors">{pod.title}</h4>
                    <p className="text-[11px] text-[#b0bac8] leading-relaxed mb-4">{pod.teaches}</p>
                    <div className="pt-4 border-t border-[#1c1e24] flex items-center justify-between">
                       <div className="text-[10px] text-[#4b5563]">Start with: <span className="text-[#6b7280] italic">{pod.startWith}</span></div>
                       <button className="px-3 py-1 bg-[#1c1e24] text-[10px] font-bold rounded flex items-center gap-1.5 hover:bg-[#23262e]">
                         <Play size={10} fill="currentColor" /> LISTEN
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         <section>
            <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2">
              <Radio size={14} /> Deep Work Video Resources
            </h3>
            <div className="space-y-4">
               {youtubeChannels.map(ch => (
                  <div key={ch.name} className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-md font-bold">{ch.name}</h4>
                       <span className="text-[9px] font-mono text-[#b0bac8]">{ch.when}</span>
                    </div>
                    <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">{ch.purpose}</p>
                    <button className="text-[10px] font-bold text-[#b0bac8] hover:text-[#7c3aed] flex items-center gap-2 uppercase tracking-widest">
                       Open in new tab <ExternalLink size={12} />
                    </button>
                  </div>
               ))}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-[#1c1e24] to-[#0e0f12] rounded-lg border border-[#7c3aed]/20">
               <h3 className="text-xl font-bold mb-2">Protocol: 1.5x Always</h3>
               <p className="text-sm text-[#b0bac8] italic mb-6">"Never as a separate sitting block. Only during exercise, walking, or commuting."</p>
               <div className="space-y-3">
                  <div className="text-[10px] font-mono text-[#6b7280] uppercase">Output required</div>
                  <div className="text-sm border-l-2 border-[#7c3aed] pl-4 py-2 bg-[#141519]">
                    After each session: write one sentence — the single most useful idea.
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Shield, Mail, Globe, CheckCircle2, Info } from 'lucide-react';
import { emailStrategy, allowedWebsites } from '../lib/data/strategy';

export default function Strategy() {
  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#b0bac8] mb-2">
          <Shield size={24} />
          <h1 className="text-4xl font-bold tracking-tight">System Strategy</h1>
        </div>
        <p className="text-[#4b5563] text-lg">Allowed sources and multi-account extraction protocols.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <section>
            <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2">
              <Mail size={14} /> 3-Email Strategy
            </h3>
            <div className="space-y-4">
               {emailStrategy.map(strat => (
                 <div key={strat.site} className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-md font-bold">{strat.site}</h4>
                       <span className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest">{strat.limit}</span>
                    </div>
                    <p className="text-xs text-[#b0bac8] leading-relaxed mb-4">{strat.how}</p>
                    <div className="text-[9px] font-mono text-[#059669]">Result: {strat.count}</div>
                 </div>
               ))}
            </div>
         </section>

         <section>
            <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-6 flex items-center gap-2">
              <Globe size={14} /> Browser Whitelist
            </h3>
            <div className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
               <p className="text-[10px] text-[#4b5563] mb-6 font-mono leading-relaxed">
                 Add these to your browser's whitelist. Block all others during execution blocks.
               </p>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
                  {allowedWebsites.map(site => (
                    <div key={site} className="text-[10px] text-[#b0bac8] flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-[#4b5563]" />
                       <span className="hover:text-[#dde3ee] transition-colors">{site}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-[#1c1e24] to-[#0e0f12] rounded-lg border border-[#3b6cf7]/20">
               <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle2 size={20} className="text-[#3b6cf7]" /> Goal Score</h3>
               <p className="text-sm text-[#b0bac8] italic mb-6">"Your first instinct is curiosity about what's missing, not acceptance of what's said."</p>
               <div className="space-y-3">
                  <div className="text-[10px] font-mono text-[#4b5563] uppercase">Philosophy</div>
                  <div className="text-sm border-l-2 border-[#3b6cf7] pl-4 py-2 bg-[#141519]">
                    If it's not on this list, it's noise. If you find a new signal source, vet it for 7 days before adding here.
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}

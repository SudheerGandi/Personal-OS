import React, { useState } from 'react';
import { useOS } from '../hooks/useOS';
import { Info, Timer, Globe, Zap, ArrowRight, Save, LayoutGrid, ListFilter, BookOpen, Search } from 'lucide-react';
import { steps, xLists, subreddits, consultingReports, tradeSearchTerms } from '../lib/data/intelligence';
import { motion, AnimatePresence } from 'motion/react';

export default function InformationOS() {
  const { state, logSignal } = useOS();
  const [activeStep, setActiveStep] = useState(1);
  const [signal, setSignal] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const curStepData = steps.find(s => s.step === activeStep);

  const handleLog = () => {
    if (!signal) return;
    logSignal({
      bucket: curStepData?.bucket,
      content: signal,
      timestamp: Date.now()
    });
    setSignal('');
    if (activeStep < 5) setActiveStep(activeStep + 1);
    else setIsLogging(true);
  };

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#3b6cf7] mb-2">
          <Globe size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Intelligence OS</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">You are a pattern recognition machine. Collect signals, not news.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Step Navigation */}
        <div className="space-y-2">
           {steps.slice(0, 5).map(s => (
             <button 
               key={s.step}
               onClick={() => setActiveStep(s.step)}
               className={`w-full text-left p-4 rounded-md transition-all border ${
                 activeStep === s.step 
                   ? 'bg-[#1c1e24] border-[#3b6cf7] text-[#dde3ee]' 
                   : 'bg-[#141519] border-[#1c1e24] text-[#6b7280]'
               }`}
             >
               <div className="text-[9px] font-mono mb-1 uppercase tracking-widest">Step {s.step}</div>
               <div className="text-sm font-bold">{s.bucket}</div>
             </button>
           ))}
        </div>

        {/* Step Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div 
               key={activeStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-[#141519] border border-[#1c1e24] p-8 rounded-lg h-full"
            >
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-mono text-[#3b6cf7] tracking-[0.3em] uppercase">Active Bucket</span>
                    <h2 className="text-3xl font-black mt-2">{curStepData?.bucket}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[#4b5563] font-mono text-[10px]">
                    <Timer size={14} /> {curStepData?.time}
                  </div>
               </div>

               <div className="space-y-6 mb-12">
                  <div className="border-l border-[#1c1e24] pl-4">
                     <h4 className="text-[10px] font-mono text-[#4b5563] uppercase mb-2">Sources</h4>
                     <p className="text-sm font-bold text-[#3b6cf7] underline cursor-pointer">{curStepData?.source}</p>
                  </div>
                  <div className="border-l border-[#1c1e24] pl-4">
                     <h4 className="text-[10px] font-mono text-[#4b5563] uppercase mb-2">What to Look For</h4>
                     <p className="text-sm text-[#b0bac8] italic italic leading-relaxed">"{curStepData?.lookFor}"</p>
                  </div>
               </div>

               <div className="relative">
                  <textarea 
                    value={signal}
                    onChange={(e) => setSignal(e.target.value)}
                    placeholder="Log a signal: Signal + Bucket + Insight (means X because Y) + Action"
                    className="w-full bg-[#0e0f12] border border-[#1c1e24] p-4 rounded-md text-sm outline-none focus:border-[#3b6cf7] h-32 resize-none"
                  />
                  <button 
                    onClick={handleLog}
                    className="absolute bottom-4 right-4 bg-[#3b6cf7] text-[#0e0f12] p-2 rounded-full hover:bg-blue-400 transition-all"
                  >
                    <ArrowRight size={20} />
                  </button>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar: Lists */}
        <div className="space-y-8">
           <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4 flex items-center gap-2"><BookOpen size={14} /> Consulting Reports</h3>
              <p className="text-[10px] text-[#4b5563] mb-4">Monthly, 20 min each. Strategy over news.</p>
              <div className="space-y-3">
                 {consultingReports.map(report => (
                   <div key={report.source} className="group cursor-pointer">
                      <div className="text-[11px] font-bold group-hover:text-[#3b6cf7] transition-colors flex items-center justify-between">
                        {report.source}
                        <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                      <div className="text-[9px] text-[#4b5563] mt-1">Search: {report.search[0]}</div>
                   </div>
                 ))}
              </div>
           </section>

           <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4 flex items-center gap-2"><Search size={14} /> Trade Power Queries</h3>
              <div className="flex flex-wrap gap-2">
                 {tradeSearchTerms.map(term => (
                   <span key={term} className="text-[9px] bg-[#1c1e24] px-1.5 py-0.5 rounded text-[#b0bac8] border border-transparent hover:border-[#3b6cf7]/30 transition-all cursor-default">
                     {term}
                   </span>
                 ))}
              </div>
           </section>

           <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4 flex items-center gap-2"><ListFilter size={14} /> X Intelligence</h3>
              <div className="space-y-4">
                 {Object.entries(xLists).map(([key, list]) => (
                    <div key={key}>
                       <div className="text-[10px] text-[#4b5563] font-mono uppercase tracking-tighter mb-2 flex justify-between">
                         <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                         <span>{list.length}</span>
                       </div>
                       <div className="flex flex-wrap gap-1.5">
                          {list.map(handle => (
                            <a 
                              key={handle} 
                              href={`https://x.com/${handle.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] bg-[#1c1e24] px-1.5 py-0.5 rounded text-[#3b6cf7] hover:bg-[#3b6cf7]/10 transition-all"
                            >
                              {handle}
                            </a>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4 flex items-center gap-2"><LayoutGrid size={14} /> Global Subreddits</h3>
              <div className="space-y-3">
                 {subreddits.map(sub => (
                    <div key={sub.name} className="group cursor-pointer">
                       <div className="text-[11px] font-bold group-hover:text-[#3b6cf7] transition-colors">{sub.name}</div>
                       <div className="text-[9px] text-[#4b5563]">{sub.find}</div>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}

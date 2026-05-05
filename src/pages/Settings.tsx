import React from 'react';
import { useOS } from '../hooks/useOS';
import { Settings as SettingsIcon, Trash2, Download, RotateCcw, Shield, Github } from 'lucide-react';

export default function Settings() {
  const { state, resetProgress } = useOS();

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `personal-os-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="p-8 pb-24 max-w-4xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#b0bac8] mb-2">
          <SettingsIcon size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-[#4b5563]">System configuration and data management.</p>
      </header>

      <div className="space-y-8">
        <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
           <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><Shield size={18} /> Persistence & Data</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="font-bold">Automated LocalStorage</h4>
                    <p className="text-xs text-[#6b7280]">All progress is saved reactively to your browser's LocalStorage.</p>
                 </div>
                 <div className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">HEALTHY</div>
              </div>

              <div className="flex gap-3">
                 <button 
                  onClick={exportData}
                  className="bg-[#1c1e24] hover:bg-[#23262e] border border-[#343840] text-sm font-bold px-6 py-2 rounded flex items-center gap-2 transition-all"
                 >
                   <Download size={16} /> EXPORT BACKUP
                 </button>
                 <button 
                  onClick={resetProgress}
                  className="bg-[#dc2626]/10 hover:bg-[#dc2626]/20 border border-[#dc2626]/30 text-[#dc2626] text-sm font-bold px-6 py-2 rounded flex items-center gap-2 transition-all"
                 >
                   <Trash2 size={16} /> RESET CORE
                 </button>
              </div>
           </div>
        </section>

        <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
           <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><RotateCcw size={18} /> Starting State</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0e0f12] p-4 rounded border border-[#1c1e24]">
                 <div className="text-[10px] font-mono text-[#4b5563] uppercase mb-1">Start Date</div>
                 <div className="text-sm font-bold">{state.settings.startDate}</div>
              </div>
              <div className="bg-[#0e0f12] p-4 rounded border border-[#1c1e24]">
                 <div className="text-[10px] font-mono text-[#4b5563] uppercase mb-1">Target End</div>
                 <div className="text-sm font-bold">2026-11-04</div>
              </div>
           </div>
        </section>

        <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
           <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><Github size={18} /> Integration & GitHub</h3>
           <p className="text-xs text-[#6b7280] mb-4">Link your repositories to track commit-based velocity.</p>
           <button className="w-full bg-[#1c1e24] border border-[#343840] py-3 rounded text-sm font-bold text-[#b0bac8] hover:text-[#dde3ee]">
             CONNECT GITHUB ACCOUNTS
           </button>
        </section>
      </div>
    </div>
  );
}

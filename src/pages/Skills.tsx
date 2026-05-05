import React, { useState } from 'react';
import { useOS } from '../hooks/useOS';
import { Target, Zap, ChevronRight, Lock, Unlock, Database, Globe, Book } from 'lucide-react';
import { skills } from '../lib/data/skills';
import { motion } from 'motion/react';

export default function SkillsOS() {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const { state } = useOS();

  const phases = [
    { id: 1, name: 'Self-Mastery', color: '#3b6cf7', desc: 'Your operating system.' },
    { id: 2, name: 'The Lens', color: '#d97706', desc: 'See what others miss.' },
    { id: 3, name: 'Business Core', color: '#059669', desc: 'How money flows.' },
    { id: 4, name: 'Execution', color: '#7c3aed', desc: 'Convert knowledge to pay.' },
    { id: 5, name: 'Influence', color: '#e8622a', desc: 'Multiply your reach.' },
    { id: 6, name: 'Technical', color: '#dc2626', desc: 'AI, no-code, legal.' },
  ];

  const filteredSkills = skills.filter(s => selectedPhase === 'all' || s.phase === selectedPhase);

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#e8622a] mb-2">
          <Target size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Skills OS</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">38 Essential Primitives for Global Competency.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-8">
           {phases.map(p => (
             <button 
               key={p.id}
               onClick={() => setSelectedPhase(p.id)}
               className={`p-3 rounded-md text-left transition-all border ${
                 selectedPhase === p.id 
                   ? 'bg-[#1c1e24] border-[#e8622a]' 
                   : 'bg-[#141519] border-[#1c1e24] hover:bg-[#1c1e24]'
               }`}
             >
               <div className="text-[8px] font-mono text-[#6b7280] mb-1">PHASE {p.id}</div>
               <div className="text-[10px] font-bold truncate">{p.name}</div>
             </button>
           ))}
           <button onClick={() => setSelectedPhase('all')} className="text-[10px] text-[#4b5563] ml-2 underline">Reset</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSkills.map(skill => (
          <motion.div 
            layout
            key={skill.id}
            className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded outline outline-1 outline-[${phases.find(p => p.id === skill.phase)?.color}/30] text-[${phases.find(p => p.id === skill.phase)?.color}]`}>
                PHASE {skill.phase}
              </span>
              <div className="text-[10px] font-mono text-[#4b5563]">REPS: {state.skillReps[skill.id] || 0}</div>
            </div>
            
            <h3 className="text-lg font-bold mb-3">{skill.name}</h3>
            
            <div className="space-y-3 flex-1 mb-6">
              <div className="text-[11px] leading-relaxed italic text-[#b0bac8]">
                "{skill.drill}"
              </div>
              {skill.book && (
                <div className="flex items-start gap-1.5 text-[10px] text-[#6b7280]">
                   <Book size={10} className="mt-0.5 flex-shrink-0" />
                   <span>{skill.book}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1c1e24]">
               <h4 className="text-[9px] font-mono text-[#4b5563] uppercase tracking-widest mb-2">Milestone</h4>
               <div className="text-[10px] text-[#dde3ee] font-medium">{skill.milestone}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


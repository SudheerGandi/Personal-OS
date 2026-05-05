import React, { useState, useEffect } from 'react';
import { useOS } from '../hooks/useOS';
import { Timer, Zap, ArrowLeft, CheckCircle2, XCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function FocusRoom() {
  const { commands, completeTask, missTask } = useOS();
  const currentTask = commands[0];
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTask) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0e0f12]">
         <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No active commands.</h1>
            <a href="/" className="text-[#e8622a] border border-[#e8622a] px-6 py-2 rounded">Back to Console</a>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0e0f12] flex flex-col items-center justify-center p-8 text-center overscroll-none overflow-hidden">
      <div className="absolute top-8 left-8">
         <a href="/" className="flex items-center gap-2 text-[#4b5563] hover:text-[#dde3ee] transition-colors">
           <ArrowLeft size={20} /> EXIT ROOM
         </a>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="inline-block px-3 py-1 bg-[#e8622a]/10 border border-[#e8622a]/30 rounded text-[#e8622a] text-[10px] font-mono tracking-widest uppercase mb-6">
          Focus Session Active
        </div>
        
        <h1 className="text-5xl font-black mb-4 tracking-tighter">{currentTask.title}</h1>
        <p className="text-[#6b7280] font-mono text-xs uppercase tracking-[0.2em] mb-12">{currentTask.source} • EST: {currentTask.duration}</p>

        <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
           <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle 
              cx="128" cy="128" r="120" 
              fill="none" stroke="#1c1e24" strokeWidth="8"
             />
             <motion.circle 
              cx="128" cy="128" r="120" 
              fill="none" stroke="#e8622a" strokeWidth="8"
              strokeDasharray="753.6"
              animate={{ strokeDashoffset: 753.6 * (1 - (seconds % 3600) / 3600) }}
             />
           </svg>
           <div className="text-6xl font-mono font-bold tracking-tighter tabular-nums">
             {formatTime(seconds)}
           </div>
        </div>

        <div className="flex justify-center gap-6 mb-12">
           <button 
             onClick={() => setIsActive(!isActive)}
             className="w-16 h-16 rounded-full bg-[#1c1e24] flex items-center justify-center hover:bg-[#23262e] transition-all"
           >
             {isActive ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
           </button>
           <button 
             onClick={() => setSeconds(0)}
             className="w-16 h-16 rounded-full bg-[#1c1e24] flex items-center justify-center hover:bg-[#23262e] transition-all"
           >
             <RotateCcw size={28} />
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={() => completeTask(currentTask.id, currentTask.source, currentTask.title)}
             className="bg-[#e8622a] text-[#0e0f12] font-black py-4 rounded-lg flex items-center justify-center gap-3"
           >
             COMPLETE <CheckCircle2 size={24} />
           </button>
           <button 
             onClick={() => missTask(currentTask.id, currentTask.source, currentTask.title)}
             className="border border-[#dc2626] text-[#dc2626] font-black py-4 rounded-lg flex items-center justify-center gap-3"
           >
             MISS <XCircle size={24} />
           </button>
        </div>

        <div className="mt-12 p-6 bg-[#141519] border border-[#1c1e24] rounded-lg text-left">
           <h4 className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest mb-3">Context & Instructions</h4>
           <p className="text-sm text-[#b0bac8] leading-relaxed italic">"{currentTask.instructions}"</p>
           <div className="mt-4 text-[10px] text-[#3b6cf7] font-mono underline">{currentTask.resource}</div>
        </div>
      </motion.div>
    </div>
  );
}

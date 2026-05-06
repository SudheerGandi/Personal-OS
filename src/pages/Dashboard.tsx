import React, { useState } from 'react';
import { useOS } from '../hooks/useOS';
import { Terminal, Clock, Zap, Target, ArrowRight, CheckCircle2, XCircle, Info, ChevronRight, Brain, Timer, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Command } from '../types';

export default function Dashboard() {
  const { state, commands, completeTask, missTask, undoTask } = useOS();
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);

  const todayCompleted = state.history.filter(e => {
    if (e.type !== 'task_completed') return false;
    const d = new Date(e.timestamp);
    const eventDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    // Use substring(0, 10) to handle any potential appended time info if state.date changed format
    return eventDate === state.date.substring(0, 10);
  });

  const nextTask = commands[0];
  
  const windows = ['Morning', 'Afternoon', 'Evening', 'Review'];

  return (
    <div className="p-8 pb-24">
      {/* Top Dashboard Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="DATE" value={state.date} icon={Clock} />
        <StatCard label="WEEK/DAY" value={`W${state.week} D${state.day}`} icon={Target} />
        <StatCard 
          label="EXEC SCORE" 
          value={`${Math.round((todayCompleted.length / (todayCompleted.length + commands.length || 1)) * 100)}%`} 
          progress={(todayCompleted.length / (todayCompleted.length + commands.length || 7)) * 100}
          color="text-[#e8622a]" 
          icon={Zap} 
        />
        <StatCard label="STREAK" value={`${state.streak}D`} icon={Zap} />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="TODAY COMPLETED" value={todayCompleted.length.toString()} icon={CheckCircle2} />
        <StatCard label="CARRYOVER" value={state.carryovers.length.toString()} icon={ArrowRight} />
        <StatCard label="TRACKED SKILLS" value="P1" icon={Brain} />
        <StatCard label="FOCUS TIME" value="0m" icon={Timer} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Command Queue */}
        <div className="lg:col-span-2 space-y-8">
          {/* NOW Panel */}
          {nextTask ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1c1e24] to-[#141519] border border-[#e8622a]/30 p-6 rounded-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Terminal size={120} />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#e8622a] mb-2 uppercase tracking-widest">
                <Zap size={12} /> Live Command: NOW
              </div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">{nextTask.title}</h2>
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#b0bac8]">
                <div className="flex items-center gap-1.5"><Info size={14} /> Source: {nextTask.source}</div>
                <div className="flex items-center gap-1.5"><Clock size={14} /> Est: {nextTask.duration}</div>
                <div className="flex items-center gap-1.5"><Target size={14} /> Why: {nextTask.why}</div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => window.location.href = '/focus'}
                  className="bg-[#e8622a] hover:bg-[#f08050] text-[#0e0f12] font-bold px-6 py-2 rounded flex items-center gap-2 transition-all"
                >
                  START FOCUS <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => completeTask(nextTask.id, nextTask.source, nextTask.title)}
                  className="bg-[#1c1e24] hover:bg-[#23262e] border border-[#343840] text-[#dde3ee] font-bold px-6 py-2 rounded transition-all"
                >
                  COMPLETE
                </button>
                <button 
                  onClick={() => setSelectedCommand(nextTask)}
                  className="text-[#6b7280] hover:text-[#dde3ee] px-4 py-2 text-sm transition-all"
                >
                  DETAILS
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#141519] border border-[#1c1e24] p-12 text-center rounded-lg">
              <CheckCircle2 className="mx-auto mb-4 text-[#e8622a]" size={48} />
              <h3 className="text-xl font-bold">ALL COMMANDS EXECUTED</h3>
              <p className="text-[#6b7280]">Daily objective met. Review ledger or focus on side projects.</p>
            </div>
          )}

          {/* Command Queue */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase">Today Command Queue</h3>
              {todayCompleted.length > 0 && (
                <span className="text-[10px] font-mono text-[#059669]">{todayCompleted.length} COMPLETED</span>
              )}
            </div>
            <div className="space-y-6">
              {windows.map(window => {
                const windowTasks = commands.filter(c => c.timeWindow === window);
                if (windowTasks.length === 0) {
                  // Check if all tasks for this window are completed
                  const completedInWindow = state.history
                    .filter(e => e.type === 'task_completed' && e.source === window) // This might not work if source isn't window
                  // Actually, let's just show the non-completed ones
                }
                if (windowTasks.length === 0) return null;
                return (
                  <div key={window} className="space-y-3">
                    <h4 className="text-[10px] font-bold text-[#4b5563] ml-2 tracking-[0.2em] uppercase">{window}</h4>
                    {windowTasks.map((cmd, idx) => (
                      <div 
                        key={cmd.id}
                        onClick={() => setSelectedCommand(cmd)}
                        className="bg-[#141519] border border-[#1c1e24] hover:border-[#343840] p-4 rounded-md flex items-center gap-4 group cursor-pointer transition-all"
                      >
                        <div className="text-[10px] font-mono text-[#4b5563] w-4">{idx + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1c1e24] text-[#b0bac8]">{cmd.source}</span>
                            <h5 className="font-semibold text-sm group-hover:text-[#e8622a] transition-colors">{cmd.title}</h5>
                          </div>
                          <div className="flex gap-3 text-[10px] text-[#6b7280]">
                            <span>{cmd.duration}</span>
                            <span>•</span>
                            <span>{cmd.impact}</span>
                          </div>
                        </div>
                        <ChevronRight className="text-[#1c1e24] group-hover:text-[#4b5563]" size={16} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activity Log (Consolidated) */}
          {state.history.length > 0 && (
            <section className="mt-12 bg-[#0e0f12]/40 rounded-xl p-6 border border-[#1c1e24]">
               <div className="flex items-center justify-between mb-6 px-1">
                 <div>
                   <h3 className="text-sm font-bold text-[#dde3ee] tracking-tight">System Ledger</h3>
                   <p className="text-[10px] text-[#4b5563] font-mono mt-0.5">LATEST EXECUTION ENTRIES</p>
                 </div>
                 <div className="flex bg-[#1c1e24] rounded-md p-1 shadow-inner">
                    <div className="px-2 py-1 text-[9px] font-mono text-[#4b5563]">SYNCED</div>
                 </div>
               </div>
               
               <div className="space-y-3">
                 {state.history
                   .filter(e => e.type === 'task_completed' || e.type === 'task_missed')
                   .slice(0, 10)
                   .map(event => (
                    <div key={event.id} className="bg-[#141519]/80 border border-[#1c1e24] p-4 rounded-lg flex items-center justify-between group transition-all hover:border-[#e8622a]/40 hover:shadow-[0_0_15px_rgba(232,98,42,0.05)]">
                      <div className="flex items-center gap-4">
                         <div className={`p-2.5 rounded-lg border ${event.type === 'task_completed' ? 'bg-[#059669]/5 border-[#059669]/20 text-[#059669]' : 'bg-[#dc2626]/5 border-[#dc2626]/20 text-[#dc2626]'}`}>
                           {event.type === 'task_completed' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                         </div>
                         <div>
                            <div className={`text-sm font-bold text-[#dde3ee] ${event.type === 'task_completed' ? 'line-through decoration-[#4b5563]/50 opacity-70' : ''}`}>
                              {event.title}
                            </div>
                            <div className="text-[10px] text-[#4b5563] font-mono uppercase mt-1 flex items-center gap-2">
                              <span className="text-[#6b7280]">{event.source}</span>
                              <span className="w-1 h-1 rounded-full bg-[#1c1e24]" />
                              <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                              {event.type === 'task_completed' ? (
                                <span className="bg-[#059669]/10 text-[#059669] px-1.5 py-0.5 rounded-[3px] text-[8px] font-bold border border-[#059669]/20">SUCCESS</span>
                              ) : (
                                <span className="bg-[#dc2626]/10 text-[#dc2626] px-1.5 py-0.5 rounded-[3px] text-[8px] font-bold border border-[#dc2626]/20">MISSED</span>
                              )}
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            undoTask(event.taskId || '', event.id);
                          }}
                          className="text-[11px] font-bold text-[#e8622a] bg-[#e8622a]/10 hover:bg-[#e8622a] hover:text-[#0e0f12] border border-[#e8622a]/40 px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 uppercase tracking-wide group shadow-lg active:scale-95"
                        >
                          <Undo2 size={16} className="group-hover:-rotate-45 transition-transform" /> 
                          {event.type === 'task_completed' ? 'Undo Complete' : 'Restore Task'}
                        </button>
                      </div>
                    </div>
                   ))}
               </div>
            </section>
          )}
        </div>

        {/* Right Column: Progress & Rules */}
        <div className="space-y-8">
           <section className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg">
             <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4">Rule Tracker</h3>
             <div className="space-y-4">
                <RuleItem label="Problems Found" ruleId={1} />
                <RuleItem label="Outreaches Sent" ruleId={4} />
                <RuleItem label="Code Typed" ruleId={3} isBool />
                <RuleItem label="Phone Away" ruleId={2} isBool />
                <RuleItem label="Sleep @ 10:30" ruleId={7} isBool />
             </div>
           </section>

           <section className="bg-[#141519] border border-[#1c1e24] p-5 rounded-lg">
             <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4">Master Progress</h3>
             <div className="space-y-5">
                <ProgressBar 
                  label="AI ROADMAP" 
                  progress={(state.completedTasks.filter(id => id.startsWith('ai-roadmap-')).length / 182) * 100} 
                  color="bg-[#3b6cf7]" 
                />
                <ProgressBar label="SKILLS OS" progress={Object.keys(state.skillReps).length / 38 * 100} color="bg-[#d97706]" />
                <ProgressBar label="READING" progress={Object.keys(state.readingProgress).length / 43 * 100} color="bg-[#059669]" />
                <ProgressBar label="PODCASTS" progress={state.podcastListened.length / 50 * 100} color="bg-[#7c3aed]" />
                <ProgressBar label="BUSINESSES" progress={Object.keys(state.businessDecodes).length / 100 * 100} color="bg-[#0891b2]" />
             </div>
           </section>

           <section className="bg-gradient-to-br from-[#1c1e24] to-[#0e0f12] border border-[#e8622a]/20 p-5 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#e8622a] uppercase mb-4 flex items-center gap-2">
                <Target size={12} /> Compounding Vision
              </h3>
              <div className="space-y-3">
                 <VisionItem month="M3" target="First Client" income="₹5-10k" />
                 <VisionItem month="M4" target="Cold Outreach" income="₹25k/mo" />
                 <VisionItem month="M6" target="100 Businesses" income="₹1L/mo" />
                 <VisionItem month="Y1" target="1000 Problems" income="₹15-25L/yr" />
                 <VisionItem month="Y2" target="Venture Scaling" income="₹40-80L/yr" />
              </div>
           </section>
        </div>
      </div>

      {/* Command Drawer */}
      <AnimatePresence>
        {selectedCommand && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCommand(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0e0f12] border-l border-[#1c1e24] p-8 z-50 overflow-y-auto"
            >
              <div className="mb-8">
                <span className="text-[10px] font-mono text-[#e8622a] tracking-[0.3em] uppercase">{selectedCommand.source}</span>
                <h2 className="text-2xl font-bold mt-2">{selectedCommand.title}</h2>
              </div>
              
              <div className="space-y-6">
                <DrawerSection label="Instructions" content={selectedCommand.instructions} />
                <DrawerSection label="Why It Exists" content={selectedCommand.why} />
                <DrawerSection label="Resources" content={selectedCommand.resource} isLink />
                <DrawerSection label="Expected Output" content={selectedCommand.output} />
                <DrawerSection label="Impact" content={selectedCommand.impact} />

                <div className="pt-8 flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      completeTask(selectedCommand.id, selectedCommand.source, selectedCommand.title);
                      setSelectedCommand(null);
                    }}
                    className="bg-[#e8622a] text-[#0e0f12] font-bold py-3 rounded flex items-center justify-center gap-2"
                  >
                    COMPLETE <CheckCircle2 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      missTask(selectedCommand.id, selectedCommand.source, selectedCommand.title);
                      setSelectedCommand(null);
                    }}
                    className="bg-transparent border border-[#dc2626] text-[#dc2626] font-bold py-3 rounded flex items-center justify-center gap-2"
                  >
                    MISS / CARRYOVER <XCircle size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = "text-[#dde3ee]", progress }: { label: string; value: string; icon: any; color?: string; progress?: number }) {
  return (
    <div className="bg-[#141519] border border-[#1c1e24] p-4 rounded-lg flex items-center justify-between group hover:border-[#343840] transition-all">
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-[#6b7280] tracking-widest uppercase flex items-center gap-2">
          <Icon size={12} /> {label}
        </div>
        <div className={`text-xl font-bold tracking-tight ${color}`}>{value}</div>
      </div>
      {progress !== undefined && (
        <div className="relative w-12 h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="transparent"
              stroke="#1c1e24"
              strokeWidth="4"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 20}
              initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - progress / 100) }}
              className={color}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
}

function RuleItem({ label, ruleId, isBool = false }) {
  const { state, logRule } = useOS();
  const count = state.ruleLogs[ruleId] || 0;

  return (
    <div className="flex items-center justify-between group">
      <span className="text-xs text-[#b0bac8]">{label}</span>
      <div className="flex items-center gap-2">
        {isBool ? (
          <button 
            onClick={() => logRule(ruleId, count > 0 ? -1 : 1)}
            className={`w-4 h-4 rounded border ${count > 0 ? 'bg-[#e8622a] border-[#e8622a]' : 'border-[#1c1e24]'} transition-all`}
          />
        ) : (
          <div className="flex items-center gap-1.5">
             <button onClick={() => logRule(ruleId, -1)} className="text-[#4b5563] hover:text-[#dde3ee]">-</button>
             <span className="text-xs font-mono w-4 text-center">{count}</span>
             <button onClick={() => logRule(ruleId, 1)} className="text-[#4b5563] hover:text-[#dde3ee]">+</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, progress, color }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] font-mono text-[#6b7280] mb-1.5">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-[#1c1e24] rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}

function VisionItem({ month, target, income }) {
  return (
    <div className="flex justify-between items-center text-[10px] group">
       <div className="flex items-center gap-2">
          <span className="font-mono text-[#4b5563] group-hover:text-[#dde3ee] transition-colors">{month}</span>
          <span className="text-[#b0bac8]">{target}</span>
       </div>
       <div className="font-mono text-[#e8622a] opacity-80">{income}</div>
    </div>
  );
}

function DrawerSection({ label, content, isLink = false }) {
  return (
    <div className="border-l-2 border-[#1c1e24] pl-4">
      <h4 className="text-[10px] font-mono text-[#6b7280] tracking-widest uppercase mb-1.5">{label}</h4>
      <div className={`text-sm leading-relaxed ${isLink ? 'text-[#3b6cf7] underline cursor-pointer' : 'text-[#b0bac8]'}`}>
        {content || '---'}
      </div>
    </div>
  );
}

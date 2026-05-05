import React, { useState } from 'react';
import { useOS } from '../hooks/useOS';
import { History as HistoryIcon, Filter, Search, Calendar, Zap, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Ledger() {
  const { state } = useOS();
  const [filter, setFilter] = useState('All');

  const filteredHistory = state.history.filter(h => filter === 'All' || h.source.includes(filter) || h.type.includes(filter.toLowerCase()));

  const stats = [
    { label: 'TASKS DONE', value: state.completedTasks.length.toString() },
    { label: 'RULE HITS', value: (Object.values(state.ruleLogs) as number[]).reduce((a, b: number) => a + b, 0).toString() },
    { label: 'SIGNALS', value: state.intelligenceSignals.length.toString() },
    { label: 'FOCUS HRS', value: '0.0h' },
  ];

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-[#e8622a] mb-2">
            <HistoryIcon size={24} />
            <h1 className="text-4xl font-bold tracking-tight">Execution Ledger</h1>
          </div>
          <p className="text-[#b0bac8]">Every action, every shift, recorded forever.</p>
        </div>
        <div className="flex gap-4">
           {stats.map(s => (
             <div key={s.label} className="text-right">
                <div className="text-[10px] font-mono text-[#4b5563] tracking-widest uppercase">{s.label}</div>
                <div className="text-lg font-bold">{s.value}</div>
             </div>
           ))}
        </div>
      </header>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'AI Roadmap', 'Skill', 'Reading', 'Podcast', 'Intelligence', 'Rule'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap ${
              filter === f ? 'bg-[#e8622a] text-[#0e0f12] font-bold' : 'bg-[#141519] text-[#b0bac8] hover:bg-[#1c1e24]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="relative border-l border-[#1c1e24] ml-3 space-y-12 pb-12">
        {Object.entries(groupByDate(filteredHistory)).sort((a,b) => b[0].localeCompare(a[0])).map(([date, events]) => (
          <div key={date} className="relative">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1c1e24]" />
            <div className="ml-8">
              <h3 className="text-xs font-mono text-[#6b7280] mb-6 flex items-center gap-2">
                <Calendar size={12} /> {format(new Date(date), 'MMMM d, yyyy')}
              </h3>
              
              <div className="space-y-6">
                {(events as any[]).map((event) => (
                  <div key={event.id} className="flex gap-4 group">
                    <div className="mt-1 flex-shrink-0">
                       <EventIcon type={event.type} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-mono text-[#4b5563] tracking-widest uppercase">{event.source}</span>
                        <span className="text-[9px] font-mono text-[#4b5563]">•</span>
                        <span className="text-[9px] font-mono text-[#4b5563]">{format(event.timestamp, 'HH:mm')}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#dde3ee] group-hover:text-[#e8622a] transition-colors">{event.title}</h4>
                      {event.notes && <p className="text-xs text-[#6b7280] mt-1.5 font-mono">{event.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupByDate(history: any[]) {
  return history.reduce((groups, event) => {
    const date = format(event.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
    return groups;
  }, {});
}

function EventIcon({ type }) {
  switch (type) {
    case 'task_completed': return <CheckCircle2 size={16} className="text-green-500" />;
    case 'task_missed': return <XCircle size={16} className="text-red-500" />;
    case 'rule_logged': return <Zap size={16} className="text-yellow-500" />;
    case 'intelligence_signal_logged': return <Target size={16} className="text-[#3b6cf7]" />;
    default: return <Clock size={16} className="text-[#4b5563]" />;
  }
}


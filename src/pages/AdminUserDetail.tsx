import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { progressService } from '../lib/services/progressService';
import { User, Shield, ChevronLeft, CheckCircle2, History as HistoryIcon, Target, Calendar, Download, Trash2, Loader2, Brain } from 'lucide-react';

export default function AdminUserDetail() {
  const { userId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      progressService.getUserFullProgress(userId).then(res => {
        setData(res);
        setLoading(false);
      }).catch(err => {
        setError(err.message);
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-[#e8622a] animate-spin" size={32} />
          <p className="text-[#4b5563] font-mono text-[10px] uppercase tracking-widest">Gathering Dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#dde3ee] mb-8">
          <ChevronLeft size={16} />
          <span className="text-sm font-mono uppercase tracking-widest">Back to Overview</span>
        </Link>
        <div className="p-12 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
          <p className="text-red-500 font-mono text-sm uppercase">Access Error: {error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  const { profile, history, completed } = data;

  const toggleRole = async () => {
    const newRole = profile.role === 'MASTER' ? 'USER' : 'MASTER';
    if (!confirm(`Change ${profile.display_name} role to ${newRole}?`)) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      // Refresh data
      const res = await progressService.getUserFullProgress(userId!);
      setData(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      <header className="mb-12">
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#dde3ee] mb-6 transition-colors">
          <ChevronLeft size={16} />
          <span className="text-[10px] font-mono uppercase tracking-widest">Return to Personnel List</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#1c1e24] border-2 border-[#e8622a]/30 flex items-center justify-center text-[#e8622a]">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-[#dde3ee]">{profile.display_name}</h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${profile.role === 'MASTER' ? 'bg-[#e8622a]/20 text-[#e8622a]' : 'bg-[#4b5563]/20 text-[#4b5563]'}`}>
                  {profile.role}
                </span>
              </div>
              <p className="text-[#6b7280] font-mono text-xs">{profile.email} • ID: {profile.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={toggleRole}
               className="flex items-center gap-2 px-4 py-2 bg-[#e8622a]/10 border border-[#e8622a]/20 text-[#e8622a] rounded-lg text-xs font-semibold hover:bg-[#e8622a]/20 transition-all"
             >
               <Shield size={14} />
               {profile.role === 'MASTER' ? 'DEMOTE TO USER' : 'PROMOTE TO MASTER'}
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-[#1c1e24] border border-[#2d3139] text-[#dde3ee] rounded-lg text-xs font-semibold hover:bg-[#2d3139] transition-all">
               <Download size={14} />
               EXPORT DATA
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-all">
               <Trash2 size={14} />
               RESET PROGRESS
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Tasks Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="History Events" value={history.length} icon={HistoryIcon} />
        <StatCard label="Skills Reps" value="0" icon={Brain} />
        <StatCard label="Current Streak" value="0" icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section className="bg-[#141519] border border-[#1c1e24] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <HistoryIcon className="text-[#e8622a]" size={20} />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#dde3ee]">Execution Timeline</h3>
          </div>
          
          <div className="space-y-4">
            {history.slice(0, 10).map((event: any) => (
              <div key={event.id} className="flex gap-4 p-3 bg-[#0e0f12] border border-[#1c1e24] rounded-xl hover:border-[#2d3139] transition-all group">
                 <div className="w-10 h-10 rounded-lg bg-[#141519] flex items-center justify-center shrink-0 border border-[#1c1e24]">
                    {event.event_type === 'task_completed' ? (
                      <CheckCircle2 size={18} className="text-[#059669]" />
                    ) : (
                      <Target size={18} className="text-[#6b7280]" />
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#dde3ee] truncate group-hover:text-[#e8622a] transition-colors">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-[#4b5563] uppercase">{event.source}</span>
                      <span className="w-1 h-1 rounded-full bg-[#1c1e24]" />
                      <span className="text-[10px] font-mono text-[#4b5563]">{new Date(event.created_at).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* System Diagnostics */}
        <section className="space-y-6">
           <div className="bg-[#141519] border border-[#1c1e24] rounded-2xl p-6">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#dde3ee] mb-6">Engagement Score</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6b7280]">Target Progress</span>
                    <span className="text-xs font-mono text-[#e8622a]">24%</span>
                 </div>
                 <div className="h-1.5 bg-[#0e0f12] rounded-full overflow-hidden border border-[#1c1e24]">
                    <div className="h-full bg-[#e8622a] w-[24%]" />
                 </div>
                 <p className="text-[10px] text-[#4b5563] italic">Operator engagement is within normal parameters for Week 1.</p>
              </div>
           </div>
           
           <div className="bg-[#141519] border border-[#1c1e24] rounded-2xl p-6">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#dde3ee] mb-6">System Health</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-[#0e0f12] border border-[#1c1e24] rounded-xl text-center">
                    <p className="text-[10px] font-mono text-[#4b5563] uppercase mb-1">Last Active</p>
                    <p className="text-xs font-bold text-[#dde3ee]">{history.length > 0 ? new Date(history[0].created_at).toLocaleDateString() : 'N/A'}</p>
                 </div>
                 <div className="p-3 bg-[#0e0f12] border border-[#1c1e24] rounded-xl text-center">
                    <p className="text-[10px] font-mono text-[#4b5563] uppercase mb-1">Data Points</p>
                    <p className="text-xs font-bold text-[#dde3ee]">{completed.length + history.length}</p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-[#141519] border border-[#1c1e24] p-5 rounded-2xl group hover:border-[#e8622a]/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-[#0e0f12] rounded-lg border border-[#1c1e24] text-[#4b5563] group-hover:text-[#e8622a] transition-colors">
          <Icon size={16} />
        </div>
      </div>
      <p className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#dde3ee] tracking-tight">{value}</p>
    </div>
  );
}

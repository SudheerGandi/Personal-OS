import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, Map, BookOpen, Mic, Database, History, Settings, Brain, Info, Timer, Shield, LogOut, User as UserIcon, Crown, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOS } from '../hooks/useOS';

const mainLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/focus', icon: Timer, label: 'Focus Room' },
  { to: '/roadmap', icon: Map, label: 'AI Roadmap' },
];

const knowledgeLinks = [
  { to: '/skills', icon: Target, label: 'Skills OS' },
  { to: '/reading', icon: BookOpen, label: 'Reading OS' },
  { to: '/podcasts', icon: Mic, label: 'Podcast OS' },
  { to: '/information', icon: Info, label: 'Intelligence OS' },
  { to: '/business-decoder', icon: Brain, label: 'Business Decoder' },
  { to: '/history-curriculum', icon: History, label: 'History Vault' },
];

const systemLinks = [
  { to: '/history', icon: Database, label: 'Execution Ledger' },
  { to: '/strategy', icon: Shield, label: 'System Strategy' },
  { to: '/review', icon: Target, label: 'Weekly Review' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const { user, profile, isMaster, signOut } = useAuth();
  const { hasLocalData, migrateLocalData, isSyncing } = useOS();
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[Navigation] Sign out initiated');
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('[Navigation] Sign out error:', err);
      // Even if it fails, navigate to login
      navigate('/login');
    }
  };

  return (
    <nav className="w-64 border-r border-[#1c1e24] bg-[#0e0f12] flex flex-col p-4 overflow-y-auto">
      <div className="mb-8 px-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-[#e8622a]">EXECUTION OS</h1>
          <p className="text-[10px] text-[#6b7280] font-mono tracking-widest uppercase">Multi-User Protocol</p>
        </div>
      </div>
      
      <div className="flex-1 space-y-8">
        {hasLocalData && user && (
          <div className="px-2 py-3 bg-[#e8622a]/5 border border-[#e8622a]/20 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-[#e8622a] shrink-0" size={16} />
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-[#e8622a]">Local Data Detected</p>
                <p className="text-[10px] text-[#b0bac8] leading-tight">Sync previous local progress to your account?</p>
                <button 
                  onClick={migrateLocalData}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 text-[9px] font-bold bg-[#e8622a] text-[#0e0f12] px-2 py-1 rounded hover:bg-[#ff7b45] transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
                  SYNC PROGRESS
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="text-[9px] font-mono text-[#4b5563] uppercase tracking-[0.3em] mb-3 px-3">Primary</div>
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm group ${
                    isActive 
                      ? 'bg-[#1c1e24] text-[#e8622a]' 
                      : 'text-[#b0bac8] hover:bg-[#141519] hover:text-[#dde3ee]'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
           <div className="text-[9px] font-mono text-[#4b5563] uppercase tracking-[0.3em] mb-3 px-3">Knowledge Modules</div>
           <div className="space-y-1">
            {knowledgeLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm group ${
                    isActive 
                      ? 'bg-[#1c1e24] text-[#e8622a]' 
                      : 'text-[#b0bac8] hover:bg-[#141519] hover:text-[#dde3ee]'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
           <div className="text-[9px] font-mono text-[#4b5563] uppercase tracking-[0.3em] mb-3 px-3">Infrastructure</div>
           <div className="space-y-1">
            {systemLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm group ${
                    isActive 
                      ? 'bg-[#1c1e24] text-[#e8622a]' 
                      : 'text-[#b0bac8] hover:bg-[#141519] hover:text-[#dde3ee]'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}
            
            {isMaster && (
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm group ${
                    isActive 
                      ? 'bg-[#e8622a]/10 text-[#e8622a]' 
                      : 'text-[#e8622a] hover:bg-[#e8622a]/5'
                  }`
                }
              >
                <Crown className="w-4 h-4" />
                <span>Master Admin</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-[#1c1e24]">
        <div className="px-3 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1c1e24] border border-[#2d3139] flex items-center justify-center overflow-hidden">
            <UserIcon size={16} className="text-[#6b7280]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#dde3ee] truncate">{profile?.display_name || user?.email?.split('@')[0]}</p>
            <div className="flex items-center gap-1">
               <span className={`text-[8px] font-mono px-1 rounded ${isMaster ? 'bg-[#e8622a]/20 text-[#e8622a]' : 'bg-[#4b5563]/20 text-[#4b5563]'}`}>
                 {isMaster ? 'MASTER' : 'USER'}
               </span>
            </div>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-3 py-2 text-[#4b5563] hover:text-red-400 hover:bg-red-400/5 rounded-md transition-all text-xs font-medium cursor-pointer relative z-10"
        >
          <span>Sign Out</span>
          <LogOut size={14} />
        </button>

        <div className="mt-4 px-3 text-[9px] text-[#4b5563] font-mono uppercase tracking-[0.1em]">
          <p>SYSTEM BROADCASTING</p>
          <p>© 2026 EXECUTION OS</p>
        </div>
      </div>
    </nav>
  );
}


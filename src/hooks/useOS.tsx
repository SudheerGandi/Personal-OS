import React, { createContext, useContext, useState, useEffect } from 'react';
import { OSState, Command, HistoryEvent } from '../types';
import { aiRoadmap } from '../lib/data/aiRoadmap';
import { skills } from '../lib/data/skills';
import { books } from '../lib/data/books';
import { podcasts } from '../lib/data/podcasts';
import { rules } from '../lib/data/rules';
import { dailySchedule } from '../lib/data/dailySchedule';
import { useAuth } from './useAuth';
import { progressService } from '../lib/services/progressService';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'execution-cockpit-v1';
const START_DATE = '2026-05-04';

const initialState: OSState = {
  date: START_DATE,
  week: 1,
  day: 1,
  streak: 0,
  history: [],
  completedTasks: [],
  missedTasks: [],
  carryovers: [],
  ruleLogs: {},
  businessDecodes: {},
  readingProgress: {},
  podcastListened: [],
  intelligenceSignals: [],
  skillReps: {},
  settings: {
    startDate: START_DATE,
  },
};

interface OSContextType {
  state: OSState;
  commands: Command[];
  completeTask: (id: string, source: string, title: string) => void;
  missTask: (id: string, source: string, title: string) => void;
  undoTask: (taskId: string, eventId?: string) => void;
  logSignal: (signal: any) => void;
  logRule: (ruleId: number, val: number) => void;
  resetProgress: () => void;
  isSyncing: boolean;
  migrateLocalData: () => Promise<void>;
  hasLocalData: boolean;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [state, setState] = useState<OSState>(initialState);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);

  // Set current date, week and day on mount and check periodically
  useEffect(() => {
    const updateDate = () => {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const startDateStr = localStorage.getItem('execution-cockpit-start-date') || START_DATE;
      
      const startDate = new Date(startDateStr);
      const currDate = new Date(today);
      
      const diffTime = currDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const actualDiffDays = Math.max(1, diffDays);
      
      const week = Math.floor((actualDiffDays - 1) / 7) + 1;
      const day = (actualDiffDays - 1) % 7 + 1;

      setState(prev => {
        if (prev.date === today) return prev;
        return {
          ...prev,
          date: today,
          week,
          day
        };
      });

      if (!localStorage.getItem('execution-cockpit-start-date')) {
        localStorage.setItem('execution-cockpit-start-date', START_DATE);
      }
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Listen for cross-tab updates (for non-logged in users)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && !user) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Reset state when user logs out
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
        setHasLocalData(true);
      } else {
        setState(initialState);
        setHasLocalData(false);
      }
    }
  }, [user]);

  // Check for local data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHasLocalData(true);
      if (!user) {
        setState(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save to local storage on changes (only if not logged in)
  useEffect(() => {
    if (!user && state !== initialState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, user]);

  // Load and subscribe to DB progress when user logs in
  useEffect(() => {
    let isMounted = true;
    let channel: any = null;

    if (user) {
      const loadProgress = async (isRealtimeUpdate = false) => {
        if (!isMounted) return;
        if (!isRealtimeUpdate) setIsSyncing(true);
        
        try {
          // Parallel fetch with error resilience
          const results = await Promise.allSettled([
            progressService.getUserHistory(user.id),
            progressService.getCompletedCommands(user.id),
            supabase.from('rule_logs').select('*').eq('user_id', user.id),
            supabase.from('signal_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('reading_progress').select('*').eq('user_id', user.id),
            supabase.from('skill_reps').select('*').eq('user_id', user.id),
            supabase.from('podcast_logs').select('*').eq('user_id', user.id)
          ]);

          const history = results[0].status === 'fulfilled' ? results[0].value : [];
          const completed = results[1].status === 'fulfilled' ? results[1].value : [];
          const ruleLogs = results[2].status === 'fulfilled' ? results[2].value.data : [];
          const signals = results[3].status === 'fulfilled' ? results[3].value.data : [];
          const reading = results[4].status === 'fulfilled' ? results[4].value.data : [];
          const skills = results[5].status === 'fulfilled' ? results[5].value.data : [];
          const podcasts = results[6].status === 'fulfilled' ? results[6].value.data : [];

          const today = new Date().toISOString().split('T')[0];
          const ruleLogsMap: { [key: string]: number } = {};
          if (ruleLogs) {
            ruleLogs.forEach((log: any) => {
              // Only include today's logs for the dashboard counter
              if (log.log_date === today) {
                if (log.problems_written) ruleLogsMap['1'] = (ruleLogsMap['1'] || 0) + log.problems_written;
                if (log.outreaches_sent) ruleLogsMap['4'] = (ruleLogsMap['4'] || 0) + log.outreaches_sent;
              }
            });
          }

          if (isMounted) {
            setState(prev => ({
              ...prev,
              history: (history || []).map((e: any) => ({
                id: e.id,
                timestamp: new Date(e.created_at).getTime(),
                type: e.event_type as any,
                title: e.title,
                source: e.source,
                taskId: e.metadata?.taskId,
                notes: e.metadata?.notes || e.metadata?.timestamp?.toString() // Fallback
              })),
              completedTasks: (completed || []).map((c: any) => c.command_id),
              ruleLogs: ruleLogsMap,
              intelligenceSignals: (signals || []).map((s: any) => ({ bucket: s.bucket_id, content: s.signal })),
              readingProgress: (reading || []).reduce((acc: any, r: any) => ({ ...acc, [r.reading_id]: r.completed }), {}),
              skillReps: (skills || []).reduce((acc: any, s: any) => ({ ...acc, [s.skill_id]: (acc[s.skill_id] || 0) + 1 }), {}),
              podcastListened: (podcasts || []).map((p: any) => p.podcast_id)
            }));
          }
        } catch (err) {
          console.error('Error in loadProgress:', err);
        } finally {
          if (isMounted && !isRealtimeUpdate) setIsSyncing(false);
        }
      };

      loadProgress();

      // Consolidated real-time channel
      channel = supabase
        .channel(`user-sync-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'history_events', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] History updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'completed_commands', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Commands updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rule_logs', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Rules updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'signal_logs', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Signals updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reading_progress', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Reading updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'skill_reps', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Skills updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'podcast_logs', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Podcasts updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'business_decode_entries', filter: `user_id=eq.${user.id}` }, () => {
          console.log('[Sync] Business decodes updated');
          loadProgress(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, () => {
          console.log('[Sync] Profile role/status updated');
          loadProgress(true);
        })
        .subscribe((status) => {
          console.log(`[Sync] Channel status: ${status}`);
        });

      return () => {
        isMounted = false;
        if (channel) supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const migrateLocalData = async () => {
    if (!user) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const localState = JSON.parse(saved) as OSState;
    setIsSyncing(true);

    try {
      // Migrate history and completed tasks
      await Promise.all([
        ...localState.history.map(e => progressService.createHistoryEvent(user.id, {
          type: e.type,
          title: e.title,
          source: e.source,
          taskId: e.taskId,
          metadata: { timestamp: e.timestamp }
        })),
        ...localState.completedTasks.map(id => progressService.logCompletedCommand(user.id, id, 'Migrated'))
      ]);

      // Clear local storage after successful migration
      localStorage.removeItem(STORAGE_KEY);
      setHasLocalData(false);
      
      // Refresh state from DB
      const [history, completed] = await Promise.all([
        progressService.getUserHistory(user.id),
        progressService.getCompletedCommands(user.id)
      ]);

      setState(prev => ({
        ...prev,
        history: history.map((e: any) => ({
          id: e.id,
          timestamp: new Date(e.created_at).getTime(),
          type: e.event_type as any,
          title: e.title,
          source: e.source,
          taskId: e.metadata?.taskId,
          notes: e.metadata?.notes
        })),
        completedTasks: completed.map((c: any) => c.command_id)
      }));

    } catch (err) {
      console.error('Migration failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const commands = React.useMemo(() => {
    const today: Command[] = [];
    const dayOfWeek = new Date(state.date).getDay();

    // 1. Rules (Daily)
    today.push({
      id: `${state.date}-rule-1`,
      title: 'Write 5 problems before breakfast',
      source: 'Rule',
      timeWindow: 'Morning',
      duration: '30m',
      resource: 'Google Maps 1-star reviews',
      priorityReason: 'Problem spotting is the root of business.',
      impact: '+2 Meta Points',
      instructions: 'Open your problem journal. Write 5 specific problems you or others face. Rate them.',
      why: 'No problems = no business.',
      output: '5 problems in journal'
    });

    // 2. AI Roadmap
    const weekData = aiRoadmap.find(w => w.week === state.week);
    if (weekData) {
      today.push({
        id: `ai-roadmap-w${state.week}-d${state.day}`,
        title: `AI Study: ${weekData.title} (Part ${state.day})`,
        source: 'AI Roadmap',
        timeWindow: 'Morning',
        duration: '2h',
        resource: weekData.resources[0].url,
        priorityReason: 'Technical foundation for ₹50L target.',
        impact: 'Roadmap Progress',
        instructions: `Dive into ${weekData.summary}. Objectives: ${weekData.objectives.slice(0, 2).join(', ')}.`,
        why: 'You are an engineer first.',
        output: 'Typed code in repo'
      });
    }

    // 3. Books
    const currentBook = books.find(b => {
      const [start, end] = b.weeks.split('–').map(Number);
      return state.week >= start && state.week <= (end || start);
    });
    if (currentBook) {
      today.push({
        id: `${state.date}-book-${currentBook.title}`,
        title: `Reading: ${currentBook.title}`,
        source: 'Book',
        timeWindow: 'Morning',
        duration: '30m',
        resource: currentBook.author,
        priorityReason: 'Mental model expansion.',
        impact: 'Metalearning',
        instructions: `Read 30 mins. Action: ${currentBook.action}.`,
        why: 'Learning how to think.',
        output: '5-sentence recall summary'
      });
    }

    // 4. Skills
    const currentSkill = skills.find(s => s.id === state.day % 8 || 1);
    if (currentSkill) {
      today.push({
        id: `${state.date}-skill-${currentSkill.id}`,
        title: `Skill Drill: ${currentSkill.name}`,
        source: 'Skill Drill',
        timeWindow: 'Morning',
        duration: '90m',
        resource: currentSkill.resources.join(', ') || 'Roadmap',
        priorityReason: 'Compounding reps.',
        impact: 'Phase 1 Unlock',
        instructions: currentSkill.drill,
        why: 'Consistency over intensity.',
        output: 'Drill results logged'
      });
    }

    // 5. Business Rotation (Monday = Sales)
    if (dayOfWeek === 1) {
       today.push({
        id: `${state.date}-biz-rot-sales`,
        title: 'Sales & Copywriting Block',
        source: 'Business Rotation',
        timeWindow: 'Afternoon',
        duration: '90m',
        resource: 'thegaryhalbertletter.com',
        priorityReason: 'Monday is for money.',
        impact: 'Revenue Skills',
        instructions: 'Read 1 Halbert letter. Write 1 paragraph copying his style.',
        why: 'Sales is the highest leverage skill.',
        output: '1 sales paragraph written'
      });
    }

    // 6. Outreach
    today.push({
      id: `${state.date}-outreach-daily`,
      title: 'Send 5 Outreaches',
      source: 'Rule',
      timeWindow: 'Afternoon',
      duration: '45m',
      resource: 'LinkedIn/Email',
      priorityReason: 'No outreach = no clients.',
      impact: 'Pipeline Growth',
      instructions: 'Find 5 prospects. Send high-signal DMs.',
      why: 'Exposure to the market.',
      output: '5 DMs sent'
    });

    // 7. Intelligence
    today.push({
      id: `${state.date}-intel-scan`,
      title: '5-Bucket Intelligence Scan',
      source: 'Intelligence',
      timeWindow: 'Evening',
      duration: '45m',
      resource: 'Roadmap Sources',
      priorityReason: 'Signal detection.',
      impact: 'Opportunity Radar',
      instructions: 'Scan Trade, Startups, Global Deals, AI & Tech, Markets. Log 2 signals.',
      why: 'Information advantage.',
      output: '2 signals logged'
    });

    return today.filter(c => !state.completedTasks.includes(c.id) && !state.missedTasks.includes(c.id));
  }, [state.date, state.week, state.day, state.completedTasks, state.missedTasks]);

  const completeTask = async (id: string, source: string, title: string) => {
    const event: HistoryEvent = {
       id: Math.random().toString(36).substr(2, 9),
       timestamp: Date.now(),
       type: 'task_completed',
       title,
       source,
       taskId: id
    };

    // Update local state for immediate feedback
    setState(prev => ({
      ...prev,
      history: [event, ...prev.history],
      completedTasks: [...prev.completedTasks, id]
    }));

    // Sync with DB if user is logged in
    if (user) {
      try {
        await Promise.all([
          progressService.logCompletedCommand(user.id, id, source),
          progressService.createHistoryEvent(user.id, {
            type: 'task_completed',
            title,
            source,
            taskId: id
          })
        ]);
      } catch (err) {
        console.error('Failed to sync completeTask:', err);
      }
    }
  };

  const missTask = async (id: string, source: string, title: string) => {
    const event: HistoryEvent = {
       id: Math.random().toString(36).substr(2, 9),
       timestamp: Date.now(),
       type: 'task_missed',
       title,
       source,
       taskId: id
    };

    setState(prev => ({
      ...prev,
      history: [event, ...prev.history],
      missedTasks: [...prev.missedTasks, id]
    }));

    if (user) {
      try {
        await progressService.createHistoryEvent(user.id, {
          type: 'task_missed',
          title,
          source,
          taskId: id
        });
      } catch (err) {
        console.error('Failed to sync missTask:', err);
      }
    }
  };

  const undoTask = async (taskId: string, eventId?: string) => {
    setState(prev => ({
      ...prev,
      completedTasks: prev.completedTasks.filter(tid => tid !== taskId),
      missedTasks: prev.missedTasks.filter(tid => tid !== taskId),
      history: prev.history.filter(event => 
        eventId ? event.id !== eventId : event.taskId !== taskId
      )
    }));

    if (user) {
      try {
        // Logic to remove from DB would go here
        // For now, history events are immutable in this simple implementation
        // unless I add delete methods to progressService
      } catch (err) {
        console.error('Failed to sync undoTask:', err);
      }
    }
  };

  const logSignal = async (signal: any) => {
     const event: HistoryEvent = {
       id: Math.random().toString(36).substr(2, 9),
       timestamp: Date.now(),
       type: 'intelligence_signal_logged',
       title: `Signal: ${signal.bucket}`,
       source: 'Intelligence OS',
       notes: signal.content
    };
    setState(prev => ({
      ...prev,
      history: [event, ...prev.history],
      intelligenceSignals: [signal, ...prev.intelligenceSignals]
    }));

    if (user) {
      try {
        await progressService.createHistoryEvent(user.id, {
          type: 'intelligence_signal_logged',
          title: `Signal: ${signal.bucket}`,
          source: 'Intelligence OS',
          metadata: { notes: signal.content }
        });
      } catch (err) {
        console.error('Failed to sync logSignal:', err);
      }
    }
  }

  const logRule = async (ruleId: number, val: number) => {
    setState(prev => ({
      ...prev,
      ruleLogs: { ...prev.ruleLogs, [ruleId]: (prev.ruleLogs[ruleId] || 0) + val }
    }));

    if (user) {
      try {
        await progressService.logRule(user.id, ruleId.toString(), val);
      } catch (err) {
        console.error('Failed to sync logRule:', err);
      }
    }
  }

  const resetProgress = async () => {
    if (confirm('Erase all progress? This cannot be undone.')) {
      if (user) {
        // DB reset logic
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
      }
    }
  }

  return (
    <OSContext.Provider value={{ 
      state, 
      commands, 
      completeTask, 
      missTask, 
      undoTask, 
      logSignal, 
      logRule, 
      resetProgress,
      isSyncing,
      migrateLocalData,
      hasLocalData
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};

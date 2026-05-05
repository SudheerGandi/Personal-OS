import { supabase } from '../supabase';

export const progressService = {
  // Profiles
  async ensureProfile(userId: string, email: string, displayName: string, role: 'MASTER' | 'USER') {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, email, display_name: displayName, role }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Completed Commands
  async logCompletedCommand(userId: string, commandId: string, source: string, timeSpent: number = 0) {
    const { error } = await supabase
      .from('completed_commands')
      .insert({
        user_id: userId,
        command_id: commandId,
        source: source,
        time_spent_minutes: timeSpent,
        completed_at: new Date().toISOString()
      });
    if (error) throw error;
  },

  async getCompletedCommands(userId: string) {
    const { data, error } = await supabase
      .from('completed_commands')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  // History
  async createHistoryEvent(userId: string, event: { type: string, title: string, source: string, taskId?: string, metadata?: any }) {
    const { error } = await supabase
      .from('history_events')
      .insert({
        user_id: userId,
        event_type: event.type,
        title: event.title,
        source: event.source,
        metadata: { ...event.metadata, taskId: event.taskId },
        created_at: new Date().toISOString()
      });
    if (error) throw error;
  },

  async getUserHistory(userId: string) {
    const { data, error } = await supabase
      .from('history_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Rule Logs
  async logRule(userId: string, ruleId: string, value: number) {
    // This might need a more complex setup if we want to track per day
    // The request said: rule_logs(log_date, problems_written, outreaches_sent, ...)
    // For simplicity, I'll use simple key-value for now or a daily record
    const today = new Date().toISOString().split('T')[0];
    
    // Check if record exists for today
    const { data: existing } = await supabase
      .from('rule_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', today)
      .single();

    if (existing) {
      // Update logic based on rule
      // Mocking for now: if ruleId is 'problems', increment problems_written
      const updates: any = {};
      if (ruleId === '1') updates.problems_written = (existing.problems_written || 0) + value;
      // ... add other rules
      const { error } = await supabase
        .from('rule_logs')
        .update(updates)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const initial: any = { user_id: userId, log_date: today };
      if (ruleId === '1') initial.problems_written = value;
      const { error } = await supabase
        .from('rule_logs')
        .insert(initial);
      if (error) throw error;
    }
  },

  // Reading
  async saveReadingProgress(userId: string, bookId: string, completed: boolean, notes: string = '') {
    const { error } = await supabase
      .from('reading_progress')
      .upsert({ user_id: userId, reading_id: bookId, completed, notes, updated_at: new Date().toISOString() }, { onConflict: 'user_id, reading_id' });
    if (error) throw error;
  },

  // Podcasts
  async logPodcast(userId: string, podcastId: string, minutes: number = 0) {
    const { error } = await supabase
      .from('podcast_logs')
      .insert({ user_id: userId, podcast_id: podcastId, minutes, listened_at: new Date().toISOString() });
    if (error) throw error;
  },

  // Intelligence
  async saveSignal(userId: string, bucketId: string, signal: string, insight: string = '') {
    const { error } = await supabase
      .from('signal_logs')
      .insert({ user_id: userId, bucket_id: bucketId, signal, insight, created_at: new Date().toISOString() });
    if (error) throw error;
  },

  // Business Decoder
  async saveBusinessDecode(userId: string, businessId: string, payload: any) {
    const { error } = await supabase
      .from('business_decode_entries')
      .insert({ 
        user_id: userId, 
        business_id: businessId, 
        ...payload,
        decoded_at: new Date().toISOString() 
      });
    if (error) throw error;
  },

  // Skills
  async logSkillRep(userId: string, skillId: string, notes: string = '') {
    const { error } = await supabase
      .from('skill_reps')
      .insert({ 
        user_id: userId, 
        skill_id: skillId, 
        rep_date: new Date().toISOString().split('T')[0],
        notes 
      });
    if (error) throw error;
  },

  // Admin Functions
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getUserFullProgress(userId: string) {
    // Helper to fetch everything for a user (Master view)
    const [history, completed, profiles] = await Promise.all([
      this.getUserHistory(userId),
      this.getCompletedCommands(userId),
      supabase.from('profiles').select('*').eq('id', userId).single()
    ]);

    return {
      profile: profiles.data,
      history,
      completed
    };
  }
};

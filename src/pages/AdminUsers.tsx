import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { progressService } from '../lib/services/progressService';
import { Users, User, ArrowRight, Shield, Crown, Search, ExternalLink } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    progressService.getAllUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter(u => 
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-[#e8622a]" size={24} />
          <h1 className="text-2xl font-bold tracking-tight text-[#dde3ee]">Master Control Panel</h1>
        </div>
        <p className="text-[#6b7280] font-mono text-xs uppercase tracking-widest">Fleet Overview & Personnel Management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#141519] border border-[#1c1e24] p-5 rounded-xl">
           <p className="text-[10px] font-mono text-[#4b5563] uppercase mb-1">Total Operators</p>
           <p className="text-2xl font-bold text-[#dde3ee]">{users.length}</p>
        </div>
        <div className="bg-[#141519] border border-[#1c1e24] p-5 rounded-xl">
           <p className="text-[10px] font-mono text-[#4b5563] uppercase mb-1">Active Roles</p>
           <p className="text-2xl font-bold text-[#e8622a]">{users.filter(u => u.role === 'MASTER').length} Master / {users.filter(u => u.role === 'USER').length} User</p>
        </div>
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
           <input 
             type="text" 
             placeholder="Search by name or email..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full h-full bg-[#141519] border border-[#1c1e24] rounded-xl pl-12 pr-4 text-sm text-[#dde3ee] focus:outline-none focus:border-[#e8622a]/50 placeholder-[#4b5563]"
           />
        </div>
      </div>

      <div className="bg-[#141519] border border-[#1c1e24] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1c1e24]/50 border-b border-[#1c1e24]">
              <th className="px-6 py-4 text-[10px] font-mono text-[#4b5563] uppercase tracking-widest">Operator</th>
              <th className="px-6 py-4 text-[10px] font-mono text-[#4b5563] uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-[10px] font-mono text-[#4b5563] uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-[10px] font-mono text-[#4b5563] uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1e24]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#4b5563] font-mono animate-pulse">Loading personnel data...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#4b5563] font-mono">No matching operators found in system.</td>
              </tr>
            ) : filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-[#1c1e24]/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#0e0f12] flex items-center justify-center text-[#e8622a] border border-[#1c1e24]">
                      {u.role === 'MASTER' ? <Crown size={16} /> : <User size={16} />}
                    </div>
                    <span className="text-sm font-semibold text-[#dde3ee]">{u.display_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b7280] font-mono">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${u.role === 'MASTER' ? 'bg-[#e8622a]/10 text-[#e8622a] border border-[#e8622a]/20' : 'bg-[#4b5563]/10 text-[#4b5563] border border-[#1c1e24]'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/admin/users/${u.id}`}
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-[#e8622a] hover:text-[#ff7b45] px-3 py-1.5 bg-[#e8622a]/5 rounded transition-all"
                  >
                    VIEW DOSSIER
                    <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

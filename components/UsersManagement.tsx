'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Loader2, AlertCircle, Trash2, UserCog } from 'lucide-react';
import { useAuth } from '@/app/auth-context';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'admin' | 'customer';
  created_at: string;
}

export function UsersManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role: currentUserRole } = useAuth();
  
  const isOwner = currentUserRole === 'owner';

  async function fetchUsers() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setUsers(data);
    } catch (err: any) {
      if (err.code === '42P01') {
         setError('The "profiles" table is missing. Please run the SQL schema file provided in supabase_roles_schema.sql!');
      } else {
         setError(err.message || 'Failed to load users. Are you connected to Supabase?');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateRole = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole as any } : u));
    } catch (err: any) {
      alert('Error updating role: ' + err.message);
    }
  };

  const deleteProfile = async (id: string) => {
     if (!confirm('Are you sure you want to delete this profile? Note: this only deletes the profile record, not the auth user in this mockup.')) return;
     try {
       const { error } = await supabase.from('profiles').delete().eq('id', id);
       if (error) throw error;
       setUsers(users.filter(u => u.id !== id));
     } catch(err: any) {
       alert('Error deleting user: ' + err.message);
     }
  }

  if (loading) return <div className="p-6 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-slate-500" /> Loading users...</div>;
  
  if (error) {
    return (
      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-900 mb-1">Setup Required</h3>
            <p className="text-xs text-amber-800">{error}</p>
            <p className="text-xs text-amber-800 mt-2 font-medium">To fix this, go to your Supabase SQL Editor and run the queries found in <code className="bg-amber-100 px-1 rounded">supabase_roles_schema.sql</code>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.full_name || 'Guest User'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                    ${user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 
                      user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 
                      'bg-slate-100 text-slate-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Only owners can change someone else to owner, admins can change customers to admins, etc. */}
                    {isOwner ? (
                      <select 
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="bg-white border border-slate-200 text-xs rounded px-2 py-1 outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                      </select>
                    ) : (
                      <div className="text-[10px] text-slate-400">Restricted</div>
                    )}
                    
                    {isOwner && (
                      <button 
                        onClick={() => deleteProfile(user.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500 text-sm">
                  No users found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

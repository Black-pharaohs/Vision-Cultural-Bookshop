'use client';

import { useAuth } from '@/app/auth-context';

export function RoleSelector() {
  const { role, setRole } = useAuth();

  return (
    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider hidden sm:inline">User Role:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
        className="bg-transparent text-indigo-700 font-bold text-xs outline-none cursor-pointer"
      >
        <option value="owner">Owner (المالك)</option>
        <option value="admin">Admin (المدير)</option>
        <option value="customer">Customer (مستفيد)</option>
      </select>
    </div>
  );
}

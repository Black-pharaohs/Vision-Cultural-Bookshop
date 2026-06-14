'use client';

import { useAuth } from '@/app/auth-context';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Lock, LogOut, Mail, Shield, User as UserIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, role, loading: authLoading, signOut } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setFetching(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (!error && data) {
          setProfileData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, [user]);

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Not Logged In</h2>
        <p className="text-slate-500 mb-6 text-sm">Please sign in to view your profile.</p>
        <Link href="/auth" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-indigo-600 relative">
            <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-indigo-600 overflow-hidden">
               {profileData?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  {profileData?.full_name || 'Anonymous User'}
                </h1>
                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
              </div>
              <button 
                onClick={signOut}
                className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Access Role</h3>
                  <p className="font-bold text-slate-900 capitalize">{role}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">User ID</h3>
                  <p className="font-mono text-xs text-slate-900 break-all">{user.id}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

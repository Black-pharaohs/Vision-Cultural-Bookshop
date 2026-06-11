'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function SystemStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        setStatus('offline');
      }
    }

    checkConnection();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="uppercase tracking-wider">Connecting...</span>
      </div>
    );
  }

  if (status === 'online') {
    return (
      <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
        <CheckCircle2 className="w-3 h-3" />
        <span className="uppercase tracking-wider">System Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
      <XCircle className="w-3 h-3" />
      <span className="uppercase tracking-wider">Database Offline</span>
    </div>
  );
}

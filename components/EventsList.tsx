'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export interface Event {
  id: string;
  name: string;
  event_date: string;
  event_time: string;
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setEvents([
          { id: '1', name: 'Tech Talk: The Future of AI', event_date: '2026-07-01', event_time: '18:00:00' },
          { id: '2', name: 'Book Signing: Clean Code', event_date: '2026-07-15', event_time: '14:00:00' }
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
        if (error) throw error;
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div className="text-sm text-neutral-500 animate-pulse bg-white p-6 rounded-xl border border-neutral-200">Loading events...</div>;
  if (error) return <div className="text-sm text-red-600 bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-indigo-900 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              🎭
            </div>
            <div>
              <h3 className="font-bold line-clamp-1">{event.name}</h3>
              <p className="text-indigo-300 text-xs mt-1">
                {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {event.event_time.slice(0, 5)}
              </p>
            </div>
          </div>
          <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-black shrink-0 hover:bg-indigo-50 transition-colors">
            Register
          </button>
        </div>
      ))}
      {events.length === 0 && (
        <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl">
          No upcoming events.
        </div>
      )}
    </div>
  );
}

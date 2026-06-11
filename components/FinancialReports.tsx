'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/app/currency-context';
import { TrendingUp, BookCopy, DollarSign, Loader2, AlertCircle } from 'lucide-react';

export function FinancialReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBooksSold, setTotalBooksSold] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const { data: sales, error: salesError } = await supabase
          .from('sales')
          .select('quantity_sold, total_price');

        if (salesError) throw salesError;

        if (sales) {
          const revenue = sales.reduce((acc, curr) => acc + Number(curr.total_price), 0);
          const soldBooks = sales.reduce((acc, curr) => acc + Number(curr.quantity_sold), 0);
          
          setTotalRevenue(revenue);
          setTotalBooksSold(soldBooks);
          setTransactionsCount(sales.length);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    loadReports();
    
    // In a real app we might set up a realtime subscription here
    // using Supabase real-time to update the numbers automatically when sales occur
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sales' },
        (payload) => {
          setTotalRevenue(prev => prev + Number(payload.new.total_price));
          setTotalBooksSold(prev => prev + Number(payload.new.quantity_sold));
          setTransactionsCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div className="text-sm text-slate-500 animate-pulse bg-white p-6 rounded-2xl border border-slate-200">Loading reports...</div>;
  if (error) return <div className="text-sm text-red-600 bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total Revenue</h3>
          <div className="text-xl font-black text-slate-900">{formatPrice(totalRevenue)}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
          <BookCopy className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Books Sold</h3>
          <div className="text-xl font-black text-slate-900">{totalBooksSold} <span className="text-sm font-medium text-slate-500">units</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Transactions</h3>
          <div className="text-xl font-black text-slate-900">{transactionsCount} <span className="text-sm font-medium text-slate-500">sales</span></div>
        </div>
      </div>
    </div>
  );
}

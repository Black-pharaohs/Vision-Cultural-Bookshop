'use client';

import { useCurrency } from '@/app/currency-context';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Currency:</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as any)}
        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
      >
        <option value="USD">USD ($)</option>
        <option value="EGP">EGP (£)</option>
        <option value="SDG">SDG (ج.س)</option>
      </select>
    </div>
  );
}

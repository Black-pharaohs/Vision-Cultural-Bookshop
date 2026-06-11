import { BooksList } from '@/components/BooksList';
import { EventsList } from '@/components/EventsList';
import { SalesTerminal } from '@/components/SalesTerminal';
import { CurrencySelector } from '@/components/CurrencySelector';
import { FinancialReports } from '@/components/FinancialReports';
import { SystemStatus } from '@/components/SystemStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Vision Books System
              </h1>
              <p className="text-[10px] text-indigo-600 font-medium tracking-widest uppercase">
                By Black Pharaohs Code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <CurrencySelector />
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-sm font-semibold">User</span>
              <SystemStatus />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-indigo-100 flex items-center justify-center text-xl">
              <span className="w-5 h-5 opacity-70">👤</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Financial Reports Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
            </div>
            <FinancialReports />
          </section>

          {/* Books Inventory Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Books Inventory</h2>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                Add Book +
              </button>
            </div>
            <BooksList />
          </section>

          {/* Upcoming Events Section */}
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
            </div>
            <EventsList />
          </section>
        </div>

        {/* Sales Terminal Section */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <SalesTerminal />
          
          <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-3xl p-5 flex flex-col justify-center items-center text-center gap-2 mt-2">
            <span className="text-3xl">⚡</span>
            <p className="text-xs font-bold text-indigo-900 leading-relaxed">
              Inventory will be automatically updated in Supabase upon confirmation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

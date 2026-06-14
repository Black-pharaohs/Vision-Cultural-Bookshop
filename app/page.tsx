'use client';

import { BooksList } from '@/components/BooksList';
import { EventsList } from '@/components/EventsList';
import { SalesTerminal } from '@/components/SalesTerminal';
import { CurrencySelector } from '@/components/CurrencySelector';
import { FinancialReports } from '@/components/FinancialReports';
import { SystemStatus } from '@/components/SystemStatus';
import { RoleSelector } from '@/components/RoleSelector';
import { useAuth } from '@/app/auth-context';
import { UsersManagement } from '@/components/UsersManagement';
import Link from 'next/link';

export default function Home() {
  const { role, user } = useAuth();
  
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin' || role === 'owner';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Vision Books System
              </h1>
              <p className="text-[10px] text-indigo-600 font-medium tracking-widest uppercase">
                By Black Pharaohs Code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {!user && <RoleSelector />}
            <CurrencySelector />
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-sm font-semibold capitalize">{role}</span>
              <SystemStatus />
            </div>
            
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-sm">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            ) : (
              <Link href="/auth" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-colors whitespace-nowrap">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Admin & Owner Sections */}
          {isAdmin && (
            <>
              {/* Financial Reports Section */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
                </div>
                <FinancialReports />
              </section>

              {/* Users Management Section (Only visible to admin and owner) */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Users Management</h2>
                </div>
                <UsersManagement />
              </section>
            </>
          )}

          {/* Books Inventory Section */}
          <section className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {isAdmin ? 'Books Inventory' : 'Store Catalog'}
              </h2>
              {isAdmin && (
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                  Add Book +
                </button>
              )}
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

        {/* Sales Terminal Section / Cart for customers */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {isAdmin ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800">Terminal</h2>
              <SalesTerminal />
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center shadow-sm text-center">
                <p className="text-sm font-bold text-slate-500">
                  Customer cart is empty.
                  <br />
                  <span className="font-normal text-xs mt-2 block">Purchase system not fully available in preview.</span>
                </p>
              </div>
            </>
          )}
          
          <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-3xl p-5 flex flex-col justify-center items-center text-center gap-2 mt-2">
            <span className="text-3xl">⚡</span>
            <p className="text-xs font-bold text-indigo-900 leading-relaxed">
              {isAdmin 
                ? 'Inventory will be automatically updated in Supabase upon confirmation.' 
                : 'Enjoy our selections! Stay tuned for targeted campaigns.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

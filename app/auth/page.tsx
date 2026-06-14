import { AuthForm } from '@/components/AuthForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 pt-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
          <h1 className="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">
            Vision Books System
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8 font-medium">
            Sign in to access your portal.
          </p>
          <AuthForm />
        </div>
      </div>
    </main>
  );
}

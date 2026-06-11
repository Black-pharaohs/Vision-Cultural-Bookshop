'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, AlertCircle } from 'lucide-react';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  available_quantity: number;
}

export function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      // Mock Data if Supabase is not configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setBooks([
          { id: '1', title: 'The Pragmatic Programmer', author: 'David Thomas', price: 45.00, available_quantity: 10 },
          { id: '2', title: 'Clean Code', author: 'Robert C. Martin', price: 50.00, available_quantity: 5 },
          { id: '3', title: 'Atomic Habits', author: 'James Clear', price: 20.00, available_quantity: 15 }
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setBooks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <div className="text-sm text-neutral-500 animate-pulse bg-white p-6 rounded-xl border border-neutral-200">Loading inventory...</div>;
  if (error) return <div className="text-sm text-red-600 bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-slate-500 text-xs uppercase tracking-wider">
            <th className="p-4 font-semibold">Book ID</th>
            <th className="p-4 font-semibold">Title</th>
            <th className="p-4 font-semibold">Author</th>
            <th className="p-4 font-semibold text-center">Quantity</th>
            <th className="p-4 font-semibold text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {books.map((book, index) => (
            <tr key={book.id} className={index % 2 === 1 ? 'bg-indigo-50/30' : ''}>
              <td className="p-4 font-mono text-slate-400">#BK-{book.id.substring(0, 3)}</td>
              <td className="p-4 font-bold">{book.title}</td>
              <td className="p-4">{book.author}</td>
              <td className="p-4 text-center">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${book.available_quantity > 5 ? 'bg-green-100 text-green-700' : book.available_quantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {book.available_quantity} copies
                </span>
              </td>
              <td className="p-4 text-right font-bold">${book.price.toFixed(2)}</td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500">No books found in inventory.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

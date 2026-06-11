'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Book } from './BooksList';
import { useCurrency } from '@/app/currency-context';

export function SalesTerminal() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadBooks() {
      try {
        const { data } = await supabase.from('books').select('id, title, author, price, available_quantity').gt('available_quantity', 0);
        if (data) setBooks(data);
      } catch (err) {
        console.error('Failed to load books for terminal', err);
      }
    }
    loadBooks();
  }, [message]); // Reload books after a successful sale

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || quantity < 1) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: selectedBook, quantity }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Transaction failed');
      }

      setMessage({ type: 'success', text: `Sale successful! Total: ${formatPrice(data.sale.total_price)}` });
      setQuantity(1);
      setSelectedBook('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      // Auto clear message
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const currentBook = books.find(b => b.id === selectedBook);

  return (
    <form onSubmit={handleSale} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-6 shadow-md sticky top-8">
      <h3 className="font-bold text-lg border-b border-slate-100 pb-4">New Sales Invoice</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="book" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Book</label>
          <select
            id="book"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl appearance-none outline-none focus:ring-2 ring-indigo-200 font-medium"
            disabled={loading}
            required
          >
            <option value="" disabled>-- Select a book --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="quantity" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={currentBook?.available_quantity || 1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 ring-indigo-200 font-bold"
            disabled={loading || !selectedBook}
            required
          />
          {currentBook && (
            <p className="text-xs text-slate-500 mt-1">Available: {currentBook.available_quantity}</p>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-bold">{formatPrice(currentBook ? currentBook.price * quantity : 0)}</span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-slate-200 font-black text-indigo-700">
            <span>Total</span>
            <span>{formatPrice(currentBook ? currentBook.price * quantity : 0)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedBook}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Processing...' : 'Confirm Sale'}
        </button>

        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 mt-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            <span className="mt-0.5">{message.text}</span>
          </div>
        )}
      </div>
    </form>
  );
}

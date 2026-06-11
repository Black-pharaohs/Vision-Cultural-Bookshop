import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { error } = await supabase.from('books').select('id').limit(1);
    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

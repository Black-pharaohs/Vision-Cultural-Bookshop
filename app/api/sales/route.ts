import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { bookId, quantity } = await request.json();

    if (!bookId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a valid bookId and a quantity greater than 0.' },
        { status: 400 }
      );
    }

    // 1. Fetch current book details (price and available quantity)
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('price, available_quantity')
      .eq('id', bookId)
      .single();

    if (fetchError || !book) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }

    if (book.available_quantity < quantity) {
      return NextResponse.json(
        { error: 'Not enough books in stock.', available: book.available_quantity },
        { status: 400 }
      );
    }

    const totalPrice = book.price * quantity;

    // 2. Perform optimistic update of the inventory
    const { error: updateError } = await supabase
      .from('books')
      .update({ available_quantity: book.available_quantity - quantity })
      .eq('id', bookId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update inventory.' }, { status: 500 });
    }

    // 3. Record the sale
    const { data: sale, error: insertError } = await supabase
      .from('sales')
      .insert([
        {
          book_id: bookId,
          quantity_sold: quantity,
          total_price: totalPrice,
        },
      ])
      .select()
      .single();

    if (insertError) {
      // Note: In a production system, if the insert fails, we should rollback the inventory update.
      // A Postgres RPC function would be best to ensure atomicity. This is an MVP implementation.
      console.error('Failed to record sale after charging inventory:', insertError);
      return NextResponse.json({ error: 'Failed to record the sale.' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: 'Sale registered successfully.', sale },
      { status: 201 }
    );
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}

-- Vision Books System - Supabase (PostgreSQL) Schema (MVP)

-- 1. Books Table (إدارة المخزون)
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table (إدارة الفعاليات)
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sales Table (نظام المبيعات المبسط)
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE RESTRICT,
  quantity_sold INT NOT NULL CHECK (quantity_sold > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Future Expansion Notes (ملاحظات التوسعة المستقبلية):
-- 
-- Phase 2 (Dashboard & Reports): Add indexing on `sale_date` to speed up aggregations.
-- Phase 3 (Notifications): Extend `events` with `reminder_sent BOOLEAN DEFAULT FALSE` or create a new `attendees` table.
-- Phase 4 & 5 (Live Stream & Audience): Add `youtube_link VARCHAR`, `qrcode UUID` to `events`.
-- Related Sales: We can easily add `event_id UUID REFERENCES events(id)` to the `sales` table to track sales generated during specific events without rewriting existing columns.

-- Dummy Data for MVP Testing:
INSERT INTO books (title, author, price, available_quantity) VALUES 
('The Pragmatic Programmer', 'David Thomas', 45.00, 10),
('Clean Code', 'Robert C. Martin', 50.00, 5),
('Atomic Habits', 'James Clear', 20.00, 15);

INSERT INTO events (name, event_date, event_time) VALUES 
('Tech Talk: The Future of AI', '2026-07-01', '18:00:00'),
('Book Signing: Clean Code', '2026-07-15', '14:00:00');

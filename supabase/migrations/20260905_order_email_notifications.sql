-- ==========================================================
-- ORDER EMAIL NOTIFICATIONS TABLE & IDEMPOTENCY TRACKING
-- ==========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create order email notifications tracking table
CREATE TABLE IF NOT EXISTS order_email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  email_type TEXT NOT NULL, -- e.g. 'CUSTOMER_ORDER_CONFIRMATION', 'ADMIN_NEW_ORDER', 'CUSTOMER_ORDER_STATUS_CONFIRMED', etc.
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- 'SENT', 'FAILED', 'PENDING'
  provider_message_id TEXT,
  attempts INTEGER DEFAULT 1,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_order_email_notification UNIQUE (order_id, email_type, recipient)
);

-- Performance & Query Indexes
CREATE INDEX IF NOT EXISTS idx_order_email_notif_order_id ON order_email_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_order_email_notif_status ON order_email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_order_email_notif_type ON order_email_notifications(email_type);

-- Ensure orders.customer_email allows empty strings/null for optional customer emails
ALTER TABLE IF EXISTS orders ALTER COLUMN customer_email DROP NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE order_email_notifications ENABLE ROW LEVEL SECURITY;

-- Order email notifications policy
DROP POLICY IF EXISTS "Service role full access on order_email_notifications" ON order_email_notifications;
CREATE POLICY "Service role full access on order_email_notifications"
  ON order_email_notifications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure anon/public can select inserted orders for returning clauses
DROP POLICY IF EXISTS "Public can select orders" ON orders;
CREATE POLICY "Public can select orders"
  ON orders
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can select order items" ON order_items;
CREATE POLICY "Public can select order items"
  ON order_items
  FOR SELECT
  USING (true);


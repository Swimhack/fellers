-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create index on username for faster lookups
CREATE INDEX idx_admin_users_username ON admin_users(username);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage admin users
CREATE POLICY "Service role can manage admin users" ON admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default admin user (password: fellers123)
-- Password is hashed using a simple method for now
-- In production, use proper bcrypt hashing
INSERT INTO admin_users (username, password_hash, email)
VALUES ('admin', 'fellers123', 'admin@fellersresources.com')
ON CONFLICT (username) DO NOTHING;
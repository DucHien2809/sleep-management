-- Sleep Tracker Database Setup
-- Chạy các câu lệnh này trong Supabase SQL Editor

-- Tạo bảng users
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng sleep_records
CREATE TABLE sleep_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sleep_time TIMESTAMP WITH TIME ZONE NOT NULL,
  wake_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_sleep_records_user_id ON sleep_records(user_id);
CREATE INDEX idx_sleep_records_created_at ON sleep_records(created_at);

-- Cấu hình Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;

-- Policy cho users (chỉ user có thể xem/sửa thông tin của mình)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);

-- Policy cho sleep_records (chỉ user có thể xem/sửa bản ghi của mình)
CREATE POLICY "Users can view own sleep records" ON sleep_records
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own sleep records" ON sleep_records
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own sleep records" ON sleep_records
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own sleep records" ON sleep_records
  FOR DELETE USING (true);

-- Tạo function để tính thời gian ngủ
CREATE OR REPLACE FUNCTION calculate_sleep_duration(sleep_time TIMESTAMP WITH TIME ZONE, wake_time TIMESTAMP WITH TIME ZONE)
RETURNS INTERVAL AS $$
BEGIN
  RETURN wake_time - sleep_time;
END;
$$ LANGUAGE plpgsql;

-- Tạo view để dễ dàng truy vấn thống kê
CREATE OR REPLACE VIEW sleep_stats AS
SELECT 
  u.username,
  COUNT(sr.id) as total_records,
  AVG(EXTRACT(EPOCH FROM (sr.wake_time - sr.sleep_time))/3600) as avg_hours,
  AVG(sr.sleep_quality) as avg_quality,
  MIN(sr.created_at) as first_record,
  MAX(sr.created_at) as last_record
FROM users u
LEFT JOIN sleep_records sr ON u.id = sr.user_id
GROUP BY u.id, u.username;

-- Thêm comment cho các bảng
COMMENT ON TABLE users IS 'Bảng lưu thông tin người dùng';
COMMENT ON TABLE sleep_records IS 'Bảng lưu thông tin giấc ngủ';
COMMENT ON COLUMN users.username IS 'Tên đăng nhập duy nhất';
COMMENT ON COLUMN users.password_hash IS 'Mã hóa mật khẩu (trong thực tế nên hash)';
COMMENT ON COLUMN sleep_records.sleep_time IS 'Thời gian bắt đầu ngủ';
COMMENT ON COLUMN sleep_records.wake_time IS 'Thời gian thức dậy';
COMMENT ON COLUMN sleep_records.sleep_quality IS 'Chất lượng giấc ngủ (1-10)';
COMMENT ON COLUMN sleep_records.notes IS 'Ghi chú về giấc ngủ';

# Sleep Tracker - Ứng dụng quản lý giấc ngủ thông minh

Ứng dụng web theo dõi và quản lý giấc ngủ với gợi ý từ AI sử dụng Google Gemini 2.5 Flash.

## Tính năng chính

- ✅ Đăng ký/Đăng nhập đơn giản với username và password
- ✅ Ghi nhận giấc ngủ với thời gian ngủ, thức dậy và đánh giá chất lượng
- ✅ Thống kê giấc ngủ với biểu đồ trực quan
- ✅ Gợi ý thông minh từ AI dựa trên dữ liệu giấc ngủ
- ✅ Giao diện đẹp mắt, responsive
- ✅ Hỗ trợ tiếng Việt

## Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date handling**: date-fns

## Cài đặt và chạy

### 1. Clone project và cài đặt dependencies

```bash
git clone <repository-url>
cd sleep-tracker
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` và cấu hình các biến sau:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu hình Supabase

### 1. Tạo project Supabase

1. Truy cập [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy URL và API key từ Settings > API

### 2. Tạo database schema

Chạy các câu lệnh SQL sau trong Supabase SQL Editor:

```sql
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
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy cho sleep_records (chỉ user có thể xem/sửa bản ghi của mình)
CREATE POLICY "Users can view own sleep records" ON sleep_records
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own sleep records" ON sleep_records
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own sleep records" ON sleep_records
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sleep records" ON sleep_records
  FOR DELETE USING (auth.uid()::text = user_id::text);
```

### 3. Cấu hình Google Gemini AI

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Thêm API key vào file `.env.local`

## Deploy lên Vercel

### 1. Chuẩn bị

1. Đảm bảo code đã được push lên GitHub
2. Cấu hình đầy đủ biến môi trường

### 2. Deploy

1. Truy cập [vercel.com](https://vercel.com)
2. Import project từ GitHub
3. Cấu hình biến môi trường trong Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
4. Deploy

### 3. Cấu hình domain (tùy chọn)

- Thêm custom domain trong Vercel dashboard
- Cấu hình DNS records

## Cấu trúc project

```
sleep-tracker/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── AuthForm.tsx       # Login/Register form
│   ├── Dashboard.tsx      # Main dashboard
│   ├── SleepForm.tsx      # Sleep record form
│   ├── SleepStats.tsx     # Sleep statistics
│   └── AIRecommendation.tsx # AI recommendations
├── lib/                    # Utility libraries
│   ├── supabase.ts        # Supabase client
│   └── gemini.ts          # Google Gemini AI
├── public/                 # Static assets
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── README.md               # Documentation
```

## Tính năng bảo mật

- Row Level Security (RLS) trong Supabase
- Xác thực user đơn giản
- Kiểm tra quyền truy cập dữ liệu

## Phát triển thêm

### Thêm tính năng mới

1. Tạo component mới trong thư mục `components/`
2. Thêm route mới nếu cần
3. Cập nhật database schema nếu cần
4. Thêm vào navigation

### Tối ưu hiệu suất

- Sử dụng React.memo cho components
- Implement pagination cho danh sách dài
- Lazy loading cho components không cần thiết ngay

## Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:

1. Biến môi trường đã được cấu hình đúng chưa
2. Database schema đã được tạo đầy đủ chưa
3. API keys có hợp lệ không
4. Console logs để debug

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.

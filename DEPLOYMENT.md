# Hướng dẫn Deploy Sleep Tracker lên Vercel

## Bước 1: Chuẩn bị Supabase

### 1.1 Tạo project Supabase

1. Truy cập [supabase.com](https://supabase.com) và đăng nhập
2. Click "New Project"
3. Chọn organization và đặt tên project (ví dụ: "sleep-tracker")
4. Chọn database password (lưu lại để dùng sau)
5. Chọn region gần nhất với bạn
6. Click "Create new project"
7. Đợi project được tạo (có thể mất vài phút)

### 1.2 Lấy thông tin kết nối

1. Trong project dashboard, vào **Settings** > **API**
2. Copy **Project URL** và **anon public** key
3. Lưu lại để dùng trong bước tiếp theo

### 1.3 Tạo database schema

1. Vào **SQL Editor** trong sidebar
2. Copy toàn bộ nội dung file `supabase-setup.sql`
3. Paste vào editor và click **Run**
4. Kiểm tra xem có lỗi gì không

## Bước 2: Chuẩn bị Google Gemini AI

### 2.1 Tạo API key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng Google account
3. Click "Create API key"
4. Copy API key và lưu lại

### 2.2 Kiểm tra API key

API key sẽ có dạng: `AIzaSyC...` (khoảng 39 ký tự)

## Bước 3: Chuẩn bị code

### 3.1 Push code lên GitHub

```bash
# Khởi tạo git repository
git init
git add .
git commit -m "Initial commit: Sleep Tracker app"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/username/sleep-tracker.git
git branch -M main
git push -u origin main
```

### 3.2 Tạo file .env.local (chỉ để test local)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

## Bước 4: Deploy lên Vercel

### 4.1 Tạo project trên Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub account
3. Click "New Project"
4. Import repository "sleep-tracker" từ GitHub
5. Click "Import"

### 4.2 Cấu hình project

1. **Project Name**: `sleep-tracker` (hoặc tên bạn muốn)
2. **Framework Preset**: Next.js (sẽ tự động detect)
3. **Root Directory**: `./` (để nguyên)
4. **Build Command**: `npm run build` (mặc định)
5. **Output Directory**: `.next` (mặc định)
6. **Install Command**: `npm install` (mặc định)

### 4.3 Cấu hình biến môi trường

Trước khi deploy, click **Environment Variables** và thêm:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
NEXT_PUBLIC_GEMINI_API_KEY = your-gemini-api-key-here
```

**Lưu ý**: Không cần thêm dấu `=` trong Vercel, chỉ cần paste giá trị vào ô tương ứng.

### 4.4 Deploy

1. Click **Deploy**
2. Đợi quá trình build và deploy hoàn tất
3. Vercel sẽ cung cấp URL để truy cập ứng dụng

## Bước 5: Kiểm tra và test

### 5.1 Test ứng dụng

1. Truy cập URL được cung cấp bởi Vercel
2. Tạo tài khoản mới
3. Ghi nhận một vài giấc ngủ
4. Test tính năng AI recommendation

### 5.2 Kiểm tra logs

Nếu có lỗi, kiểm tra:
- **Vercel Function Logs**: Trong Vercel dashboard
- **Browser Console**: F12 trong trình duyệt
- **Supabase Logs**: Trong Supabase dashboard

## Bước 6: Cấu hình domain (tùy chọn)

### 6.1 Custom domain

1. Trong Vercel dashboard, vào **Settings** > **Domains**
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn của Vercel

### 6.2 SSL certificate

Vercel sẽ tự động cấu hình SSL cho domain của bạn.

## Troubleshooting

### Lỗi thường gặp

#### 1. Build failed
- Kiểm tra syntax trong code
- Đảm bảo tất cả dependencies đã được cài đặt
- Kiểm tra TypeScript errors

#### 2. Environment variables not found
- Đảm bảo đã thêm đúng trong Vercel
- Kiểm tra tên biến có đúng không
- Redeploy sau khi thêm biến môi trường

#### 3. Supabase connection error
- Kiểm tra URL và API key
- Đảm bảo database schema đã được tạo
- Kiểm tra RLS policies

#### 4. Gemini AI error
- Kiểm tra API key có hợp lệ không
- Kiểm tra quota và billing
- Test API key trực tiếp

### Debug tips

1. **Local testing**: Luôn test local trước khi deploy
2. **Console logs**: Sử dụng `console.log` để debug
3. **Environment check**: Log ra các biến môi trường để kiểm tra
4. **Step by step**: Test từng tính năng một

## Monitoring và Maintenance

### 1. Vercel Analytics
- Bật Vercel Analytics để theo dõi performance
- Monitor error rates và user behavior

### 2. Supabase Monitoring
- Kiểm tra database performance
- Monitor API usage và limits

### 3. Regular updates
- Cập nhật dependencies định kỳ
- Kiểm tra security updates
- Backup database quan trọng

## Cost estimation

### Vercel
- **Hobby Plan**: Miễn phí (100GB bandwidth/tháng)
- **Pro Plan**: $20/tháng (1TB bandwidth/tháng)

### Supabase
- **Free Tier**: Miễn phí (500MB database, 50MB bandwidth)
- **Pro Plan**: $25/tháng (8GB database, 250GB bandwidth)

### Google Gemini
- **Free Tier**: Miễn phí (15 requests/phút)
- **Paid**: $0.0005/1K characters input, $0.0015/1K characters output

## Support

Nếu gặp vấn đề:
1. Kiểm tra documentation của từng service
2. Sử dụng community forums
3. Contact support của service tương ứng
4. Tạo issue trên GitHub repository

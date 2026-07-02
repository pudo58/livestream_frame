# Hướng dẫn deploy overlay

URL sau khi deploy: **https://pudo58.github.io/livestream_frame/**

## Lỗi thường gặp: Actions không chạy (billing)

Nếu workflow báo:

> *The job was not started because your account is locked due to a billing issue.*

Đây **không phải lỗi code** — tài khoản GitHub bị khóa do vấn đề thanh toán / hết quota Actions.

### Cách 1 — Sửa billing (để dùng lại Actions)

1. Vào https://github.com/settings/billing
2. Kiểm tra thẻ thanh toán, hạn mức spending, hoặc gói GitHub
3. Sau khi xử lý xong, vào **Actions** → chọn workflow **Deploy static content to Pages** → **Re-run all jobs**

### Cách 2 — Deploy từ branch (không cần Actions, miễn phí)

1. Vào repo → **Settings** → **Pages**
2. **Build and deployment** → Source: chọn **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Save — GitHub sẽ tự publish mỗi lần push lên `main`

File `.nojekyll` trong repo giúp GitHub serve file tĩnh đúng cách (không qua Jekyll).

## Dùng overlay trong OBS

1. Mở URL Pages trong trình duyệt để kiểm tra
2. OBS → **Sources** → **Browser**
3. URL: `https://pudo58.github.io/livestream_frame/`
4. Width: **1920**, Height: **1080**

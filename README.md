# Game-Deal

เว็บดูเกมลดราคาบน Steam แบบโหลดข้อมูลสดและโหลดเพิ่มตอนเลื่อนหน้า

## โครงสร้าง

```text
.                      front-end (static, GitHub Pages เสิร์ฟจาก root)
├── index.html
├── steamdeal.css
├── steamdeal.js
├── steamdeal.config.js
└── backend/           back-end
    ├── cloudflare-worker.js
    └── server.js
```

## เปิดบนเครื่อง

```powershell
node backend/server.js
```

แล้วเปิด:

```text
http://localhost:5173
```

`server.js` เสิร์ฟทั้งไฟล์ static (จาก root) และ API `/api/steam-deals` สำหรับดึง Steam สดในเครื่อง

## เอาขึ้น GitHub Pages

GitHub Pages เปิดได้เฉพาะไฟล์ static จึงรัน `server.js` ไม่ได้โดยตรง ถ้าต้องการดึง Steam สด ให้ deploy `backend/cloudflare-worker.js` เป็น Cloudflare Worker ก่อน แล้วเอา URL มาใส่ใน `steamdeal.config.js`

```js
window.STEAMDEAL_API_BASE = 'https://your-worker-name.your-account.workers.dev';
```

จากนั้น push ขึ้น GitHub แล้วเปิด Pages จาก Settings > Pages > Deploy from a branch > เลือก branch และ root folder (front-end อยู่ที่ root จึงไม่ต้องตั้งค่าโฟลเดอร์เพิ่ม)

ถ้าไม่ใส่ Worker URL หน้าเว็บยังเปิดได้ แต่ข้อมูลสดจาก Steam จะใช้ไม่ได้บน GitHub Pages เพราะติด CORS

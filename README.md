# Game-Deal

เว็บรวมดีลเกม โหลดข้อมูลสดและโหลดเพิ่มตอนเลื่อนหน้า เริ่มจาก Steam และออกแบบให้เพิ่ม source อื่น (สโตร์เกมเจ้าอื่น, ข่าวสาร) ได้ในอนาคต

## โครงสร้าง

```text
.
├── index.html              redirect ไป Home.html (GitHub Pages ต้องมี index.html ที่ root)
├── Home.html               app shell
├── config.js               ค่า config รวม (URL ของ API แต่ละ source)
├── steam/                  front-end ส่วน Steam
│   ├── deals.js
│   └── deals.css
└── backend/
    ├── server.js           dev server: เสิร์ฟ static + route /api/*
    └── steam/              back-end ส่วน Steam
        ├── worker.js       Cloudflare Worker (โปรดักชัน)
        └── deals.js        โมดูลดึง Steam สำหรับ dev server
```

เพิ่ม source ใหม่ในอนาคต (เช่น ข่าว) ทำเป็นโฟลเดอร์คู่ขนาน:

```text
news/news.js + news/news.css         front-end
backend/news/worker.js + news.js     back-end + route /api/news ใน server.js
```

## เปิดบนเครื่อง

```powershell
node backend/server.js
```

แล้วเปิด `http://localhost:5173` — server เสิร์ฟไฟล์ static (จาก root) และ API `/api/steam-deals`

## เอาขึ้น GitHub Pages

front-end อยู่ที่ root จึงไม่ต้องตั้งค่าโฟลเดอร์เพิ่ม — Settings > Pages > Deploy from a branch > เลือก branch + root

ข้อมูลสดต้อง deploy `backend/steam/worker.js` เป็น Cloudflare Worker แล้วใส่ URL ใน `config.js`

```js
window.STEAMDEAL_API_BASE = 'https://your-worker-name.your-account.workers.dev';
```

ถ้าไม่ใส่ Worker URL หน้าเว็บยังเปิดได้ แต่ข้อมูลสดจาก Steam จะใช้ไม่ได้บน GitHub Pages เพราะติด CORS

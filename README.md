# Game-Deal

เว็บรวมดีลเกม โหลดข้อมูลสดและโหลดเพิ่มตอนเลื่อนหน้า เริ่มจาก Steam และออกแบบให้เพิ่ม source อื่น (สโตร์เกมเจ้าอื่น, ข่าวสาร) ได้ในอนาคต

## โครงสร้าง

```text
.
├── index.html              redirect ไป Home.html (GitHub Pages ต้องมี index.html ที่ root)
├── Home.html               app shell + แถบสลับ store
├── config.js               registry ของ store ที่รองรับ (steam, epic, ...)
├── app/
│   ├── main.js             core: state, render, infinite scroll, ตัวสลับ store, tabs, wishlist, theme, search
│   └── app.css             สไตล์รวม
├── sources/                ตัวเชื่อมต่อแต่ละแหล่งข้อมูล (interface เดียวกัน)
│   ├── steam.js            ดึงจาก Steam worker
│   └── cheapshark.js       ดึงจาก CheapShark (ใช้ได้ทุก store ผ่าน storeID)
└── backend/
    ├── server.js           dev server: เสิร์ฟ static + route /api/steam-deals
    └── steam/
        ├── worker.js       Cloudflare Worker ของ Steam (โปรดักชัน)
        └── deals.js        โมดูลดึง Steam สำหรับ dev server
```

แต่ละ store เป็น source อิสระ — ข้อมูลไม่ปนกัน Steam ใช้ worker เดิม, ร้านอื่น (Epic ฯลฯ) ดึงจาก CheapShark ตรงจาก browser (CORS เปิด ไม่ต้องมี worker)

เพิ่ม store ใหม่: เติม 1 บรรทัดใน `config.js` (เช่น GOG `storeID:7`, Humble `11`, Fanatical `15`) — ใช้ adapter `cheapshark` ที่มีอยู่ ไม่ต้องเขียนโค้ดเพิ่ม

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

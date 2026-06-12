# SteamDeal

เว็บดูเกมลดราคาบน Steam แบบโหลดข้อมูลสดและโหลดเพิ่มตอนเลื่อนหน้า

## เปิดบนเครื่อง

```powershell
node server.js
```

แล้วเปิด:

```text
http://localhost:5173
```

## เอาขึ้น GitHub Pages

GitHub Pages เปิดได้เฉพาะไฟล์ static เช่น HTML/CSS/JS จึงรัน `server.js` ไม่ได้โดยตรง ถ้าต้องการดึง Steam สด ให้ deploy `cloudflare-worker.js` เป็น Cloudflare Worker ก่อน แล้วเอา URL มาใส่ใน `steamdeal.config.js`

```js
window.STEAMDEAL_API_BASE = 'https://your-worker-name.your-account.workers.dev';
```

จากนั้น push ไฟล์ขึ้น GitHub แล้วเปิด Pages จาก Settings > Pages > Deploy from a branch > เลือก branch และ root folder

ถ้าไม่ใส่ Worker URL หน้าเว็บยังเปิดได้ แต่ข้อมูลสดจาก Steam จะใช้ไม่ได้บน GitHub Pages เพราะติด CORS/browser security

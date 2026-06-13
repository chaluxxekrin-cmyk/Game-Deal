const I18N_DICT = {
  en: {
    search_ph: 'Search games...', filter: 'Filters', refresh: 'Refresh', search_btn: 'Search',
    budget_label: 'Budget', discount: 'Discount', disc_all: 'All discounts', disc_50: '50%+ off', disc_70: '70%+ off', disc_90: '90%+ off',
    genre_label: 'Genre', genre_all: 'All', sort_label: 'Sort by',
    sort_disc: 'Biggest discount', sort_pasc: 'Lowest price', sort_pdesc: 'Highest price', sort_name: 'Name A–Z', sort_rev: 'Best reviews',
    stat_total: 'On sale', stat_max: 'Max discount', stat_avg: 'Avg discount', stat_free: 'Free games',
    budget_q: 'What can this budget buy?', budget_ph: 'Enter budget e.g. 500', budget_find: 'Find',
    tab_sale: 'On Sale', tab_free: 'Free', tab_dlc: 'DLC', tab_wish: 'Wishlist',
    title_sale: 'Deals right now', title_free: 'Free right now', title_dlc: 'DLC on sale', title_wish: 'Your Wishlist',
    loading: 'Loading...', empty: 'No games match', cant_connect: "Can't connect — try refresh", items: 'items',
    wish_add: 'Added to Wishlist', wish_remove: 'Removed from Wishlist',
    enter_budget: 'Enter a budget first', buy_count: 'Can buy {n} in this budget',
    budget_none: 'No items within {b}', budget_head: 'Budget {b} buys {n} items · suggested:', budget_tot: 'Total {t} · left {r}',
    ago_s: '{n}s ago', ago_m: '{n}m ago', ago_h: '{n}h ago', updated: 'Updated {t}',
  },
  th: {
    search_ph: 'ค้นหาเกม...', filter: 'ตัวกรอง', refresh: 'รีเฟรช', search_btn: 'ค้นหา',
    budget_label: 'งบที่มี', discount: 'ส่วนลด', disc_all: 'ทุกส่วนลด', disc_50: 'ลดเกิน 50%', disc_70: 'ลดเกิน 70%', disc_90: 'ลดเกิน 90%',
    genre_label: 'ประเภท', genre_all: 'ทั้งหมด', sort_label: 'เรียงตาม',
    sort_disc: 'ส่วนลดมากสุด', sort_pasc: 'ราคาถูกสุด', sort_pdesc: 'ราคาแพงสุด', sort_name: 'ชื่อ A–Z', sort_rev: 'รีวิวดีสุด',
    stat_total: 'เกมลดราคา', stat_max: 'ลดสูงสุด', stat_avg: 'ลดเฉลี่ย', stat_free: 'เกมฟรี',
    budget_q: 'งบเท่านี้ซื้ออะไรได้บ้าง?', budget_ph: 'กรอกงบ เช่น 500', budget_find: 'หาเกม',
    tab_sale: 'เกมลดราคา', tab_free: 'เกมฟรี', tab_dlc: 'DLC', tab_wish: 'Wishlist',
    title_sale: 'เกมลดราคาตอนนี้', title_free: 'เกมแจกฟรีตอนนี้', title_dlc: 'DLC ลดราคา', title_wish: 'Wishlist ของคุณ',
    loading: 'กำลังโหลด...', empty: 'ไม่พบเกมที่ตรงเงื่อนไข', cant_connect: 'เชื่อมต่อไม่ได้ — ลองรีเฟรช', items: 'รายการ',
    wish_add: 'เพิ่มใน Wishlist', wish_remove: 'ลบออกจาก Wishlist',
    enter_budget: 'กรอกงบก่อนนะ', buy_count: 'ซื้อได้ {n} รายการในงบนี้',
    budget_none: 'ไม่พบรายการในงบ {b}', budget_head: 'งบ {b} ซื้อได้ {n} รายการ · แนะนำชุดนี้:', budget_tot: 'รวม {t} · เหลือ {r}',
    ago_s: '{n}s ที่แล้ว', ago_m: '{n} นาทีที่แล้ว', ago_h: '{n} ชม. ที่แล้ว', updated: 'อัปเดต {t}',
  },
  zh: {
    search_ph: '搜索游戏...', filter: '筛选', refresh: '刷新', search_btn: '搜索',
    budget_label: '预算', discount: '折扣', disc_all: '全部折扣', disc_50: '50%以上', disc_70: '70%以上', disc_90: '90%以上',
    genre_label: '类型', genre_all: '全部', sort_label: '排序',
    sort_disc: '折扣最多', sort_pasc: '价格最低', sort_pdesc: '价格最高', sort_name: '名称 A–Z', sort_rev: '好评最高',
    stat_total: '特价游戏', stat_max: '最高折扣', stat_avg: '平均折扣', stat_free: '免费游戏',
    budget_q: '这点预算能买什么？', budget_ph: '输入预算 例如 500', budget_find: '查找',
    tab_sale: '特价', tab_free: '免费', tab_dlc: 'DLC', tab_wish: '心愿单',
    title_sale: '当前特价', title_free: '当前免费', title_dlc: 'DLC 特价', title_wish: '你的心愿单',
    loading: '加载中...', empty: '没有符合的游戏', cant_connect: '无法连接 — 请刷新', items: '项',
    wish_add: '已加入心愿单', wish_remove: '已移出心愿单',
    enter_budget: '请先输入预算', buy_count: '此预算可买 {n} 项',
    budget_none: '{b} 内没有项目', budget_head: '预算 {b} 可买 {n} 项 · 推荐：', budget_tot: '合计 {t} · 剩 {r}',
    ago_s: '{n}秒前', ago_m: '{n}分钟前', ago_h: '{n}小时前', updated: '更新于 {t}',
  },
};

let I18N_LANG = localStorage.getItem('lang') || 'en';

function t(key, vars) {
  let s = (I18N_DICT[I18N_LANG] && I18N_DICT[I18N_LANG][key]) || I18N_DICT.en[key] || key;
  if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
  return s;
}

function applyStaticLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
}

function getLang() { return I18N_LANG; }

function setLang(lang) {
  if (!I18N_DICT[lang]) return;
  I18N_LANG = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  applyStaticLang();
  if (typeof window.onLangChange === 'function') window.onLangChange();
}

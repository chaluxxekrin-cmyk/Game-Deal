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
    budget_showing: 'Showing games within {b}',
    ago_s: '{n}s ago', ago_m: '{n}m ago', ago_h: '{n}h ago', updated: 'Updated {t}',
    nav_deals: 'Deals', nav_news: 'News', news_soon: 'News coming soon',
    view_store: 'View on store', price_hist: 'Price history', p_normal: 'Normal', p_now: 'Now', p_low: 'Lowest', all_time_low: 'All-time low',
    n_all: 'All', n_today: 'Today', n_10d: 'Last 10 days', n_month: 'This month', news_search_ph: 'Search news...',
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
    budget_showing: 'แสดงเกมในงบ {b}',
    ago_s: '{n}s ที่แล้ว', ago_m: '{n} นาทีที่แล้ว', ago_h: '{n} ชม. ที่แล้ว', updated: 'อัปเดต {t}',
    nav_deals: 'ดีลเกม', nav_news: 'ข่าวสาร', news_soon: 'ข่าวสารเร็วๆ นี้',
    view_store: 'ดูที่ร้านค้า', price_hist: 'ประวัติราคา', p_normal: 'ราคาปกติ', p_now: 'ตอนนี้', p_low: 'ต่ำสุด', all_time_low: 'ต่ำสุดตลอดกาล',
    n_all: 'ทั้งหมด', n_today: 'วันนี้', n_10d: '10 วันล่าสุด', n_month: 'เดือนนี้', news_search_ph: 'ค้นหาข่าว...',
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
    budget_showing: '显示 {b} 以内的游戏',
    ago_s: '{n}秒前', ago_m: '{n}分钟前', ago_h: '{n}小时前', updated: '更新于 {t}',
    nav_deals: '优惠', nav_news: '新闻', news_soon: '新闻即将推出',
    view_store: '前往商店', price_hist: '价格历史', p_normal: '原价', p_now: '现价', p_low: '最低', all_time_low: '历史最低',
    n_all: '全部', n_today: '今天', n_10d: '近10天', n_month: '本月', news_search_ph: '搜索新闻...',
  },
  ko: {
    search_ph: '게임 검색...', filter: '필터', refresh: '새로고침', search_btn: '검색',
    budget_label: '예산', discount: '할인', disc_all: '모든 할인', disc_50: '50% 이상', disc_70: '70% 이상', disc_90: '90% 이상',
    genre_label: '장르', genre_all: '전체', sort_label: '정렬',
    sort_disc: '할인율 높은순', sort_pasc: '가격 낮은순', sort_pdesc: '가격 높은순', sort_name: '이름 A–Z', sort_rev: '평점 높은순',
    stat_total: '할인 게임', stat_max: '최대 할인', stat_avg: '평균 할인', stat_free: '무료 게임',
    budget_q: '이 예산으로 뭘 살 수 있나요?', budget_ph: '예산 입력 예: 500', budget_find: '찾기',
    tab_sale: '할인', tab_free: '무료', tab_dlc: 'DLC', tab_wish: '위시리스트',
    title_sale: '지금 할인 중', title_free: '지금 무료', title_dlc: 'DLC 할인', title_wish: '내 위시리스트',
    loading: '불러오는 중...', empty: '조건에 맞는 게임 없음', cant_connect: '연결 실패 — 새로고침하세요', items: '개',
    wish_add: '위시리스트에 추가됨', wish_remove: '위시리스트에서 제거됨',
    enter_budget: '예산을 먼저 입력하세요', buy_count: '이 예산으로 {n}개 구매 가능',
    budget_none: '{b} 이내 게임 없음', budget_head: '예산 {b}로 {n}개 구매 · 추천:', budget_tot: '합계 {t} · 남음 {r}',
    budget_showing: '{b} 이내 게임 표시',
    ago_s: '{n}초 전', ago_m: '{n}분 전', ago_h: '{n}시간 전', updated: '업데이트 {t}',
    nav_deals: '딜', nav_news: '뉴스', news_soon: '뉴스 준비 중',
    view_store: '상점에서 보기', price_hist: '가격 기록', p_normal: '정가', p_now: '현재', p_low: '최저', all_time_low: '역대 최저가',
    n_all: '전체', n_today: '오늘', n_10d: '최근 10일', n_month: '이번 달', news_search_ph: '뉴스 검색...',
  },
  ms: {
    search_ph: 'Cari permainan...', filter: 'Penapis', refresh: 'Muat semula', search_btn: 'Cari',
    budget_label: 'Bajet', discount: 'Diskaun', disc_all: 'Semua diskaun', disc_50: 'Diskaun 50%+', disc_70: 'Diskaun 70%+', disc_90: 'Diskaun 90%+',
    genre_label: 'Genre', genre_all: 'Semua', sort_label: 'Susun ikut',
    sort_disc: 'Diskaun terbesar', sort_pasc: 'Harga terendah', sort_pdesc: 'Harga tertinggi', sort_name: 'Nama A–Z', sort_rev: 'Ulasan terbaik',
    stat_total: 'Sedang diskaun', stat_max: 'Diskaun maks', stat_avg: 'Diskaun purata', stat_free: 'Permainan percuma',
    budget_q: 'Bajet ini boleh beli apa?', budget_ph: 'Masukkan bajet cth 500', budget_find: 'Cari',
    tab_sale: 'Diskaun', tab_free: 'Percuma', tab_dlc: 'DLC', tab_wish: 'Senarai Hajat',
    title_sale: 'Tawaran sekarang', title_free: 'Percuma sekarang', title_dlc: 'DLC diskaun', title_wish: 'Senarai Hajat Anda',
    loading: 'Memuatkan...', empty: 'Tiada permainan sepadan', cant_connect: 'Gagal sambung — cuba muat semula', items: 'item',
    wish_add: 'Ditambah ke Senarai Hajat', wish_remove: 'Dialih dari Senarai Hajat',
    enter_budget: 'Masukkan bajet dahulu', buy_count: 'Boleh beli {n} dalam bajet ini',
    budget_none: 'Tiada item dalam {b}', budget_head: 'Bajet {b} beli {n} item · cadangan:', budget_tot: 'Jumlah {t} · baki {r}',
    budget_showing: 'Menunjukkan permainan dalam {b}',
    ago_s: '{n}s lalu', ago_m: '{n}m lalu', ago_h: '{n}j lalu', updated: 'Dikemas kini {t}',
    nav_deals: 'Tawaran', nav_news: 'Berita', news_soon: 'Berita akan datang',
    view_store: 'Lihat di kedai', price_hist: 'Sejarah harga', p_normal: 'Biasa', p_now: 'Kini', p_low: 'Terendah', all_time_low: 'Terendah sepanjang masa',
    n_all: 'Semua', n_today: 'Hari ini', n_10d: '10 hari lepas', n_month: 'Bulan ini', news_search_ph: 'Cari berita...',
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

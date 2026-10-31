window.CK_VERSION = '20261031071527';
// Shared helpers for all Cloud Kitchen sites (Firebase Realtime Database version)
const FB = window.CK_FIREBASE || {};
const CONFIGURED = !!(FB.apiKey && FB.databaseURL && !/PASTE-/.test(FB.apiKey + FB.appId));
// Each site (customer / waiter / admin) keeps its OWN login, even on the same phone and web address
const SITE = window.CK_SITE || 'site';
const app = CONFIGURED ? firebase.initializeApp(FB, 'ck-' + SITE) : null;
const auth = CONFIGURED ? app.auth() : null;
const db = CONFIGURED ? app.database() : null;
const TS = () => firebase.database.ServerValue.TIMESTAMP;

// ---------- Line icons (instead of emoji) ----------
const ICONS = {
  logo: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  table: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v1M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  userPlus: '<circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 13.3-6M19 14v6M22 17h-6"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M1 21a8 8 0 0 1 16 0M16 4.13a4 4 0 0 1 0 7.75M23 21a8 8 0 0 0-5-7.4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21h.01M17 21h4v-4"/>',
  settings: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  call: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
};
const ic = (name, size = 18) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let CURRENCY = 'Rs.';
const money = n => `${CURRENCY} ${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const timeAgo = t => {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + ' min ago';
  if (s < 86400) return Math.floor(s / 3600) + ' h ago';
  return new Date(t).toLocaleDateString();
};
// "3" → "Table 3", "Takeaway" → "Takeaway"
const place = t => /^\d+$/.test(String(t)) ? 'Table ' + t : String(t);
// Search: every typed word must be the start of a word ("mom" finds "Momo", "tea" doesn't find "Steam")
const matches = (q, ...fields) => {
  const words = fields.join(' ').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return String(q).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean).every(w => words.some(x => x.startsWith(w)));
};
// Short order code shown to people, e.g. "#K3QZ" (from the random end of the order id)
const orderCode = id => '#' + String(id).slice(-4).toUpperCase().replace(/[^A-Z0-9]/g, 'X');

function friendly(err) {
  const code = (err && err.code) || '';
  const m = (err && err.message) || String(err || 'Something went wrong');
  if (/invalid-credential|wrong-password|user-not-found|invalid-login-credentials|invalid-email/.test(code)) return 'Wrong username or password';
  if (/too-many-requests/.test(code)) return 'Too many tries. Please wait a few minutes and try again.';
  if (/email-already-in-use/.test(code)) return 'That username is already taken';
  if (/weak-password/.test(code)) return 'Password must be at least 6 characters';
  if (/network-request-failed/.test(code) || /Failed to fetch|NetworkError/i.test(m)) return 'No connection. Check the internet and try again.';
  if (/operation-not-supported|web-storage-unsupported/.test(code) || location.protocol === 'file:') return 'This page was opened as a file. Logins only work when the site is opened from a web address (GitHub Pages / Netlify). See README.';
  if (/operation-not-allowed/.test(code)) return 'Email/Password sign-in is turned off. In Firebase → Authentication → Sign-in method, enable "Email/Password" (see README).';
  if (/requires-recent-login/.test(code)) return 'Please log out and log in again, then try once more.';
  if (/PERMISSION_DENIED/i.test(code + m)) return 'Not allowed. (If this is a new setup, check that the database rules from database.rules.json are published.)';
  return m.replace(/^Firebase: /, '');
}

// Arrays of records from a snapshot object {id: {...}}
const listOf = obj => Object.entries(obj || {}).map(([id, v]) => ({ id, ...v }));
const normOrder = o => {
  const items = (Array.isArray(o.items) ? o.items : Object.values(o.items || {})).filter(Boolean)
    .map(l => ({ ...l, price: Number(l.price) || 0, qty: Number(l.qty) || 0 }));
  return {
    ...o,
    table: o.table || '?',
    items,
    itemsTotal: items.reduce((s, l) => s + l.price * l.qty, 0),
    deliveryFee: Number(o.deliveryFee) || 0,
    total: items.reduce((s, l) => s + l.price * l.qty, 0) + (Number(o.deliveryFee) || 0),
    createdAt: Number(o.createdAt) || Date.now(),
    updatedAt: Number(o.updatedAt) || Number(o.createdAt) || Date.now(),
    createdBy: o.createdBy || '',
    createdByName: o.createdByName || '',
    handledBy: o.handledBy || '',
    note: o.note || '',
    status: o.status || 'new',
    source: o.source || 'qr',
    code: orderCode(o.id),
  };
};
const validOrder = o => o && typeof o.table === 'string' && o.items && o.status;

// ---------- Price options (e.g. "6 pcs" Rs. 420 / "10 pcs" Rs. 700) ----------
// menu/$id/options = { o1: {label, price}, o2: ... }. Cart keys: "id" or "id~o1".
const optsOf = it => Object.entries((it && it.options) || {})
  .map(([k, v]) => ({ k, label: String((v && v.label) || ''), price: Number(v && v.price) || 0 }))
  .sort((a, b) => a.price - b.price || a.k.localeCompare(b.k));
const cartKey = (id, k) => k ? id + '~' + k : id;
// what a cart key points to right now (null if the dish or option is gone)
function cartPick(items, key) {
  const [id, k] = String(key).split('~');
  const it = items.find(i => i.id === id); if (!it) return null;
  const os = optsOf(it);
  if (!k) return os.length ? null : { key, id, it, opt: '', size: '', name: it.name, price: it.price };
  const o = os.find(x => x.k === k);
  return o ? { key, id, it, opt: k, size: o.label, name: it.name, price: o.price } : null;
}
const cartLines = (items, cart) => Object.entries(cart).map(([key, n]) => { const p = cartPick(items, key); return p && { ...p, n }; }).filter(Boolean);
const orderLine = (p, qty) => p.opt ? { id: p.id, name: p.name, opt: p.opt, size: p.size, price: p.price, qty } : { id: p.id, name: p.name, price: p.price, qty };
const lineName = l => l.size ? `${l.name} (${l.size})` : l.name;
const waStart = n => String(n || '').replace(/[^0-9]/g, '');

const DEFAULT_SETTINGS = { cafeName: 'Cloud Kitchen', currency: 'Rs.', tagline: 'Scan, order, relax.', customerUrl: '' };
async function loadSettings() {
  // never wait forever: after 8 s carry on with the defaults
  const s = (await Promise.race([
    db.ref('settings').once('value').then(x => x.val()),
    new Promise(r => setTimeout(() => r(null), 8000)),
  ])) || {};
  const settings = { ...DEFAULT_SETTINGS, ...s };
  CURRENCY = settings.currency || 'Rs.';
  return settings;
}

// ---------- Food photos ----------
// Menu items with a photo have  photo: <version>. The picture itself is in  photos/<itemId>.
// Phones keep downloaded photos, so they're only downloaded again when the admin changes them.
const photoMem = {};
const photoImg = (it, cls = '') => it.photo
  ? `<img class="${cls}" data-photo="${esc(it.id)}" data-v="${Number(it.photo)}" alt="" style="background:#f1e9e1">`
  : it.image ? `<img class="${cls}" src="${esc(it.image)}" alt="" loading="lazy" onerror="this.remove()">` : '';
async function fillPhotos(root = document) {
  for (const img of root.querySelectorAll('img[data-photo]:not([src])')) {
    const id = img.dataset.photo, v = img.dataset.v, key = 'ck_photo_' + id;
    let data = photoMem[id + v];
    if (!data) { try { const c = JSON.parse(localStorage.getItem(key) || 'null'); if (c && String(c.v) === v) data = c.d; } catch {} }
    if (!data) {
      try { data = (await db.ref('photos/' + id).once('value')).val(); } catch {}
      if (data) { try { localStorage.setItem(key, JSON.stringify({ v, d: data })); } catch { /* phone storage full: fine */ } }
    }
    if (data) { photoMem[id + v] = data; img.src = data; } else img.remove();
  }
}
// Example photos (free Unsplash photos) shown on the customer sites until the admin uploads a real photo.
const STOCK_URL = (id, w = 640) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&q=72&auto=format&fit=crop`;
const STOCK = [
  [/jhol|soup|thukpa/i, ['1647999019630-dabe1a837693']],
  [/momo|dumpling|dim ?sum/i, ['1534422298391-e4f8c172dddb', '1694923450868-b432a8ee52aa', '1783699373851-7dc900256c25', '1647999019630-dabe1a837693']],
  [/chow ?m[ei]i?n|noodle|chowmin/i, ['1585032226651-759b368d7246', '1634864572865-1cf8ff8bd23d']],
  [/fries|french fry|chips/i, ['1630384060421-cb20d0e0649d', '1541592106381-b31e9677c0e5']],
  [/cold coffee|iced? coffee|frappe|cold brew/i, ['1461023058943-07fcbe16d735', '1517701550927-30cf4ba1dba5']],
  [/coffee|latte|cappuccino|espresso|americano/i, ['1611312410928-bdcb480e6239']],
  [/\btea\b|chiya|chai/i, ['1619581073186-5b4ae1b0caad', '1561336526-2914f13ceb36']],
  [/lime|lemon|soda|mojito/i, ['1507281549113-040fcfef650e', '1523677011781-c91d1bbe2f9e']],
  [/lassi|smoothie|mango|shake/i, ['1623065422902-30a2d299bbe4']],
  [/rice|thali|dal|bhat|khana/i, ['1588644525273-f37b60d78512']],
];
function stockPhoto(it, w) {
  const t = `${it.name || ''} ${it.category || ''}`;
  const m = STOCK.find(([re]) => re.test(it.name || '')) || STOCK.find(([re]) => re.test(t));
  if (!m) return '';
  const ids = m[1]; let h = 0; for (const ch of String(it.name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return STOCK_URL(ids[h % ids.length], w);
}
// Real uploaded photo if there is one, otherwise an example photo (or nothing)
const dishImg = (it, cls = '', w) => (it.photo || it.image) ? photoImg(it, cls)
  : (stockPhoto(it, w) ? `<img class="${cls}" src="${stockPhoto(it, w)}" alt="" loading="lazy" onerror="this.remove()">` : '');

// Turn a picked photo into a small square JPEG (about 20–40 KB)
async function compressPhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not read that photo. Please use a JPG or PNG image.')); i.src = url; });
    const S = 360, c = document.createElement('canvas'); c.width = c.height = S;
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, S, S);
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, S, S);
    let q = 0.78, data = c.toDataURL('image/jpeg', q);
    while (data.length > 60000 && q > 0.4) { q -= 0.1; data = c.toDataURL('image/jpeg', q); }
    return data;
  } finally { URL.revokeObjectURL(url); }
}

function toast(msg, cls = '', ms = 3500) {
  let box = $('#toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast ' + cls; t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

// "ding-ding" alert sound (no sound file needed)
let audioCtx;
// ---------- Phone pop-up notifications ----------
// Android (and home-screen apps) only allow pop-ups through a service worker; plain `new Notification` fails there.
let swReg = null;
function setupNotify() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('sw.js').then(r => { swReg = r; }).catch(() => {});
}
const notifyOn = () => 'Notification' in window && Notification.permission === 'granted';
async function askNotify() {
  if (!('Notification' in window)) return 'unsupported';
  try { return await Notification.requestPermission(); } catch { return Notification.permission; }
}
async function notify(title, body, tag) {
  if (!notifyOn()) return;
  const opts = { body: body || '', tag: tag || title, renotify: true, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: [250, 120, 250, 120, 250], requireInteraction: true };
  try {
    const r = swReg || (navigator.serviceWorker && await navigator.serviceWorker.getRegistration());
    if (r) { await r.showNotification(title, opts); return; }
  } catch {}
  try { new Notification(title, opts); } catch {}
}
// Free phone alert through the ntfy app (works even when the website is closed)
function ntfySend(topic, title, body) {
  if (!topic || !/^[A-Za-z0-9_-]{1,64}$/.test(topic)) return;
  fetch(`https://ntfy.sh/${encodeURIComponent(topic)}?title=${encodeURIComponent(title)}&priority=high&tags=bell`, { method: 'POST', body: body || title, mode: 'no-cors', keepalive: true }).catch(() => {});
}

function ding() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    [0, 0.22].forEach((delay, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = i ? 1175 : 880;
      const t = audioCtx.currentTime + delay;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.55);
    });
  } catch {}
}
function unlockAudio() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch {} }

function openModal(html, onMount) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="card modal">${html}</div>`;
  bg.addEventListener('mousedown', e => { if (e.target === bg) bg.remove(); });
  document.body.appendChild(bg);
  const close = () => bg.remove();
  onMount && onMount($('.modal', bg), close);
  return close;
}

function showSetupNeeded(root) {
  root.innerHTML = `<div class="login-wrap"><div class="card login">
    <div class="logo">${ic('settings', 34)}</div><h1>Almost ready</h1>
    <p class="muted">Open <b>config.js</b> in this site's folder and paste your Firebase settings (<b>apiKey</b>, <b>appId</b>, <b>databaseURL</b>). Then upload the site again.</p>
  </div></div>`;
}

// ---------- Staff logins (waiter + admin sites) ----------
const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;
const cleanUsername = u => String(u || '').trim().toLowerCase();
const newStaffEmail = u => `${cleanUsername(u)}.${Math.random().toString(36).slice(2, 7)}@${window.CK_STAFF_EMAIL_DOMAIN || 'staff.cloudkitchen.app'}`;
const waitForAuth = () => new Promise(res => { const off = auth.onAuthStateChanged(u => { off(); res(u); }); });

// Logged-in staff record (or null)
async function currentStaff(roles) {
  const user = auth.currentUser || await waitForAuth();
  if (!user) return null;
  try {
    const me = (await db.ref('staff/' + user.uid).once('value')).val();
    if (!me || !me.active || !roles.includes(me.role)) return null;
    return { uid: user.uid, ...me };
  } catch { return null; }
}

function renderLogin(root, { title, roles, onSuccess }) {
  root.innerHTML = `
  <div class="login-wrap"><form class="card login" autocomplete="on">
    <div class="logo"><img src="data:image/png;base64,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" alt="Cloud Kitchen" width="84" height="84"></div>
    <h1>${esc(title)}</h1>
    <p class="muted">Sign in to continue</p>
    <div class="field"><label>Username</label><input type="text" name="username" required autocomplete="username" autocapitalize="none"></div>
    <div class="field"><label>Password</label><input type="password" name="password" required autocomplete="current-password"></div>
    <div class="error"></div>
    <button class="btn block">Sign in</button>
  </form></div>`;
  const f = $('form', root);
  f.onsubmit = async e => {
    e.preventDefault(); unlockAudio();
    const btn = $('button.btn', f), err = $('.error', f);
    btn.disabled = true; err.textContent = '';
    try {
      const u = cleanUsername(f.username.value);
      const rec = USERNAME_RE.test(u) ? (await db.ref('usernames/' + u).once('value')).val() : null;
      if (!rec) throw Object.assign(new Error(), { code: 'auth/invalid-credential' });
      await auth.signInWithEmailAndPassword(rec.email, f.password.value);
      const me = await currentStaff(roles);
      if (!me) {
        await auth.signOut();
        throw new Error(roles.includes('waiter') ? 'This account is disabled or not a staff account' : 'This account is not an admin');
      }
      onSuccess(me);
    } catch (ex) { err.textContent = friendly(ex); btn.disabled = false; }
  };
  f.username.focus();
}
async function logout() { await auth.signOut(); location.reload(); }

// ---------- Loading screen ----------
function hideSplash() {
  const s = document.getElementById('splash');
  if (!s || s.classList.contains('out')) return;
  s.classList.add('out'); setTimeout(() => s.remove(), 400);
}
(function watchSplash() {
  const app = document.getElementById('app');
  if (!app) return;
  if (app.children.length) return hideSplash();
  new MutationObserver((m, obs) => { if (app.children.length) { hideSplash(); obs.disconnect(); } }).observe(app, { childList: true });
  setTimeout(() => {
    const s = document.getElementById('splash');
    if (!s || s.classList.contains('out') || s.querySelector('.err')) return;
    s.innerHTML = `<img src="data:image/png;base64,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" alt="" width="80" height="80" onerror="this.remove()"><div class="err"><b>This is taking longer than usual</b>Check your internet connection. If it keeps happening, the database address in config.js or the Firebase rules may need checking.</div><button onclick="location.reload()">Try again</button>`;
  }, 15000);
})();

// Shared helpers for all Cloud Kitchen sites (Firebase Realtime Database version)
const FB = window.CK_FIREBASE || {};
const CONFIGURED = !!(FB.apiKey && FB.databaseURL && !/PASTE-/.test(FB.apiKey + FB.appId));
const app = CONFIGURED ? firebase.initializeApp(FB) : null;
const auth = CONFIGURED ? firebase.auth() : null;
const db = CONFIGURED ? firebase.database() : null;
const TS = () => firebase.database.ServerValue.TIMESTAMP;

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
    total: items.reduce((s, l) => s + l.price * l.qty, 0),
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

const DEFAULT_SETTINGS = { cafeName: 'Cloud Kitchen', currency: 'Rs.', tagline: 'Scan, order, relax.', customerUrl: '' };
async function loadSettings() {
  const s = (await db.ref('settings').once('value')).val() || {};
  const settings = { ...DEFAULT_SETTINGS, ...s };
  CURRENCY = settings.currency || 'Rs.';
  return settings;
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
    <div class="logo">⚙️</div><h1>Almost ready</h1>
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
    <div class="logo">☁️</div>
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

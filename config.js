// =============================================================
//  Cloud Kitchen: Firebase settings (put the SAME values in all 3 sites)
//
//  Where to find them: Firebase console → ⚙️ Project settings → General →
//  "Your apps" → Web app (</>) → "SDK setup and configuration" → Config.
//  Copy the values from there into the matching lines below.
// =============================================================
window.CK_FIREBASE = {
  apiKey: 'PASTE-YOUR-apiKey',
  authDomain: 'cloudkitchen-9c3b8.firebaseapp.com',
  // Check this one in your Firebase config. If your database is outside the US
  // it looks like https://cloudkitchen-9c3b8-default-rtdb.asia-southeast1.firebasedatabase.app
  databaseURL: 'https://cloudkitchen-9c3b8-default-rtdb.firebaseio.com',
  projectId: 'cloudkitchen-9c3b8',
  appId: 'PASTE-YOUR-appId',
};

// Staff usernames become logins like  ramesh.x7k2@staff.cloudkitchen.app
// (no emails are ever sent). Keep this the SAME in the waiter and admin sites.
window.CK_STAFF_EMAIL_DOMAIN = 'staff.cloudkitchen.app';

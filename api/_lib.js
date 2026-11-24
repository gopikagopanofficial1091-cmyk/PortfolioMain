const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PERIOD_MS = 14 * 24 * 60 * 60 * 1000; // a code stays valid for at least 14 days (current + previous period)
const CODE_DIGITS = 8;

const FILES = {
  resume: { path: 'private/Resume.pdf', name: 'Gopika-Gopan-Resume.pdf', type: 'application/pdf', label: 'Résumé', mode: 'instant' },
  studio: { path: 'private/Export_Connect_Post_Studio.html', name: 'Export_Connect_Post_Studio.html', type: 'text/html; charset=utf-8', label: 'Export Connect Post Studio', mode: 'code' }
};

const envOk = () => !!(process.env.OTP_SECRET && process.env.RESEND_API_KEY && process.env.OWNER_EMAIL);

// ---- codes: derived from (secret, file, email, period). Nothing is stored; changing OTP_SECRET revokes every code. ----
const mac = (data) => crypto.createHmac('sha256', process.env.OTP_SECRET).update(data).digest();
const currentPeriod = () => Math.floor(Date.now() / PERIOD_MS);
function codeFor(file, email, period) {
  const n = mac(`code|${file}|${email}|${period}`).readUInt32BE(0) % 10 ** CODE_DIGITS;
  return String(n).padStart(CODE_DIGITS, '0');
}
function safeEq(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function codeValid(file, email, code) {
  const p = currentPeriod();
  return [p, p - 1].map((x) => safeEq(codeFor(file, email, x), code)).some(Boolean);
}

// ---- input cleaning ----
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const clip = (v, n) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, n);

// ---- best-effort rate limit (memory is per serverless instance; add a Vercel Firewall rate-limit rule for a hard cap) ----
const hits = new Map();
function allow(key, windowMs, max) {
  const now = Date.now(), list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) { hits.set(key, list); return false; }
  list.push(now); hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return true;
}
const ipOf = (req) => String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

// ---- email to me (Resend) ----
async function sendMail({ subject, text, replyTo }) {
  const body = { from: process.env.MAIL_FROM || 'Portfolio <onboarding@resend.dev>', to: [process.env.OWNER_EMAIL], subject, text };
  if (replyTo) body.reply_to = replyTo;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('mail ' + r.status);
}

// ---- lead log: appends one CSV row to a file in a (private) GitHub repo ----
const csvCell = (v) => {
  let s = String(v == null ? '' : v);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
  return '"' + s.replace(/"/g, '""') + '"';
};
async function saveLead(row) {
  const repo = process.env.LEADS_REPO, token = process.env.GITHUB_TOKEN;
  if (!repo || !token) return false;
  const branch = process.env.LEADS_BRANCH || 'main', file = process.env.LEADS_FILE || 'leads.csv';
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURI(file)}`;
  const headers = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-leads', 'Content-Type': 'application/json' };
  const header = 'time_sydney,file,name,email,organisation,purpose,country,city\n';
  const line = row.map(csvCell).join(',') + '\n';
  for (let i = 0; i < 3; i++) {
    let sha, text = header;
    const g = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, { headers });
    if (g.status === 200) { const j = await g.json(); sha = j.sha; text = Buffer.from(j.content, 'base64').toString('utf8'); }
    else if (g.status !== 404) throw new Error('github get ' + g.status);
    if (text && !text.endsWith('\n')) text += '\n';
    const body = { message: 'Add request', content: Buffer.from(text + line).toString('base64'), branch };
    if (sha) body.sha = sha;
    const p = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (p.ok) return true;
    if (p.status !== 409 && p.status !== 422) throw new Error('github put ' + p.status); // 409/422 = someone wrote at the same moment: retry
  }
  throw new Error('github conflict');
}

function sendFile(res, spec) {
  const buf = fs.readFileSync(path.join(process.cwd(), spec.path));
  res.setHeader('Content-Type', spec.type);
  res.setHeader('Content-Disposition', `attachment; filename="${spec.name}"`);
  return res.status(200).send(buf);
}

module.exports = { FILES, envOk, currentPeriod, codeFor, codeValid, EMAIL, clip, allow, ipOf, sendMail, saveLead, sendFile };

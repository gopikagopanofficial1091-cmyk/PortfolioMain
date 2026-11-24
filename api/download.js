// Unlocks a code-protected file for the email + code I sent back to the visitor.
const { FILES, envOk, codeValid, EMAIL, clip, allow, ipOf, sendFile } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!envOk()) return res.status(500).json({ error: 'This is not set up yet. Please email me directly.' });

  const b = req.body || {};
  const spec = FILES[b.file];
  if (!spec || spec.mode !== 'code') return res.status(400).json({ error: 'Unknown file.' });
  const email = clip(b.email, 254).toLowerCase(), code = String(b.code || '').replace(/\D/g, '');
  if (!EMAIL.test(email) || !code) return res.status(400).json({ error: 'Please enter your email and code.' });
  if (!allow('try:' + ipOf(req), 10 * 60 * 1000, 10)) return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  if (!codeValid(b.file, email, code)) return res.status(403).json({ error: 'That email and code do not match. Please check both.' });

  try { return sendFile(res, spec); }
  catch (e) { return res.status(500).json({ error: 'The file is unavailable right now. Please email me.' }); }
};

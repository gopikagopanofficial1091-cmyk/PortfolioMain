// Request form for a protected file.
//   résumé (instant): saves the lead, emails me a heads-up, returns the PDF straight away.
//   studio (code):    saves the lead, emails me the details + the visitor's personal code; I reply to release it.
const { FILES, envOk, currentPeriod, codeFor, EMAIL, clip, allow, ipOf, sendMail, saveLead, sendFile } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!envOk()) return res.status(500).json({ error: 'This form is not set up yet. Please email me directly.' });

  const b = req.body || {};
  const spec = FILES[b.file];
  if (!spec) return res.status(400).json({ error: 'Unknown file.' });
  if (b.website) return res.status(200).json({ ok: true }); // honeypot field: real people never fill it

  const name = clip(b.name, 100), email = clip(b.email, 254).toLowerCase();
  const org = clip(b.org, 200), purpose = clip(b.purpose, 500);
  if (!name || !EMAIL.test(email)) return res.status(400).json({ error: 'Please enter your name and a valid email address.' });
  if (!allow('req:' + ipOf(req), 10 * 60 * 1000, 5)) return res.status(429).json({ error: 'Too many requests. Please try again in a few minutes.' });

  const when = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
  let city = ''; try { city = decodeURIComponent(req.headers['x-vercel-ip-city'] || ''); } catch (e) { /* ignore */ }
  const country = req.headers['x-vercel-ip-country'] || '';
  const details = `Name: ${name}\nEmail: ${email}\nOrganisation: ${org || '-'}\nNote: ${purpose || '-'}\nTime: ${when} (Sydney)\nApprox. location: ${city || '-'}, ${country || '-'}`;

  let subject, text;
  if (spec.mode === 'code') {
    const code = codeFor(req.body.file, email, currentPeriod());
    subject = `Access request: ${spec.label}`;
    text = `${name} has asked for "${spec.label}".\n\n${details}\n\n` +
           `Their personal code: ${code}\n(Works only with ${email}, valid for at least 14 days.)\n\n` +
           `To approve: reply to this email and paste the code. To decline: ignore this email.`;
  } else {
    subject = `${spec.label} downloaded by ${name}`;
    text = `${name} just downloaded your ${spec.label}.\n\n${details}\n\nReply to this email to reach them.`;
  }

  const [mail, lead] = await Promise.allSettled([
    sendMail({ subject, text, replyTo: email }),
    saveLead([when, b.file, name, email, org, purpose, country, city],
      spec.mode === 'code' ? (process.env.LEADS_FILE_STUDIO || 'studio-requests.csv') : undefined) // studio requests go to their own CSV
  ]);
  if (lead.status === 'rejected') console.error('lead save failed:', lead.reason && lead.reason.message);
  if (mail.status === 'rejected') console.error('mail failed:', mail.reason && mail.reason.message);

  if (spec.mode === 'code') {
    if (mail.status === 'rejected') return res.status(502).json({ error: 'I could not send your request. Please email me directly.' });
    return res.status(200).json({ ok: true });
  }
  try { return sendFile(res, spec); }
  catch (e) { console.error('file read failed:', e.message); return res.status(500).json({ error: 'The file is unavailable right now. Please email me.' }); }
};

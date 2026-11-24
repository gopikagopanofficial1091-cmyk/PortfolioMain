**PortfolioMain**

Consultant portfolio (static site, deployed on Vercel).
All content lives in data.js.
Cross-links: roles / work / under fields on work, capabilities and toolkit.
Websites page: fill websites: [] (thumbnail is automatic, or add images/site-<id>-1.jpg).
Photos: images/profile-1.jpg (hero), images/hero-accent-1.jpg (small hero box, optional).

TEDx is now a role (id role-tedx): images/role-tedx-1.jpg, -2, -3 ...
Website thumbnails: auto screenshot, or add images/site-<id>-1.jpg (e.g. site-export-dashboard-1.jpg) to override.

PROTECTED DOWNLOADS (Résumé + Export Connect Post Studio)
Files live in /private (blocked from the public web by vercel.json); they are only released by the functions in /api.
- Résumé: visitor gives name + email, file downloads instantly.
- Studio: visitor gives name + email, I get an email (Reply-To = visitor) with their personal code, I reply with it, they unlock.
  Codes are tied to the visitor's email, valid 14+ days, and need no database. Changing OTP_SECRET revokes every code.
- Every request is appended to leads.csv in the private leads repo.
Vercel -> Settings -> Environment Variables (Production), then redeploy:
  OTP_SECRET      long random string
  RESEND_API_KEY  from resend.com
  OWNER_EMAIL     the email that receives requests
  GITHUB_TOKEN    fine-grained token, Contents: read/write on the leads repo only
  LEADS_REPO      e.g. yourname/portfolio-leads   (optional: LEADS_BRANCH=main, LEADS_FILE=leads.csv)
Never keep copies of Resume.pdf or Export_Connect_Post_Studio.html outside /private.

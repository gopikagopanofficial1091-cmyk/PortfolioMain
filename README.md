**PortfolioMain**

Consultant portfolio (static site, deployed on Vercel).
All content lives in data.js.
Cross-links: roles / work / under fields on work, capabilities and toolkit.
Projects & tools (websites included): each item in work: [] can have url (live link), protect (request-only download), cta, thumb and thumbFit.
Thumbnail order: thumb (file in /images or https URL) -> images/<id>-1 -> automatic screenshot of url -> title tile.
Photos: images/profile-1.jpg (hero), images/hero-accent-1.jpg (small hero box, optional).

To override a thumbnail, set thumb: "your-file.png" in data.js, or add images/<id>-1.jpg (e.g. images/proj-quibate-1.jpg).

PROTECTED DOWNLOADS (Résumé + Export Connect Post Studio)
Files live in /private (blocked from the public web by vercel.json); they are only released by the functions in /api.
- Résumé: visitor gives name + email, file downloads instantly.
- Studio: visitor gives name + email, I get an email (Reply-To = visitor) with their personal code, I reply with it, they unlock.
  Codes are tied to the visitor's email, valid 14+ days, and need no database. Changing OTP_SECRET revokes every code.
- Every request is logged in the private leads repo: résumé requests in leads.csv, studio requests in studio-requests.csv.
Vercel -> Settings -> Environment Variables (Production), then redeploy:
  OTP_SECRET      long random string
  RESEND_API_KEY  from resend.com
  OWNER_EMAIL     the email that receives requests
  GITHUB_TOKEN    fine-grained token, Contents: read/write on the leads repo only
  LEADS_REPO      e.g. yourname/portfolio-leads   (optional: LEADS_BRANCH=main, LEADS_FILE=leads.csv)
Never keep copies of Resume.pdf or Export_Connect_Post_Studio.html outside /private.

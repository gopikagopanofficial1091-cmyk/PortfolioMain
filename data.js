/* ============================================================
   EDIT ME — all text content lives here.

   IMAGES: put files in the /images folder of the repo and name them
   after the item's "id":   <id>-1.jpg, <id>-2.jpg, <id>-3.jpg ...
   Add as many (or as few, or none) as you like. Numbers must be
   consecutive (1, 2, 3 ...): the site stops at the first missing one.
   Use lowercase extensions. Allowed: see imageExts below.

   Examples
     images/role-180dc-1.jpg  images/role-180dc-2.png
     images/tool-capred-1.webp
     images/proj-tedx-1.jpg … images/proj-tedx-6.jpg
     images/profile-1.jpg     (hero portrait)
     images/hero-accent-1.jpg (small hero photo)
   ============================================================ */
window.SITE_DATA = {
  email: "gopikagopan.1091@gmail.com",
  linkedin: "https://www.linkedin.com/in/gopikagopan1091",
  resume: "",                                           // <- link/path to your PDF (optional)

  hero: { now: ["Currently", "Graduate", "M. Business Analytics, UTS"] },  // text in the small home-page box (shown until images/hero-accent-1.jpg exists)

  imageDir: "images/",
  imageExts: ["jpg", "jpeg", "png", "webp", "svg", "gif", "avif"],
  imageMax: 12, // most images the site will look for per item

  roles: [
    { id: "role-180dc", color: "#f7c948", dates: "Jun 2025 – Present", short: "180DC", title: "Vice President, Operations", org: "180 Degrees Consulting, UTS",
      tags: ["Process design", "KPIs", "Leadership"],
      points: ["Redesigned end-to-end workflows across a 20+ member consulting club, cutting analyst ramp-up time.",
               "Built a competency-based evaluation framework tied to organisational KPIs.",
               "Set strategic priorities and delivery benchmarks with senior leadership."],
      skills: ["Process design", "KPIs", "Stakeholder management", "People analytics"] },
    { id: "role-wizoona", color: "#b79be0", dates: "May 2024 – Mar 2025", short: "Wizoona", title: "President & Co-Founder", org: "Wizoona · Community startup",
      tags: ["Founding", "Partnerships", "Scaling"],
      points: ["Scaled a non-profit to 60+ members across two streams within one month.",
               "Secured partnerships with two premier Indian universities in Year 1.",
               "Shipped a website and standardised onboarding for seamless leadership transitions."],
      skills: ["Founding", "Partnerships", "Community building", "Onboarding design"] },
    { id: "role-foruppo", color: "#f6a56b", dates: "Dec 2023 – Nov 2024", short: "Foruppo", title: "Project Management Intern → Cohort Lead", org: "Foruppo",
      tags: ["Agile", "MVPs", "Team culture"],
      points: ["Delivered multiple product MVPs in 2-week Agile sprints.",
               "Promoted twice in three months to lead team processes, culture and workflows."],
      skills: ["Agile / sprints", "Product MVPs", "Team leadership"] },
    { id: "role-notetaking", color: "#f7c948", dates: "Feb 2026 – Present", short: "UTS Notetaking", title: "Notetaking Assistant", org: "UTS Accessibility Support Program",
      tags: ["Accessibility", "Clarity"],
      points: ["Produces clear, accessible course notes for three students, matched to individual learning needs."],
      skills: ["Accessibility", "Structured writing", "Reliability"] },
    { id: "role-revertech", color: "#b79be0", dates: "Sep – Dec 2021", short: "Revertech", title: "Marketing Intern", org: "Revertech IT Solutions",
      tags: ["Campaigns", "Digital marketing"],
      points: ["Helped plan and run 5+ digital campaigns in a 20-member team, driving 20+ enrolments."],
      skills: ["Digital campaigns", "Teamwork", "Content"] }
  ],

  /* Tools and independent projects, merged. kind: "Tool" or "Project" (drives the filter). */
  work: [
    { id: "tool-linkedin", kind: "Tool", tag: "Web app", title: "LinkedIn Content Generator",
      desc: "Generates Export Connect LinkedIn posts with live research, a voice picker and carousel slide-count control, paired with a Canva carousel template.",
      stack: ["Web app", "Live research", "Canva"],
      roles: [], under: ["Export Connect"] },
    { id: "tool-export-potential", kind: "Tool", tag: "Excel model", title: "Export Potential Predictor",
      desc: "In-Excel scorecard ranking crop and market combinations, modelled on the ITC Export Potential Map.",
      stack: ["Excel", "Scoring model", "Market analysis"],
      roles: [], under: ["Export Connect"] },
    { id: "tool-capred", kind: "Tool", tag: "Market research", title: "Specialty Importers Long List",
      desc: "Long list and shortlist of specialty Asian importers and distributors in Australia for the CAPRED project (Cambodia Australia Partnership for Resilient Economic Development).",
      stack: ["Desk research", "Shortlisting", "Exporter outreach"],
      roles: [], under: ["Export Connect", "CAPRED"] },
    { id: "tool-finance-session", kind: "Tool", tag: "Enablement", title: "Understanding Export Finances",
      desc: "Webinar for exporters on cash flow, working capital and financial readiness, grounded in Austrade guidance.",
      stack: ["Facilitation", "Export finance"],
      roles: [], under: ["Export Connect"] },
    { id: "tool-evaluation", kind: "Tool", tag: "Framework", title: "Competency-Based Evaluation Framework",
      desc: "Evaluation system for 180 Degrees Consulting UTS aligned to club KPIs, enabling data-driven talent decisions.",
      stack: ["KPIs", "Process design", "People analytics"],
      roles: ["role-180dc"], under: [] },
    { id: "proj-tedx", kind: "Project", tag: "2022 – 2023", title: "TEDxGECRIT — Inaugural Event",
      desc: "Led the institution's first TEDx-licensed event: a 70-member volunteer team, 100+ attendees, 90%+ satisfaction, with full planning frameworks, run sheets and post-event reporting.",
      stack: ["Event leadership", "Documentation", "Volunteer management"],
      roles: [], under: ["BTech, RIT"] },
    { id: "proj-debate", kind: "Project", tag: "2023 – 2024", title: "Debate-Practice Platform",
      desc: "Led design and build across three products: an AI chatbot (Botpress), a topic resource library (WordPress) and a speaker transcript archive (Framer).",
      stack: ["Botpress", "WordPress", "Framer"],
      roles: [], under: ["BTech, RIT"] },
    { id: "proj-career-crafter", kind: "Project", tag: "Jan – Feb 2024", title: "Career Crafter",
      desc: "Co-built and launched a minimalist digital product site on Product Hunt with a 10-member team, learning positioning and launch strategy.",
      stack: ["Framer", "Product Hunt", "Launch strategy"],
      roles: ["role-foruppo"], under: [] },
    { id: "proj-plant-pals", kind: "Project", tag: "2023 – 2025", title: "Plant Pals — PM Capstone",
      desc: "End-to-end project documentation: Project Charter, OKRs, SMART goals and Work Breakdown Structure for Google's accredited PM programme.",
      stack: ["Charter", "OKRs", "WBS"],
      roles: [], under: ["Google PM Certificate"] }
  ],

  /* LINKS: roles = ids from "roles" above, work = ids from "work" above,
     under = plain-text labels for sources that are not a role (a degree, a certificate...). */
  capabilities: [
    { t: "Structured problem-solving", d: "Ambiguous briefs turned into scoped, testable deliverables.", roles: ["role-180dc", "role-foruppo"], work: ["tool-capred"] },
    { t: "Data-driven decisions", d: "Evidence-led recommendations built on analytics tooling.", roles: ["role-180dc"], work: ["tool-export-potential", "tool-evaluation"] },
    { t: "Process design", d: "Workflows and onboarding that scale and survive hand-overs.", roles: ["role-180dc", "role-wizoona"], work: ["tool-evaluation"] },
    { t: "Stakeholder engagement", d: "Senior leadership, universities and cross-functional teams.", roles: ["role-180dc", "role-wizoona"], work: ["tool-finance-session"] },
    { t: "Agile delivery", d: "Sprints, charters, OKRs and WBS; Google PM certified.", roles: ["role-foruppo"], work: ["proj-plant-pals", "proj-career-crafter"] },
    { t: "Change & risk", d: "Leadership transitions, team scaling and run-sheet discipline.", roles: ["role-wizoona"], work: ["proj-tedx"] }
  ],
  toolkit: [
    { t: "Python", under: ["MBAn, UTS"] },
    { t: "SQL", under: ["MBAn, UTS"] },
    { t: "Power BI", under: ["MBAn, UTS"] },
    { t: "Tableau", under: ["MBAn, UTS"] },
    { t: "Excel (Advanced / Pivot)", work: ["tool-export-potential"], under: ["MBAn, UTS"] },
    { t: "Google Suite", roles: ["role-foruppo"], under: ["Google PM Certificate"] },
    { t: "Microsoft Office", roles: ["role-180dc"] },
    { t: "AI tools & agents", work: ["tool-linkedin", "proj-debate"] }
  ],

  /* WEBSITES (shown as a page only when this list is not empty).
     Thumbnail = automatic screenshot of the url, or drop images/site-<id>-1.jpg to override.
     Example:
     { id: "site-wizoona", title: "Wizoona", url: "https://...", desc: "Community website I shipped as co-founder.",
       roles: ["role-wizoona"], work: [], tags: ["Website", "Community"] } */
  websites: [],


  education: [
    { t: "Master of Business Analytics", s: "University of Technology Sydney", d: "Feb 2025 – Dec 2026", n: "GPA 6.0 / 7.0 · Business Analytics, Data-Driven Decision Making, Strategic Management" },
    { t: "BTech, Computer Science Engineering", s: "Rajiv Gandhi Institute of Technology, India", d: "Oct 2020 – Jun 2024", n: "GPA 7.86 / 10 · First Class" }
  ],
  certs: [
    ["Agile Project Management", "Google", "95.50%"],
    ["Project Planning: Putting It All Together", "Google", "99.00%"],
    ["Project Execution: Running the Project", "Google", "96.48%"],
    ["Project Initiation: Starting a Successful Project", "Google", "99.45%"],
    ["Foundations of Project Management", "Google", "91.53%"],
    ["WIL to Work Program 2025", "UTS Careers", ""]
  ]
};

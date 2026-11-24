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
  resume: "Resume.pdf",                                           // <- link/path to your PDF (optional)

  hero: { now: ["Seeking", "Graduate Consultant", "M. Business Analytics, UTS"] },  // text in the small home-page box (shown until images/hero-accent-1.jpg exists)

  imageDir: "images/",
  imageExts: ["jpg", "jpeg", "png", "webp", "svg", "gif", "avif"],
  imageMax: 12, // most images the site will look for per item

  roles: [
    { id: "role-export-connect", color: "#ee7c34", dates: "Aug 2026 – Nov 2026", short: "Export Connect", title: "Project Intern", org: "Export Connect · Agri-food export consultancy",
      tags: ["Market analysis", "Looker Studio", "Scorecards"],
      points: ["Ranked export markets for a national horticulture strategy: validated trade data and built a weighted scorecard with rating rules and confidence scores across 192 crop–market combinations (16 crops, 15 markets), giving a transparent, repeatable ranking colleagues could verify and update.",
               "Turned the scorecard into a Looker Studio dashboard and plain-language briefing slides for a high-level meeting of 5 stakeholder representatives and company executives, showing where to focus and why.",
               "Analysed ~5 grower and exporter interviews and 5–10 adjacent-category case studies, managing priorities with MoSCoW, to add primary and secondary evidence and shape the dashboard's focus on market access and feasibility."],
      skills: ["Market analysis", "Scoring models", "Looker Studio", "Stakeholder briefing", "Prioritisation (MoSCoW)"] },
    { id: "role-180dc", color: "#f7c948", dates: "Jun 2025 – Present", short: "180DC", title: "Vice President", org: "180 Degrees Consulting, UTS",
      tags: ["Process design", "KPIs", "Leadership"],
      points: ["Diagnosed structural inefficiencies across a 20+ member consulting club and redesigned end-to-end workflows, reducing analyst ramp-up time and improving project team readiness across concurrent client engagements.",
               "Developed and implemented a competency-based evaluation framework aligned to organisational KPIs, enabling data-driven talent decisions and measurable performance improvements across cross-functional teams.",
               "Collaborated with senior leadership to define strategic priorities, establish performance benchmarks and track delivery outcomes against measurable operational metrics."],
      skills: ["Process design", "KPIs", "Stakeholder management", "People analytics"] },
    { id: "role-wizoona", color: "#b79be0", dates: "May 2024 – Mar 2025", short: "Wizoona", title: "President & Co-Founder", org: "Wizoona · Community startup",
      tags: ["Founding", "Partnerships", "Scaling"],
      points: ["Founded and scaled a non-profit community to 60+ members across two specialised streams within one month, recruiting exclusively from India's top-ranked engineering and business institutions.",
               "Secured formal partnerships with two premier Indian universities within Year 1, driving sustained engagement through weekly speaker sessions, fortnightly community events and a curated resource newsletter.",
               "Deployed an interactive website and standardised onboarding process, enabling rapid team scaling and seamless leadership transitions across a growing cross-institutional network."],
      skills: ["Founding", "Partnerships", "Community building", "Onboarding design"] },
    { id: "role-foruppo", color: "#f6a56b", dates: "Dec 2023 – Nov 2024", short: "Foruppo", title: "Project Management Intern → Cohort Lead", org: "Foruppo",
      tags: ["Agile", "MVPs", "Team culture"],
      points: ["Delivered multiple product MVPs across 2-week Agile sprints, translating ambiguous briefs into structured deliverables through rapid prototyping and iterative design.",
               "Led end-to-end design and development of a debate-practice platform across three builds (an AI chatbot in Botpress, a topic resource library in WordPress and a speaker transcript archive in Framer), managing scope, timelines and stakeholder expectations.",
               "Promoted twice in three months to Cohort Lead, taking ownership of team processes, culture and workflows across multiple concurrent cross-functional project teams."],
      skills: ["Agile / sprints", "Product MVPs", "Team leadership"] },
    { id: "role-notetaking", color: "#f7c948", dates: "Feb 2026 – Present", short: "UTS Notetaking", title: "Notetaking Assistant", org: "UTS Accessibility Support Program",
      tags: ["Accessibility", "Clarity"],
      points: ["Providing structured academic support to three students, producing clear and accessible course notes aligned to individual learning needs."],
      skills: ["Accessibility", "Structured writing", "Reliability"] },
    { id: "role-tedx", color: "#f6a56b", dates: "2022 – 2023", short: "TEDxGECRIT", title: "Lead Organiser", org: "TEDxGECRIT · Rajiv Gandhi Institute of Technology",
      tags: ["Event leadership", "Documentation", "Volunteer management"],
      points: ["Led the institution's first TEDx-licensed event, managing a 70-member volunteer team from licensing through to delivery.",
               "Hosted 100+ attendees with 90%+ satisfaction.",
               "Produced full planning frameworks, run sheets and post-event reporting."],
      skills: ["Event leadership", "Documentation", "Volunteer management"] },
    { id: "role-revertech", color: "#b79be0", dates: "Sep – Dec 2021", short: "Revertech", title: "Marketing Intern", org: "Revertech IT Solutions Pvt. Ltd",
      tags: ["Campaigns", "Digital marketing"],
      points: ["Contributed to planning and execution of 5+ digital marketing campaigns within a 20-member team, driving enrolment of 20+ students into the company's flagship program."],
      skills: ["Digital campaigns", "Teamwork", "Content"] }
  ],

  /* Tools and independent projects, merged. kind: "Tool" or "Project" (drives the filter). */
  work: [
    { id: "tool-linkedin", kind: "Tool", tag: "Web app", title: "LinkedIn Content Generator",
      desc: "Generates Export Connect LinkedIn posts with live research, a voice picker and carousel slide-count control, paired with a Canva carousel template.",
      stack: ["Web app", "Live research", "Canva"],
      roles: ["role-export-connect"], under: [] },
    { id: "tool-export-potential", kind: "Tool", tag: "Excel model", title: "Export Potential Predictor",
      desc: "In-Excel weighted scorecard with rating rules and confidence scores, ranking 192 crop–market combinations (16 crops, 15 markets) for a national horticulture strategy. Modelled on the ITC Export Potential Map.",
      stack: ["Excel", "Scoring model", "Looker Studio"],
      roles: ["role-export-connect"], under: [] },
    { id: "tool-capred", kind: "Tool", tag: "Market research", title: "Specialty Importers Long List",
      desc: "Long list and shortlist of specialty Asian importers and distributors in Australia for the CAPRED project (Cambodia Australia Partnership for Resilient Economic Development).",
      stack: ["Desk research", "Shortlisting", "Exporter outreach"],
      roles: ["role-export-connect"], under: ["CAPRED"] },
    { id: "tool-finance-session", kind: "Tool", tag: "Enablement", title: "Understanding Export Finances",
      desc: "Webinar for exporters on cash flow, working capital and financial readiness, grounded in Austrade guidance.",
      stack: ["Facilitation", "Export finance"],
      roles: ["role-export-connect"], under: [] },
    { id: "tool-evaluation", kind: "Tool", tag: "Framework", title: "Competency-Based Evaluation Framework",
      desc: "Evaluation system for 180 Degrees Consulting UTS aligned to club KPIs, enabling data-driven talent decisions.",
      stack: ["KPIs", "Process design", "People analytics"],
      roles: ["role-180dc"], under: [] },
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
    { t: "Structured problem-solving", d: "Ambiguous briefs turned into scoped, testable deliverables.", roles: ["role-export-connect", "role-180dc", "role-foruppo"], work: ["tool-capred"] },
    { t: "Data-driven decisions", d: "Evidence-led recommendations built on analytics tooling.", roles: ["role-export-connect", "role-180dc"], work: ["tool-export-potential", "tool-evaluation"] },
    { t: "Process design", d: "Workflows and onboarding that scale and survive hand-overs.", roles: ["role-180dc", "role-wizoona"], work: ["tool-evaluation"] },
    { t: "Stakeholder engagement", d: "Senior leadership, universities and cross-functional teams.", roles: ["role-export-connect", "role-180dc", "role-wizoona"], work: ["tool-finance-session"] },
    { t: "Agile delivery", d: "Sprints, charters, OKRs and WBS; Google PM certified.", roles: ["role-foruppo"], work: ["proj-plant-pals", "proj-career-crafter"] },
    { t: "Change & risk", d: "Leadership transitions, team scaling and run-sheet discipline.", roles: ["role-wizoona", "role-tedx"], work: [] }
  ],
  toolkit: [
    { t: "Python", under: ["MBAn, UTS"] },
    { t: "SQL", under: ["MBAn, UTS"] },
    { t: "Power BI", under: ["MBAn, UTS"] },
    { t: "Tableau", under: ["MBAn, UTS"] },
    { t: "Looker Studio", roles: ["role-export-connect"] },
    { t: "Excel (Advanced / Pivot Tables)", work: ["tool-export-potential"], under: ["MBAn, UTS"] },
    { t: "Google Suite", roles: ["role-foruppo"], under: ["Google PM Certificate"] },
    { t: "Microsoft Office Suite", roles: ["role-180dc"] },
    { t: "AI tools & agents", work: ["tool-linkedin", "proj-debate"] }
  ],

  /* WEBSITES (shown as a page only when this list is not empty).
     Thumbnail = automatic screenshot of the url, or drop images/site-<id>-1.jpg to override.
     Example:
     { id: "site-wizoona", title: "Wizoona", url: "https://...", desc: "Community website I shipped as co-founder.",
       roles: ["role-wizoona"], work: [], tags: ["Website", "Community"] } */
  websites: [
    // Foruppo
    { id: "site-career-crafter", title: "Career Crafter", url: "https://careercrafter1.wordpress.com", desc: "Minimalist career product site, co-built with a 10-member team during my Foruppo internship.",
      roles: ["role-foruppo"], work: ["proj-career-crafter"], tags: ["Website", "Foruppo"] },
    { id: "site-debatify", title: "Debatify", url: "https://debatify.framer.website", desc: "Debate-practice website built at Foruppo in 2-week Agile sprints.",
      roles: ["role-foruppo"], work: ["proj-debate"], tags: ["Website", "Foruppo"] },
    { id: "site-quibate", title: "Quibate", url: "https://quibate.webflow.io", desc: "Product MVP website built at Foruppo in 2-week Agile sprints.",
      roles: ["role-foruppo"], work: [], tags: ["Website", "Foruppo"] },
    { id: "site-voicebox", title: "VoiceBox", url: "https://voicebox.framer.website", desc: "Product MVP website built at Foruppo in 2-week Agile sprints.",
      roles: ["role-foruppo"], work: [], tags: ["Website", "Foruppo"] },
    // TEDxGECRIT
    { id: "site-tedxgecrit", title: "TEDxGECRIT", url: "https://tedxgecrit.vercel.app/", desc: "Official event website for the institution's first TEDx-licensed event.",
      roles: ["role-tedx"], work: [], tags: ["Website", "Event"] },
    { id: "site-tedx-event", title: "TEDxGECRIT on TED.com", url: "https://www.ted.com/tedx/events/54285", desc: "The event's official listing on the TEDx platform.",
      roles: ["role-tedx"], work: [], tags: ["TEDx", "Event"] },
    // Export Connect
    { id: "site-linkedin-generator", title: "Export Connect Post Studio", url: "downloads/Export_Connect_Post_Studio.html", download: true,
      desc: "LinkedIn post and carousel studio for Export Connect. Download the HTML, paste it into your own Claude chat and ask it to run it as an artifact.",
      roles: ["role-export-connect"], work: ["tool-linkedin"], tags: ["Web app", "Download"] },
    { id: "site-export-dashboard", title: "Export Markets Dashboard", url: "https://datastudio.google.com/s/nf7FoOGAx7E", desc: "Looker Studio dashboard ranking export markets for a national horticulture strategy.",
      roles: ["role-export-connect"], work: ["tool-export-potential"], tags: ["Looker Studio", "Dashboard"] }
  ],


  education: [
    { t: "Master of Business Analytics", s: "University of Technology Sydney", img: "edu-uts.webp", d: "Feb 2025 – Dec 2026 (expected)", n: "GPA 6.0 / 7.0 (current) · Business Analytics, Data-Driven Decision Making, Strategic Management" },
    { t: "BTech, Computer Science Engineering", s: "Rajiv Gandhi Institute of Technology, India", img: "edu-rit.jpeg", d: "Oct 2020 – Jun 2024", n: "GPA 7.86 / 10 · First Class · Data Structures, Systems Thinking, Information Management" }
  ],
  certs: [
    ["Agile Project Management", "Google", "95.50%"],
    ["Project Planning: Putting It All Together", "Google", "99.00%"],
    ["Project Execution: Running the Project", "Google", "96.48%"],
    ["Project Initiation: Starting a Successful Project", "Google", "99.45%"],
    ["Foundations of Project Management", "Google", "91.53%"],
    ["NPTEL: Project Management", "NPTEL", "60%"],
    ["WIL to Work Program 2025", "UTS Careers", ""]
  ]
};

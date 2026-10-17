/**
 * Alcovia — Product, Systems & Analytics Playbook
 * Inserts the full playbook into the ACTIVE Google Doc.
 * Usage: Extensions > Apps Script > paste > Save > Run > buildPlaybook
 *        (authorise when prompted). Re-running clears and rebuilds.
 */
function buildPlaybook() {
  const body = DocumentApp.getActiveDocument().getBody();
  body.clear();

  const H1 = t => body.appendParagraph(t).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  const H2 = t => body.appendParagraph(t).setHeading(DocumentApp.ParagraphHeading.HEADING2);
  const H3 = t => body.appendParagraph(t).setHeading(DocumentApp.ParagraphHeading.HEADING3);
  const P  = t => body.appendParagraph(t);
  const B  = t => body.appendListItem(t).setGlyphType(DocumentApp.GlyphType.BULLET);
  const N  = t => body.appendListItem(t).setGlyphType(DocumentApp.GlyphType.NUMBER);
  const T  = rows => { const t = body.appendTable(rows); t.getRow(0).editAsText().setBold(true); body.appendParagraph(""); };

  /* ================= TITLE ================= */
  H1("Alcovia — Product, Systems & Analytics Playbook");
  P("Owner: Product, Systems & Analytics Lead");
  P("Purpose: the single source of truth for how we measure the business, how we deliver every OKR, and who does what on the team — so nothing is re-derived, nothing ships without a number, and no work is orphaned.");
  P("Contents: Part I — KPI Framework & Metric Dictionary · Part II — The Delivery OS · Part III — Roles & Work Split.");

  /* ================= PART I ================= */
  H1("PART I — KPI Framework & Metric Dictionary");

  H2("0. Principles");
  N("One metric, one definition, one owner. No re-deriving numbers in separate sheets.");
  N("Every KPI answers a decision. If no action changes when it moves, it's vanity — drop it.");
  N("Automate the collection, not the judgement. N8N moves data; humans interpret it.");
  N("Inputs before outputs. Track leading indicators (show-up rate, feature reused) not just lagging ones (revenue, churn).");
  N("Small-n honesty. At ~20 active students, report rates with the raw counts (5/11, not just 45%).");

  H2("1. Personas & north-stars");
  T([
    ["Persona", "Job", "North-star", "Supporting stars"],
    ["Sales", "Convert qualified leads → enrolled parents", "Win rate (show-up rate leading)", "Sales-cycle length, quota attainment, renewal rate"],
    ["Marketing", "Generate & nurture leads profitably", "CAC (with LTV:CAC)", "CPL, ROAS, channel ROI"],
    ["Product", "Activate, engage, retain students", "Retention (trial→paid leading)", "Activation, feature adoption, NPS"]
  ]);
  P("Shared north-stars (company level): conversion rate · CAC · LTV:CAC · retention · NPS");

  H2("2. Metric dictionary");
  P("Legend — Src = source system · Freq = reporting cadence · Owner = accountable persona.");

  H3("2.1 Sales");
  T([
    ["KPI","Definition","Formula","Src","Freq","Owner"],
    ["Leads contacted","Leads with ≥1 outbound touch","contacted ÷ assigned","ClickUp","Daily","Sales"],
    ["Lead → Won","% of leads that enrol & pay","won ÷ total leads","ClickUp + Razorpay","Weekly","Sales"],
    ["Win rate","Close rate from qualified","won ÷ qualified","ClickUp","Weekly","Sales"],
    ["Show-up rate","Discovery calls actually attended","attended ÷ set","Smallest.ai","Weekly","Sales"],
    ["Touchpoints","Avg touches before win","total touches ÷ won","ClickUp","Weekly","Sales"],
    ["First-response time","Median lead-in → first contact","median(in − t1)","ClickUp / N8N","Daily","Sales"],
    ["Revenue / rep","Revenue per salesperson","revenue ÷ active reps","Razorpay","Monthly","Sales"],
    ["Revenue / lead","Yield per lead","revenue ÷ leads","Razorpay + ClickUp","Monthly","Sales"],
    ["Renewal rate","Trials/full programs renewed","renewed ÷ due","ClickUp + Razorpay","Monthly","Sales"],
    ["Sales-cycle length","Days lead → paid","avg(paid − lead-in)","ClickUp","Monthly","Sales"],
    ["Quota attainment","Actual ÷ target","achieved ÷ quota","ClickUp","Monthly","Sales"]
  ]);

  H3("2.2 Marketing");
  T([
    ["KPI","Definition","Formula","Src","Freq","Owner"],
    ["Leads by source","Volume split by channel","count by source","ClickUp / Meta ads","Weekly","Marketing"],
    ["CPL","Cost per lead","spend ÷ leads","Ads + Razorpay","Weekly","Marketing"],
    ["MQL rate","Leads that qualify","MQL ÷ leads","ClickUp","Weekly","Marketing"],
    ["Nurture → conversion","Nurtured leads that convert","converted ÷ nurtured","ClickUp / N8N","Monthly","Marketing"],
    ["Open / click / reply","Messaging engagement","opens ÷ sent, etc.","Email/WA tooling","Weekly","Marketing"],
    ["Nurture completion","% finishing nurture sequence","completed ÷ enrolled","N8N","Monthly","Marketing"],
    ["CAC","Cost to acquire a paying user","total S&M spend ÷ new paid","Ads + Razorpay","Monthly","Marketing"],
    ["ROAS","Return on ad spend","revenue ÷ ad spend","Ads + Razorpay","Weekly","Marketing"],
    ["Dormant lead %","Leads with no activity in 30d","dormant ÷ total leads","ClickUp","Monthly","Marketing"],
    ["Channel ROI","Return per channel","(rev − cost) ÷ cost","Ads + Razorpay","Monthly","Marketing"]
  ]);

  H3("2.3 Product (student app)");
  T([
    ["KPI","Definition","Formula","Src","Freq","Owner"],
    ["Activation","Installed → meaningful first action","activated ÷ installs","App analytics","Weekly","Product"],
    ["Trial → paid","Trials converting to full program","paid ÷ trials","App + Razorpay","Monthly","Product"],
    ["DAU / WAU / MAU","Active users per window","unique actives","App analytics","Daily/Weekly/Monthly","Product"],
    ["Feature adoption","Tried → Reused → Habitual per feature","active students per stage","App analytics","Weekly","Product"],
    ["Session length","Median time in app","median session duration","App analytics","Weekly","Product"],
    ["ARPU","Revenue per active user","revenue ÷ active users","App + Razorpay","Monthly","Product"],
    ["Expansion revenue","Upsell / add-on revenue","Σ upgrades","Razorpay","Monthly","Product"],
    ["D30 / D90 retention","Still active at day 30/90","active at Dn ÷ cohort","App analytics","Monthly","Product"],
    ["Churn","Users lost per period","lost ÷ start-of-period","App analytics","Monthly","Product"],
    ["NPS","Net promoter score","%promoters − %detractors","Survey","Quarterly","Product"],
    ["Time-to-first-value","Install → first aha moment","median(aha − install)","App analytics","Weekly","Product"]
  ]);

  H2("3. System → Persona map");
  T([
    ["System","Role","Feeds"],
    ["ClickUp","CRM, funnel, comms log","Sales (contacted, win rate, cycle) · Marketing (lead source, MQL, dormant)"],
    ["Smallest.ai","AI call scheduling & outcomes","Sales + Marketing (show-up rate, call outcomes)"],
    ["N8N","Automation / orchestration layer","Cross-cutting ops (alerts, sync, Product support)"],
    ["App analytics","Product event stream","Product (DAU/WAU, adoption, retention, activation)"],
    ["Razorpay","Payments","Revenue (Sales · Marketing · Product)"]
  ]);
  P("Reference data flow:");
  P("ClickUp / Smallest.ai / Meta Ads / App events / Razorpay  →  N8N (extract · transform · schedule)  →  Warehouse/Sheet  →  Dashboards  +  N8N alert rules (threshold breaches).");

  H2("4. Cadence & governance");
  T([
    ["Ritual","Who","Metrics reviewed"],
    ["Daily standup (15m)","Sales + Marketing","Leads contacted, first-response time, show-up"],
    ["Weekly GTM review","Sales · Marketing · Product","Funnel by stage, CAC, feature adoption, retention"],
    ["Monthly business review","All + founder","Revenue vs target, LTV:CAC, churn, NPS"],
    ["Quarterly OKR review","All","North-stars + OKR completion, re-scope"]
  ]);
  P("Alert rules (N8N): show-up rate < 70% · CPL +25% WoW · 7-day active users below floor · any tier-1 feature with 0 habitual users.");

  H2("5. Instrumentation gaps (to close)");
  N("Feature event tracking in the app — emit feature_opened / feature_reused per student (enables Tried→Reused→Habitual and tier-1 alerts).");
  N("Call-outcome tagging in Smallest.ai — structured set / attended / no-show / reschedule so show-up computes automatically.");
  N("Ad-account → N8N — pull Meta metrics nightly for CPL/CTR/ROAS without manual exports.");
  N("Payment reconciliation — Razorpay → ClickUp so Lead→Won and renewals auto-update.");
  N("One blended scorecard — joins funnel (ClickUp), automation health (N8N), call outcomes (Smallest.ai) and product (app).");

  H2("6. What \"good\" looks like (targets)");
  T([
    ["KPI","Current","Target"],
    ["Avg session length","2.15 min","30 min"],
    ["WAU (of ~20)","11–17","18+"],
    ["Dormant (2-week)","7 students","≤ 3"],
    ["Show-up rate","—","≥ 75%"],
    ["Tier-1 feature habitual users","0 (Wellness, Streak, Rankings, Goals)","≥ 8"],
    ["Trial → paid","—","≥ 40%"]
  ]);
  P("Current figures from the app brief (45-day / ~20-student sample).");

  /* ================= PART II ================= */
  H1("PART II — The Delivery OS");
  P("Goal: make every OKR (feature release, analytical upload, system change) land at its best — highest completion of its success metric, least cognitive load for teens and parents.");

  H2("7. Why delivery fails (the five modes we kill)");
  T([
    ["Failure mode","What it looks like at Alcovia"],
    ["Shipping ≠ working","\"Realm is live\" but only 13/20 students ever opened it"],
    ["No owner of the outcome","Success judged by \"it's released\", not \"the metric moved\""],
    ["Cognitive load as polish","6 tiles on Home; the teen doesn't know what to do next"],
    ["No instrumentation at design time","Can't tell if it worked — argue from vibes"],
    ["No kill/scale rules","Wellness, Streak, Rankings, Goals sit at 0 habitual users"]
  ]);

  H2("8. The system in one line");
  P("Every OKR is an artifact that walks through 8 gates. A gate only opens when its exit test passes. Done = the success metric moved, not code shipped. Weight by risk: a copy change takes the light path (gates 1, 2, 5); a new feature or analytical upload takes the full path.");
  P("INTAKE → 1 FRAME → 2 SUCCESS → 3 DESIGN → 4 BUILD → 5 VERIFY → 6 LAUNCH → 7 VERDICT → SCALE / ITERATE / KILL");
  P("Park if no owner · reject if unfalsifiable · no metric → back to 1 · load fail → back to 3 · QA fail → back to 4 · regression → rollback.");

  H2("9. Seven principles");
  N("One OKR = one card = one outcome owner. No orphan work.");
  N("The success metric is written before the build starts. Can't name it → not ready.");
  N("Instrumentation-first. The event spec is part of the design.");
  N("Least cognitive load is a gate. ≤3 taps to the core action; one primary CTA per screen; zero required decisions on first run.");
  N("Two users, two lenses. Every feature passes a teen lens and a parent lens.");
  N("Leading indicators before lagging. Track feature_reused, show-up, activation — not just revenue.");
  N("Kill fast, scale fast. Explicit numbers decide; the lead doesn't.");

  H2("10. The 8 gates");
  P("Each gate: goal → steps → artifact → exit test → owner.");

  H3("Gate 0 — Intake");
  P("Goal: capture the OKR without committing. Steps: log on the OKR Delivery Card; tag type (Feature / Analytical upload / System / Growth). Exit test: it names a user (teen or parent) and a decision it serves. Else park. Owner: Lead.");

  H3("Gate 1 — Frame (problem → hypothesis)");
  P("Goal: turn \"build X\" into \"because Y, doing X will cause Z\". Steps: one-sentence problem; hypothesis (Because ___, if we ___, then ___ changes); the one behaviour that must change. Exit test: a falsifiable hypothesis exists. Owner: Lead.");

  H3("Gate 2 — Success metric (the contract)");
  P("Goal: make \"done\" objective. Steps: pick one primary metric (from Part I); set baseline → target → window; add guardrails; pre-commit kill/iterate/scale thresholds. Exit test: baseline measured, target numeric, window dated. Owner: Lead.");
  P("Analytical upload nuance: the metric isn't \"uploaded\" — it's \"a decision was made using it.\"");

  H3("Gate 3 — Design (least cognitive load)");
  P("Steps: 1-line user story per actor; count taps to core action (≤3); run Cognitive-Load Checklist + teen/parent lenses; write the Instrumentation Spec; define kill switch + feature flag. Exit test: both lenses pass; every metric has an event; a kill switch exists. Owner: Product/Design.");

  H3("Gate 4 — Build");
  P("Steps: build to spec behind a flag; wire integrations (ClickUp / Smallest.ai / N8N / Razorpay); emit events; test the core path. Exit test: happy path works in staging; events land. Owner: Build/Automation.");

  H3("Gate 5 — Verify");
  P("Steps: QA script; run 5 real teens (or 3 teens + 2 parents); measure completion, time-on-task, \"did you know what to do?\"; check Definition of Done. Exit test: ≥4/5 complete unaided and events verified. Owner: Lead (final) + both.");

  H3("Gate 6 — Launch (staged)");
  P("Steps: 10% → 50% → 100% ramp; watch alert rules; daily read on primary + guardrails; flag ready. Exit test: guardrails green through ramp; no alert fires. Owner: Build/Automation (exec), Lead (call).");

  H3("Gate 7 — Verdict");
  P("Steps: at T+window, read the dashboard against Gate 2; declare SCALE / ITERATE / KILL using pre-committed thresholds; write a 5-line Post-Launch Review. Exit test: a verdict is recorded and the next action scheduled. Owner: Lead.");
  P("Outcome loop: SCALE → raise target & widen rollout. ITERATE → back to Gate 1 with a new hypothesis (max 2, then KILL). KILL → switch off, capture learning, free the WIP slot.");

  H2("11. Cadence");
  P("WIP limits: 1 item in Build per person · max 2 in Design · unlimited in Intake.");
  T([
    ["When","Ritual","Outcome"],
    ["Daily, 10 min async","Standup in ClickUp","Blockers surfaced"],
    ["Mon, 30 min","Prioritise; move each card one gate forward","Pipeline visible"],
    ["Wed, 30 min","Design review (Gate 3 → 4)","Only load-passing work builds"],
    ["Fri, 45 min","Ship + all due Post-Launch Reviews","One verdict minimum"],
    ["Monthly","Business review + process retro","Targets re-set"],
    ["Quarterly","OKR re-scope + kill/scale audit","No zombies"]
  ]);

  H2("12. Worked example — end to end");
  P("OKR: \"Increase habitual Wellness use.\"");
  N("0 Intake: type = Feature; owner = Lead.");
  N("1 Frame: Because Wellness is opened but never repeated, if we convert it to a 30-second daily check-in tied to the streak, then habitual use will rise.");
  N("2 Success: Primary = Wellness habitual users 0 → 8 by T+14d. Guardrails = session length not down; Home completion not down. Kill if < 2 habitual.");
  N("3 Design: teen lens (1 tap from Home, 30s, no typing); parent lens (visible progress, no nag); events = wellness_opened / completed / reused_d3; kill switch = flag.");
  N("4 Build: daily check-in + streak tie-in only.");
  N("5 Verify: 5 teens; 5/5 complete <30s unaided; events land.");
  N("6 Launch: 10% → 100%; guardrails green.");
  N("7 Verdict (T+14): 6 habitual → ITERATE once (streak reward); still <8 → KILL and free the slot.");

  H2("13. Process KPIs (are we getting better?)");
  B("OKR success rate (% reaching target) — aim up");
  B("Cycle time intake → launch");
  B("Rework % (items sent back a gate)");
  B("% features launched with events + kill switch — aim 100%");
  B("Rollback / incident rate");
  B("WIP vs limit adherence");

  /* ================= PART III ================= */
  H1("PART III — Roles & Work Split");
  P("Mental model: the Lead owns the system that decides; the System Designer (full-stack) owns the system that runs. Same goals, two halves — \"what should exist & why\" vs \"how it's built & kept alive.\"");

  H2("14. System Designer · Full-stack — the work");
  T([
    ["Workstream","Concrete work at Alcovia"],
    ["1. Architecture & data contracts","Source-of-truth schema (students, leads, calls, payments, app events); flow ClickUp/Smallest.ai/Meta/Razorpay/app → N8N → warehouse → dashboards; lock field names, types, timestamps; choose warehouse vs sheets vs app DB."],
    ["2. Integrations & automation (N8N)","Funnel sync, call-outcome tagging, nurture, deadline alerts, payment reconcile, app-event → warehouse; alert rules, retries, error handling; own source health."],
    ["3. Product surface (full-stack)","Student app features (Home, Realm, Focus, Wellness, Streak, Rankings, Goals, Syllabus, Planner) + dashboards (GTM Command Center, Student Progress) — front-end and the APIs/backends; role gate, theming, export, page speed."],
    ["4. Instrumentation","Event taxonomy; emit feature_opened / feature_reused; attribution; ensure events land, dedupe, backfill."],
    ["5. Reliability & observability","Monitoring, error logs, data-freshness SLAs, feature flags, kill switches, secrets/PII hygiene."],
    ["6. Delivery / DevOps","Repos, CI, GitHub Pages deploys, staging vs prod, rollout mechanics (10 → 50 → 100%)."]
  ]);

  H2("15. Lead — the work");
  T([
    ["Workstream","Concrete work at Alcovia"],
    ["1. Metric system","Own the KPI Framework (definitions, targets, owners); write a Success Metric Sheet per OKR; enforce small-n honesty."],
    ["2. Delivery OS","Run the 8 gates; chair Mon prioritise, Wed design review, Fri verdicts; enforce WIP limits and Definition of Done; make kill/scale calls."],
    ["3. Insight → decisions","Read dashboards, write RCAs, turn data into actions; run monthly business review and quarterly re-scope; own the blended-scorecard narrative."],
    ["4. Prioritisation","Intake + rank OKRs (impact/effort); balance feature vs analytical vs system work."],
    ["5. Cognitive load & principles","Review every feature through teen + parent lenses; the ≤3-tap rule, one CTA. Non-negotiable gate."],
    ["6. Coaching & quality","Lead the two teammates, unblock, review artifacts, own the final Verify gate."],
    ["7. Stakeholder & narrative","Founder comms; recommendation memos (\"here's what the data says we should do\")."],
    ["8. Governance","Approve data contracts and any metric change; guard the single source of truth."]
  ]);

  H2("16. The seam — where the two roles must sync (RACI)");
  T([
    ["Decision","Lead","System Designer"],
    ["What to build (which OKR)","A","C"],
    ["How to build it","C","A"],
    ["Metric definition","A","C (feasibility)"],
    ["Data schema / fields","C","A"],
    ["Event spec","C (insight)","A (emit) — joint"],
    ["Alert thresholds","A","R (wires them)"],
    ["Launch go/no-go","A","R"],
    ["Scale / iterate / kill","A","C"]
  ]);
  P("A = accountable · R = does it · C = consulted.");

  H2("17. What each role is NOT");
  B("Lead: doesn't write prod code, fix pipelines, or build dashboards.");
  B("System Designer: doesn't set targets, decide kill/scale, or own the data story.");

  H2("18. Weekly rhythm");
  B("Lead: Mon prioritise → Wed design review → Fri verdicts → monthly/quarterly reviews → ad-hoc insight memos.");
  B("System Designer: daily build → Wed feasibility → Fri deploy → on-call for data freshness + alerts.");
  P("Rule of thumb: if it's a decision or a definition, it's the Lead's; if it's a build or a pipe, it's the System Designer's.");
}

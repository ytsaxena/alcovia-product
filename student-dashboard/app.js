/* ============================================================
   Alcovia · Student Progress Dashboard  —  dummy data + render
   Cohort-average + per-Alcovian views across day/week/month/quarter.
   KPI lens: Quantity (conducted) · Quality (liked) · Performance.
   ============================================================ */

/* ---------- utils ---------- */
const IN = new Intl.NumberFormat("en-IN");
const n0 = (n) => IN.format(Math.round(n));
const pct = (x, d = 0) => x.toFixed(d) + "%";
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
const mean = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/* ---------- student data (12-Alcovian sample) ---------- */
const NAMES = ["Aarav", "Zoya", "Ishaan", "Myra", "Kabir", "Ananya", "Vihaan", "Diya", "Reyaan", "Saanvi", "Advait", "Kiara"];

/* ---------- journeys ---------- */
const STUDENT_STAGES = [
  { name: "Enrolled", desc: "Onboarded into Alcovia", owner: "Admissions" },
  { name: "Trial start", desc: "3-month trial begins", owner: "Advisor" },
  { name: "Daily rigour", desc: "Timetable, quizzes, focus, wearables", owner: "Advisor + app" },
  { name: "Weekly roadmap", desc: "Academic roadmap & goal setting", owner: "Advisor" },
  { name: "Monthly career", desc: "Workshop, pod, peer, mentor", owner: "Program" },
  { name: "Quarterly themes", desc: "Social work · entrepreneurship · out-of-city", owner: "Program" },
  { name: "Roadmaps delivered", desc: "Career, personal, academic signed off", owner: "Advisor" },
  { name: "Full-program decision", desc: "Trial → full programme", owner: "Sales + Advisor" },
  { name: "Renewed / advanced", desc: "Summer programs, alumni", owner: "Program" },
];
const PARENT_STAGES = [
  { name: "Awareness", desc: "Sees Meta ad / organic content", owner: "Marketing" },
  { name: "Discovery call set", desc: "Intro call scheduled", owner: "Sales" },
  { name: "Discovery call attended", desc: "Shows up to the call", owner: "Sales" },
  { name: "Ambition interview", desc: "Interview with the teen", owner: "Sales" },
  { name: "Architect session", desc: "Personalised roadmap shown to parent + teen", owner: "Sales + Advisor" },
  { name: "Enrolment & payment", desc: "Signs up", owner: "Sales" },
  { name: "Progress updates", desc: "Engages with the weekly dashboard", owner: "Advisor" },
  { name: "Parent-child workshop", desc: "Quarterly bonding workshop", owner: "Program" },
  { name: "Renewal / referral", desc: "Renews or refers another family", owner: "Sales" },
];

function generate() {
  const r = mulberry32(20241101);
  const rnd = (a, b) => a + r() * (b - a);
  const students = NAMES.map((name) => {
    const focusMin = Math.round(rnd(4, 33));
    const syllabusPct = Math.round(rnd(16, 88));
    const rigourStage = Math.round(rnd(1, 5));
    const focusTarget = 30;
    const s = {
      name, focusMin, focusTarget,
      activeMin: Math.round(rnd(18, 78)),
      recovery: Math.round(rnd(48, 92)),
      timetable: Math.round(rnd(35, 96)),
      quizAttended: Math.round(rnd(2, 7)), quizTotal: 7, quizAvg: Math.round(rnd(45, 92)),
      syllabusPct, onTrack: syllabusPct >= 58 && r() > 0.35, rigourStage,
      taskCompletion: Math.round(rnd(40, 96)),
      deadlineAdh: Math.round(rnd(35, 96)),
      estAcc: Math.round(rnd(40, 90)),
      workshopsAtt: Math.round(rnd(0, 2)), workshopsTotal: 2,
      podAtt: Math.round(rnd(0, 2)), podTotal: 2,
      peerAtt: Math.round(rnd(0, 1)), peerTotal: 1,
      mentorAtt: Math.round(rnd(0, 1)), mentorTotal: 1,
      brandingDone: r() > 0.4,
      rating: Math.round(rnd(30, 50)) / 10,
      podcast: r() > 0.6, competition: r() > 0.5, parentChild: r() > 0.3, outOfCity: r() > 0.5,
      socialWork: Math.round(rnd(0, 100)), entrep: Math.round(rnd(0, 100)),
      summer: r() > 0.5, career: r() > 0.5, personal: Math.round(rnd(0, 100)),
    };
    s.engagement = Math.round((focusMin / 30) * 40 + (s.timetable * 0.2) + (s.quizAttended / 7 * 20) + (s.taskCompletion * 0.2));
    s.roadmap = Math.round((s.personal + s.syllabusPct + (s.career ? 100 : 0)) / 3);
    s.participation = Math.round(((s.workshopsAtt / 2) + (s.podAtt / 2) + s.peerAtt + s.mentorAtt + (s.brandingDone ? 1 : 0)) / 6 * 100);
    s.status = (syllabusPct >= 58 && rigourStage >= 3 && focusMin >= 12) ? "ontrack" : (focusMin < 9 || syllabusPct < 34 || s.quizAttended <= 2) ? "risk" : "mid";
    s.daysIn = Math.round(rnd(24, 150));
    s.stage = Math.round(rnd(2, 8));
    s.parentStage = Math.round(rnd(4, 8));
    return s;
  });
  return { students };
}

let DATA = generate();

/* ---------- chart builders ---------- */
function barChart({ labels, values, color = "#5b5bf0", target, valueFmt = (v) => Math.round(v), height = 230, maxOverride }) {
  const W = 780, H = height, P = { t: 16, r: 14, b: 46, l: 46 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const max = maxOverride || Math.max(...values, ...(target ? [target] : [])) * 1.2 || 1;
  const n = labels.length, step = iw / n, bw = Math.min(40, step * 0.6);
  const y = (v) => P.t + ih - (ih * v) / max;
  let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;
  for (let k = 0; k <= 4; k++) {
    const gy = P.t + (ih * k) / 4;
    s += `<line x1="${P.l}" x2="${P.l + iw}" y1="${gy}" y2="${gy}" stroke="var(--line-2)"/>`;
    s += `<text x="${P.l - 8}" y="${gy + 4}" text-anchor="end">${valueFmt(max * (1 - k / 4))}</text>`;
  }
  labels.forEach((lab, i) => {
    const cx = P.l + step * i + step / 2;
    const y1 = y(values[i]);
    const col = color === "auto" ? (values[i] >= (target || 0) ? "#12a150" : "#e5484d") : color;
    s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${y1.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, (P.t + ih) - y1).toFixed(1)}" rx="4" fill="${col}"><title>${lab}: ${valueFmt(values[i])}</title></rect>`;
    s += `<text x="${cx}" y="${H - 30}" text-anchor="middle" transform="rotate(32 ${cx} ${H - 30})">${lab}</text>`;
  });
  if (target) { const ty = y(target); s += `<line x1="${P.l}" x2="${P.l + iw}" y1="${ty}" y2="${ty}" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="6 5"/>`; }
  return s + `</svg>`;
}
function groupedBarChart({ labels, series, valueFmt = (v) => v.toFixed(1), height = 230 }) {
  const W = 780, H = height, P = { t: 16, r: 14, b: 46, l: 46 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.2 || 1;
  const n = labels.length, step = iw / n, gw = step * 0.62, bw = gw / series.length;
  const y = (v) => P.t + ih - (ih * v) / max;
  let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;
  for (let k = 0; k <= 4; k++) { const gy = P.t + (ih * k) / 4; s += `<line x1="${P.l}" x2="${P.l + iw}" y1="${gy}" y2="${gy}" stroke="var(--line-2)"/>`; s += `<text x="${P.l - 8}" y="${gy + 4}" text-anchor="end">${valueFmt(max * (1 - k / 4))}</text>`; }
  labels.forEach((lab, i) => {
    const cx = P.l + step * i + step / 2;
    series.forEach((ser, j) => {
      const x = cx - gw / 2 + j * bw;
      const y1 = y(ser.values[i]);
      s += `<rect x="${x.toFixed(1)}" y="${y1.toFixed(1)}" width="${(bw - 3).toFixed(1)}" height="${Math.max(0, (P.t + ih) - y1).toFixed(1)}" rx="3" fill="${ser.color}"><title>${ser.name} · ${lab}: ${valueFmt(ser.values[i])}</title></rect>`;
    });
    s += `<text x="${cx}" y="${H - 30}" text-anchor="middle" transform="rotate(32 ${cx} ${H - 30})">${lab}</text>`;
  });
  return s + `</svg>`;
}
function donutChart({ segments, size = 176, thickness = 26, centerTop = "", centerSub = "" }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const rad = (size - thickness) / 2, c = size / 2, circ = 2 * Math.PI * rad;
  let off = 0;
  let s = `<svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet">`;
  s += `<circle cx="${c}" cy="${c}" r="${rad}" fill="none" stroke="var(--line-2)" stroke-width="${thickness}"/>`;
  segments.forEach((seg) => {
    const len = (seg.value / total) * circ;
    s += `<circle cx="${c}" cy="${c}" r="${rad}" fill="none" stroke="${seg.color}" stroke-width="${thickness}" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${c} ${c})"><title>${seg.name}: ${seg.value}</title></circle>`;
    off += len;
  });
  s += `<text x="${c}" y="${c - 2}" text-anchor="middle" style="font-size:17px;font-weight:750;fill:var(--ink)">${centerTop}</text>`;
  s += `<text x="${c}" y="${c + 15}" text-anchor="middle" style="font-size:10.5px;fill:var(--muted)">${centerSub}</text>`;
  return s + `</svg>`;
}
function hbar(label, value, max, color, display) {
  return `<div class="split"><span class="lab">${label}</span><span class="val">${display}</span><div class="track"><span style="width:${Math.max(2, (value / max) * 100).toFixed(1)}%;background:${color}"></span></div></div>`;
}
function mcard(label, value, meta, hl) {
  return `<div class="mcard${hl ? " hl" : ""}"><div class="mlab">${label}</div><div class="mval">${value}</div><div class="mmeta">${meta}</div></div>`;
}
function badge(status) {
  const map = { ontrack: ["scale", "On track"], mid: ["refresh", "Watch"], risk: ["drop", "At risk"] };
  const [cls, txt] = map[status];
  return `<span class="badge ${cls}">${txt}</span>`;
}

/* ---------- aggregates ---------- */
function agg(d) {
  const S = d.students;
  const onTrackN = S.filter((s) => s.onTrack).length;
  return {
    focusAvg: Math.round(mean(S.map((s) => s.focusMin))),
    activeAvg: Math.round(mean(S.map((s) => s.activeMin))),
    recoveryAvg: Math.round(mean(S.map((s) => s.recovery))),
    timetableAvg: Math.round(mean(S.map((s) => s.timetable))),
    quizAvg: Math.round(mean(S.map((s) => s.quizAvg))),
    quizAttAvg: +(mean(S.map((s) => s.quizAttended))).toFixed(1),
    syllabusAvg: Math.round(mean(S.map((s) => s.syllabusPct))),
    rigourAvg: +(mean(S.map((s) => s.rigourStage))).toFixed(1),
    taskAvg: Math.round(mean(S.map((s) => s.taskCompletion))),
    deadlineAvg: Math.round(mean(S.map((s) => s.deadlineAdh))),
    estAvg: Math.round(mean(S.map((s) => s.estAcc))),
    ratingAvg: +(mean(S.map((s) => s.rating))).toFixed(1),
    participationAvg: Math.round(mean(S.map((s) => s.participation))),
    roadmapAvg: Math.round(mean(S.map((s) => s.roadmap))),
    engagementAvg: Math.round(mean(S.map((s) => s.engagement))),
    onTrackPct: Math.round((onTrackN / S.length) * 100),
    onTrackN, total: S.length,
    podcasts: S.filter((s) => s.podcast).length,
    competitions: S.filter((s) => s.competition).length,
    parentChild: S.filter((s) => s.parentChild).length,
    outOfCity: S.filter((s) => s.outOfCity).length,
    careerDone: S.filter((s) => s.career).length,
    socialAvg: Math.round(mean(S.map((s) => s.socialWork))),
    entrepAvg: Math.round(mean(S.map((s) => s.entrep))),
    summerN: S.filter((s) => s.summer).length,
  };
}

/* ---------- renderers ---------- */
function renderOverview(d) {
  const a = agg(d);
  setHTML("ovCards", [
    mcard("Avg focus / day", a.focusAvg + " min", "target 30 min · " + pct((a.focusAvg / 30) * 100), a.focusAvg >= 30),
    mcard("Syllabus on track", a.onTrackPct + "%", `${a.onTrackN} of ${a.total} Alcovians`),
    mcard("Avg chapter rigour", a.rigourAvg + " / 5", "endeavour → exam-ready"),
    mcard("Avg study-session", a.timetableAvg + "%", "timetable adherence"),
    mcard("Avg active minutes", a.activeAvg + " /day", "wearables (Apple/Samsung/WHOOP/Garmin)"),
    mcard("Avg recovery", a.recoveryAvg + " /100", "sleep & recovery score"),
  ].join(""));

  setHTML("matrixSub", "12 Alcovians · current period");
  const rows = [
    ["Daily quiz (8pm)", "Day", "7 / 7 days", `${a.quizAttAvg}/7 attended · ${pct((a.quizAttAvg / 7) * 100)}`, `avg score ${a.quizAvg}%`],
    ["Focus time", "Day", "sessions auto-logged", `${pct((a.focusAvg / 30) * 100)} of target`, `${a.focusAvg} / 30 min`],
    ["Active minutes", "Day", "12 / 12 devices synced", "health sync coverage", `${a.activeAvg} min/day`],
    ["Active recovery", "Day", "recovery data pulled", "daily coverage", `${a.recoveryAvg} / 100`],
    ["Timetable management", "Day", "12 / 12 built", `${a.timetableAvg}% adherence`, "post-school timeboxing"],
    ["Goal setting & trend", "Week", "12 / 12 roadmaps", "parent-aligned", `${a.roadmapAvg}% roadmap progress`],
    ["Syllabus completion", "Week", "chapters tracked", `${a.rigourAvg}/5 rigour`, `${a.onTrackPct}% on track`],
    ["Chapter readiness", "Week", "chapters at practice", "≥70% practice accuracy", `avg rigour ${a.rigourAvg}/5`],
    ["Task completion", "Week", "tasks tracked", "—", `${a.taskAvg}% complete`],
    ["Deadline adherence", "Week", "deadlines tracked", "—", `${a.deadlineAvg}% on time`],
    ["Time-estimation accuracy", "Week", "estimates logged", "—", `${a.estAvg}% accurate`],
    ["Workshop (career)", "Month", "2 / 2 held", `${a.ratingAvg} / 5 rating`, "11 soft skills tracked"],
    ["Pod session", "Month", "pods held", `${a.ratingAvg} / 5 rating`, `${a.participationAvg}% participation`],
    ["Peer session", "Month", "sessions set", "advisor-matched", `${a.participationAvg}% engaged`],
    ["Mentor call", "Month", "calls held", `${a.ratingAvg} / 5 rating`, "1 per Alcovian"],
    ["Personal branding", "Month", "shoots done", "clips posted", `${a.participationAvg}% covered`],
    ["Podcast shoot", "Quarter", "3 podcasts", "liked by cohort", `${a.podcasts} / ${a.total} hosted`],
    ["Competition prep", "Quarter", "competitions run", "prepared", `${a.competitions} / ${a.total} prepared`],
    ["Parent-child bonding", "Quarter", "1 workshop", "fun-rated", `${a.parentChild} / ${a.total} parents joined`],
    ["Out-of-city experience", "Quarter", "1 experience", "memorable", `${a.outOfCity} / ${a.total} attended`],
    ["Theme · Social work", "Quarter", "3 months", "empathy", `${a.socialAvg}% participation`],
    ["Theme · Entrepreneurship", "Quarter", "startups built", "grit", `${a.entrepAvg}% progress`],
    ["Summer program closure", "Quarter", "applications filed", "guidance", `${a.summerN} / ${a.total} applied`],
    ["Roadmap · Career", "Roadmap", "12 / 12 set", "binary outcome", `${a.careerDone} / ${a.total} done`],
    ["Roadmap · Personal", "Roadmap", "milestones tracked", "monthly plan", `${a.roadmapAvg}% milestones`],
    ["Roadmap · Academic", "Roadmap", "syllabus + rigour", "on-track check", `${a.onTrackPct}% on track`],
  ];
  setHTML("matrixRows", rows.map((r) => `<tr>
    <td><span class="cname">${r[0]}</span></td>
    <td><span class="type-pill ${r[1] === "Day" ? "workshop" : r[1] === "Quarter" ? "program" : ""}" style="background:var(--bg-soft);color:var(--muted)">${r[1]}</span></td>
    <td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join(""));

  setHTML("ovDonut", donutChart({
    segments: [
      { name: "On track", value: a.onTrackN, color: "#12a150" },
      { name: "Off track", value: a.total - a.onTrackN, color: "#e5484d" },
    ], centerTop: a.onTrackPct + "%", centerSub: "on track",
  }));
  setHTML("ovDonutLegend", `<div class="stat-row"><span style="width:10px;height:10px;border-radius:3px;background:#12a150"></span><span class="sr-name">On track</span><span class="sr-val">${a.onTrackN}</span></div>
    <div class="stat-row"><span style="width:10px;height:10px;border-radius:3px;background:#e5484d"></span><span class="sr-name">Off track</span><span class="sr-val">${a.total - a.onTrackN}</span></div>`);

  setHTML("ovFocusBars", hbar("Cohort avg", a.focusAvg, 30, "#5b5bf0", a.focusAvg + " / 30 min")
    + hbar("Best Alcovian", Math.max(...d.students.map((s) => s.focusMin)), 30, "#12a150", Math.max(...d.students.map((s) => s.focusMin)) + " min")
    + hbar("Weakest Alcovian", Math.min(...d.students.map((s) => s.focusMin)), 30, "#e5484d", Math.min(...d.students.map((s) => s.focusMin)) + " min"));

  setHTML("ovInsight", `<span class="ico">i</span><div><b>Cohort read:</b> ${a.onTrackPct}% are syllabus on-track and avg rigour is ${a.rigourAvg}/5.
    The binding constraint is <b>focus time</b> (${a.focusAvg} of 30 min) and <b>study-feature fade</b>. Weekly advisor review: 15 min, act on the At-risk filter.</div>`);
}

function renderDaily(d) {
  const a = agg(d);
  setHTML("dailyCards", [
    mcard("Daily quiz avg", a.quizAvg + "%", `${a.quizAttAvg}/7 attendance`, false),
    mcard("Focus time", a.focusAvg + " min", "target 30 min", false),
    mcard("Timetable adherence", a.timetableAvg + "%", "post-school timeboxing", false),
    mcard("Active minutes", a.activeAvg + " /day", "wearables sync", false),
    mcard("Recovery score", a.recoveryAvg + " /100", "sleep & recovery", false),
    mcard("Quiz days", "7 / 7", "8pm daily", true),
  ].join(""));
  setHTML("dailyQuizSub", `cohort avg ${a.quizAvg}%`);
  setHTML("dailyQuizChart", barChart({ labels: d.students.map((s) => s.name), values: d.students.map((s) => s.quizAvg), color: "#5b5bf0", maxOverride: 100 }));
  setHTML("dailyFocusSub", `cohort avg ${a.focusAvg} of 30 min`);
  setHTML("dailyFocusChart", barChart({ labels: d.students.map((s) => s.name), values: d.students.map((s) => s.focusMin), color: "auto", target: 30 }));
  setHTML("dailyRows", d.students.map((s) => `<tr>
    <td><span class="cname">${s.name}</span></td>
    <td class="num">${s.timetable}%</td>
    <td class="num">${s.quizAttended}/${s.quizTotal}</td>
    <td class="num">${s.quizAvg}%</td>
    <td class="num" style="color:${s.focusMin >= 30 ? "var(--success)" : s.focusMin >= 15 ? "var(--warn)" : "var(--danger)"};font-weight:700">${s.focusMin}m</td>
    <td class="num">${s.activeMin}m</td>
    <td class="num">${s.recovery}</td></tr>`).join(""));
}

function renderWeekly(d) {
  const a = agg(d);
  setHTML("weeklyCards", [
    mcard("Syllabus on track", a.onTrackPct + "%", `${a.onTrackN} of ${a.total}`, true),
    mcard("Avg syllabus covered", a.syllabusAvg + "%", "quarter target 25%"),
    mcard("Avg rigour stage", a.rigourAvg + " /5", "read → notes → practise → paper → ready"),
    mcard("Task completion", a.taskAvg + "%", "success metric"),
    mcard("Deadline adherence", a.deadlineAvg + "%", "success metric"),
    mcard("Time-est. accuracy", a.estAvg + "%", "success metric"),
  ].join(""));
  setHTML("weeklySyllabusSub", `cohort avg ${a.syllabusAvg}% · ${a.onTrackPct}% on track`);
  setHTML("weeklySyllabusChart", barChart({ labels: d.students.map((s) => s.name), values: d.students.map((s) => s.syllabusPct), color: "#5b5bf0", maxOverride: 100 }));
  setHTML("weeklyRigourChart", barChart({ labels: d.students.map((s) => s.name), values: d.students.map((s) => s.rigourStage), color: "auto", target: 3, maxOverride: 5, valueFmt: (v) => v.toFixed(0) }));
  setHTML("weeklyRows", d.students.map((s) => `<tr>
    <td><span class="cname">${s.name}</span></td>
    <td class="num">${s.syllabusPct}%</td>
    <td class="num">${s.onTrack ? badge("ontrack") : badge("risk")}</td>
    <td class="num">${s.rigourStage}/5</td>
    <td class="num">${s.taskCompletion}%</td>
    <td class="num">${s.deadlineAdh}%</td>
    <td class="num">${s.estAcc}%</td></tr>`).join(""));
}

function renderMonthly(d) {
  const a = agg(d);
  const att = Math.round(mean(d.students.map((s) => (s.workshopsAtt + s.podAtt + s.peerAtt + s.mentorAtt) / (2 + 2 + 1 + 1) * 100)));
  setHTML("monthlyCards", [
    mcard("Workshops held", "2 / 2", "career discovery", true),
    mcard("Pod sessions", "2 / 2", "peer group · 4 themes", false),
    mcard("Peer sessions", "advisor-matched", "learn from each other", false),
    mcard("Mentor calls", "1 / Alcovian", "curiosity-matched", false),
    mcard("Personal branding", n0(d.students.filter((s) => s.brandingDone).length) + " / 12", "shoots + clips", false),
    mcard("Avg session rating", a.ratingAvg + " / 5", "did Alcovians like it", false),
  ].join(""));
  setHTML("monthlyRatingChart", barChart({
    labels: ["Workshop", "Pod", "Peer", "Mentor", "Branding"],
    values: [a.ratingAvg, Math.max(3, a.ratingAvg - 0.2), a.ratingAvg, a.ratingAvg + 0.1, a.ratingAvg - 0.3],
    color: "#8b5cf6", maxOverride: 5, valueFmt: (v) => v.toFixed(1),
  }));
  setHTML("monthlyAttSub", `cohort ${att}% attended vs scheduled`);
  setHTML("monthlyAttBars", hbar("Workshops", Math.round(mean(d.students.map((s) => s.workshopsAtt / 2)) * 100), 100, "#5b5bf0", Math.round(mean(d.students.map((s) => s.workshopsAtt / 2)) * 100) + "%")
    + hbar("Pods", Math.round(mean(d.students.map((s) => s.podAtt / 2)) * 100), 100, "#8b5cf6", Math.round(mean(d.students.map((s) => s.podAtt / 2)) * 100) + "%")
    + hbar("Peer", Math.round(mean(d.students.map((s) => s.peerAtt / 1)) * 100), 100, "#0ea5e9", Math.round(mean(d.students.map((s) => s.peerAtt / 1)) * 100) + "%")
    + hbar("Mentor", Math.round(mean(d.students.map((s) => s.mentorAtt / 1)) * 100), 100, "#12a150", Math.round(mean(d.students.map((s) => s.mentorAtt / 1)) * 100) + "%"));
  setHTML("monthlyRows", d.students.map((s) => `<tr>
    <td><span class="cname">${s.name}</span></td>
    <td class="num">${s.workshopsAtt}/${s.workshopsTotal}</td>
    <td class="num">${s.podAtt}/${s.podTotal}</td>
    <td class="num">${s.peerAtt}/${s.peerTotal}</td>
    <td class="num">${s.mentorAtt}/${s.mentorTotal}</td>
    <td class="num">${s.brandingDone ? "Yes" : "—"}</td>
    <td class="num">${s.rating.toFixed(1)}</td></tr>`).join(""));
}

function renderQuarterly(d) {
  const a = agg(d);
  setHTML("quarterlyCards", [
    mcard("Podcast hosted", `${a.podcasts} / ${a.total}`, "industry veterans", false),
    mcard("Competition prep", `${a.competitions} / ${a.total}`, "quarterly", false),
    mcard("Parent-child bonding", `${a.parentChild} / ${a.total}`, "1 workshop / quarter", false),
    mcard("Out-of-city", `${a.outOfCity} / ${a.total}`, "memorable experience", false),
    mcard("Career roadmap done", `${a.careerDone} / ${a.total}`, "binary outcome", true),
    mcard("Avg theme progress", Math.round((a.socialAvg + a.entrepAvg) / 2) + "%", "social work + entrepreneurship", false),
  ].join(""));
  setHTML("themeSub", `social ${a.socialAvg}% · entrepreneurship ${a.entrepAvg}%`);
  setHTML("themeChart", groupedBarChart({
    labels: d.students.map((s) => s.name),
    series: [
      { name: "Social work", color: "#0ea5e9", values: d.students.map((s) => s.socialWork) },
      { name: "Entrepreneurship", color: "#8b5cf6", values: d.students.map((s) => s.entrep) },
    ], valueFmt: (v) => v.toFixed(0),
  }));
  const cov = (n) => Math.round((n / a.total) * 100);
  setHTML("quarterlyExpBars", hbar("Podcast", cov(a.podcasts), 100, "#5b5bf0", cov(a.podcasts) + "%")
    + hbar("Competition prep", cov(a.competitions), 100, "#8b5cf6", cov(a.competitions) + "%")
    + hbar("Parent-child bonding", cov(a.parentChild), 100, "#0ea5e9", cov(a.parentChild) + "%")
    + hbar("Out-of-city", cov(a.outOfCity), 100, "#12a150", cov(a.outOfCity) + "%"));
  setHTML("quarterlyRows", d.students.map((s) => `<tr>
    <td><span class="cname">${s.name}</span></td>
    <td class="num">${s.podcast ? "Yes" : "—"}</td>
    <td class="num">${s.competition ? "Yes" : "—"}</td>
    <td class="num">${s.parentChild ? "Yes" : "—"}</td>
    <td class="num">${s.outOfCity ? "Yes" : "—"}</td>
    <td class="num">${s.socialWork}%</td>
    <td class="num">${s.entrep}%</td>
    <td class="num">${s.career ? badge("ontrack") : badge("risk")}</td>
    <td class="num">${s.personal}%</td>
    <td class="num">${s.onTrack ? badge("ontrack") : badge("risk")}</td></tr>`).join(""));
}

let rosterFilter = "all";
let journeyView = "student";
function renderJourney(which) {
  which = which || journeyView;
  const stages = which === "parent" ? PARENT_STAGES : STUDENT_STAGES;
  const key = which === "parent" ? "parentStage" : "stage";
  const S = DATA.students;
  const reached = stages.map((_, i) => S.filter((s) => s[key] >= i).length);
  const max = S.length;
  setHTML("journeyTitle", which === "parent" ? "Parent journey" : "Alcovian journey");
  setHTML("journeySteps", `<div class="stepper">` + stages.map((st, i) => {
    const n = reached[i];
    const prev = i === 0 ? n : reached[i - 1];
    const conv = i === 0 ? null : (prev ? Math.round((n / prev) * 100) : 0);
    const pill = conv === null ? "" : `<span class="fpill ${conv >= 80 ? "good" : conv >= 50 ? "mid" : "bad"}">${conv}%</span>`;
    return `<div class="step${n > 0 ? " reached" : ""}">
      <div class="idx">${i + 1}</div>
      <div><div class="sname">${st.name}</div><div class="sdesc">${st.desc}</div><span class="sowner">${st.owner}</span></div>
      <div class="scount"><div class="n">${n}</div><div class="cap">of ${max}</div></div>
      <div class="sconv">${pill}</div>
    </div>`;
  }).join("") + `</div>`);
  setHTML("journeySub", `${S.length} Alcovians · avg ${Math.round(mean(S.map((s) => s.daysIn)))} days in program`);
  setHTML("journeyRows", S.map((s) => `<tr data-drill="student:${s.name}">
    <td><span class="cname">${s.name}</span> <span style="color:var(--faint)">↗</span></td>
    <td class="num">${s.daysIn}d</td>
    <td>${STUDENT_STAGES[Math.min(s.stage, STUDENT_STAGES.length - 1)].name}</td>
    <td>${PARENT_STAGES[Math.min(s.parentStage, PARENT_STAGES.length - 1)].name}</td>
    <td>${badge(s.status)}</td></tr>`).join(""));
}
function renderRoster() {
  const S = DATA.students.filter((s) => rosterFilter === "all" || s.status === rosterFilter);
  setHTML("rosterRows", S.map((s) => `<tr data-drill="student:${s.name}">
    <td><span class="cname">${s.name}</span> <span style="color:var(--faint)">↗</span></td>
    <td class="num">${s.engagement}</td>
    <td class="num">${s.focusMin}m</td>
    <td class="num">${s.syllabusPct}%</td>
    <td class="num">${s.rigourStage}/5</td>
    <td class="num">${s.roadmap}%</td>
    <td class="num">${s.participation}%</td>
    <td>${badge(s.status)}</td></tr>`).join(""));
}

/* ---------- drill: single Alcovian ---------- */
function studentDrill(name) {
  const s = DATA.students.find((x) => x.name === name);
  if (!s) return { title: name, body: "" };
  const row = (k, v) => `<div class="stat-row"><span class="sr-name">${k}</span><span class="sr-val">${v}</span></div>`;
  return {
    title: s.name, sub: "Full journey · current period",
    body: `${badge(s.status)}
      <div class="drill-h">Daily</div>${row("Timetable adherence", s.timetable + "%")}${row("Daily quizzes", `${s.quizAttended}/${s.quizTotal} · avg ${s.quizAvg}%`)}${row("Focus time", `${s.focusMin} / 30 min`)}${row("Active minutes", s.activeMin + " min/day")}${row("Recovery", s.recovery + " /100")}
      <div class="drill-h">Weekly · academic</div>${row("Syllabus completion", s.syllabusPct + "%")}${row("Chapter rigour", s.rigourStage + " /5")}${row("Task completion", s.taskCompletion + "%")}${row("Deadline adherence", s.deadlineAdh + "%")}${row("Time-estimation accuracy", s.estAcc + "%")}
      <div class="drill-h">Monthly · career</div>${row("Workshops", `${s.workshopsAtt}/${s.workshopsTotal}`)}${row("Pod / Peer / Mentor", `${s.podAtt}/${s.podTotal} · ${s.peerAtt}/${s.peerTotal} · ${s.mentorAtt}/${s.mentorTotal}`)}${row("Personal branding", s.brandingDone ? "Done" : "—")}${row("Avg session rating", s.rating.toFixed(1) + " /5")}
      <div class="drill-h">Quarterly · roadmaps</div>${row("Podcast", s.podcast ? "Hosted" : "—")}${row("Competition prep", s.competition ? "Prepared" : "—")}${row("Career roadmap", s.career ? "Done" : "Pending")}${row("Personal roadmap", s.personal + "% milestones")}${row("Academic roadmap", s.onTrack ? "On track" : "Off track")}`,
  };
}

/* ---------- modal ---------- */
const DRILLS = {
  /* placeholder so generic opener works */ 
};
function openDrill(key) {
  let def;
  if (key.startsWith("student:")) def = studentDrill(key.slice(8));
  else def = DRILLS[key];
  if (!def) return;
  const { title, sub, body } = def;
  setHTML("modalTitle", `${title}${sub ? `<div class="msub">${sub}</div>` : ""}`);
  setHTML("modalBody", body);
  document.getElementById("modal").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeDrill() { document.getElementById("modal").hidden = true; document.body.style.overflow = ""; }

/* ---------- tabs + boot ---------- */
const PAGE_TITLES = { overview: "Journey Scorecard", journey: "Journey · Alcovian & Parent", daily: "Daily Rigour", weekly: "Weekly · Academic Roadmap", monthly: "Monthly · Career Discovery", quarterly: "Quarterly · Themes & Roadmaps", students: "Students", approach: "Approach" };
function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === name));
  document.querySelectorAll("#nav .navlink").forEach((b) => b.classList.toggle("active", b.dataset.page === name));
  const h = document.getElementById("pageHeading"); if (h) h.textContent = PAGE_TITLES[name] || "Student Progress";
  window.scrollTo({ top: 0 });
}
function renderAll() {
  renderOverview(DATA);
  renderJourney(journeyView);
  renderDaily(DATA);
  renderWeekly(DATA);
  renderMonthly(DATA);
  renderQuarterly(DATA);
  renderRoster();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  showPage("overview");

  document.querySelectorAll("#nav .navlink").forEach((b) => b.addEventListener("click", () => showPage(b.dataset.page)));

  document.getElementById("rosterFilter").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    rosterFilter = btn.dataset.f;
    document.querySelectorAll("#rosterFilter button").forEach((b) => b.classList.toggle("active", b === btn));
    renderRoster();
  });

  document.getElementById("journeyToggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    journeyView = btn.dataset.j;
    document.querySelectorAll("#journeyToggle button").forEach((b) => b.classList.toggle("active", b === btn));
    renderJourney(journeyView);
  });

  document.getElementById("cohort").addEventListener("change", (e) => {
    const v = e.target.value;
    if (v === "top") { DATA = generate(); DATA.students.sort((a, b) => b.engagement - a.engagement); }
    else if (v === "risk") { DATA = generate(); DATA.students.sort((a, b) => a.engagement - b.engagement); }
    else { DATA = generate(); }
    renderAll(); showPage("students");
  });

  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("themeBtn").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
  });
  document.addEventListener("click", (e) => {
    const dr = e.target.closest("[data-drill]");
    if (dr && !e.target.closest("#modal")) { openDrill(dr.dataset.drill); return; }
    if (e.target.closest("[data-close]")) closeDrill();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrill(); });

  const pad = (x) => String(x).padStart(2, "0"); const now = new Date();
  const lu = document.getElementById("lastUpdated");
  if (lu) lu.textContent = `12 Alcovians · dummy data · ${pad(now.getHours())}:${pad(now.getMinutes())}`;
});

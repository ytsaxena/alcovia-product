/* ============================================================
   Alcovia · Unified Persona Scorecard
   Blends funnel (ClickUp) · call outcomes (Smallest.ai) ·
   automation health (N8N) · product (app) · ads · payments.
   ============================================================ */

const IN = new Intl.NumberFormat("en-IN");
const setHTML = (id, h) => { const el = document.getElementById(id); if (el) el.innerHTML = h; };
const pct = (x, d = 0) => x.toFixed(d) + "%";

const PERIODS = { "7d": { label: "Last 7 days", f: 0.25 }, "30d": { label: "Last 30 days", f: 1 }, "qtd": { label: "This quarter", f: 3 } };

function fmtVal(n, unit) {
  if (unit === "₹") return "₹" + IN.format(Math.round(n));
  if (unit === "₹L") return "₹" + (n / 100000).toFixed(1) + "L";
  if (unit === "%") return (n % 1 ? n.toFixed(1) : n.toFixed(0)) + "%";
  if (unit === "×") return n.toFixed(1) + "×";
  if (unit === "h") return n.toFixed(1) + "h";
  if (unit === "d") return Math.round(n) + "d";
  return IN.format(Math.round(n));
}
function ragOf(cur, target, dir) {
  if (dir === "down") return cur <= target ? "good" : cur <= target * 1.15 ? "warn" : "bad";
  return cur >= target ? "good" : cur >= target * 0.85 ? "warn" : "bad";
}
const RAGTXT = { good: "Healthy", warn: "Watch", bad: "Act" };
function dot(rag) { return `<span class="badge ${rag === "good" ? "scale" : rag === "warn" ? "refresh" : "drop"}">${RAGTXT[rag]}</span>`; }

/* ---------- north-stars ---------- */
const NORTH = [
  { name: "Conversion (Lead → Paid)", base: 5.7, target: 6, unit: "%", dir: "up", owner: "Shared" },
  { name: "CAC", base: 6800, target: 5500, unit: "₹", dir: "down", owner: "Marketing" },
  { name: "LTV : CAC", base: 3.2, target: 3, unit: "×", dir: "up", owner: "Shared" },
  { name: "Retention (D30)", base: 62, target: 70, unit: "%", dir: "up", owner: "Product" },
  { name: "NPS", base: 41, target: 50, unit: "", dir: "up", owner: "Product" },
];

/* ---------- persona KPI sets ---------- */
const SALES = [
  { name: "Leads contacted", src: "ClickUp", base: 412, target: 450, unit: "", dir: "up", type: "volume" },
  { name: "Lead → Won", src: "ClickUp", base: 18, target: 20, unit: "%", dir: "up" },
  { name: "Win rate", src: "ClickUp", base: 34, target: 40, unit: "%", dir: "up" },
  { name: "Show-up rate", src: "Smallest.ai", base: 71, target: 75, unit: "%", dir: "up" },
  { name: "Touchpoints / lead", src: "ClickUp", base: 4.1, target: 4, unit: "", dir: "up" },
  { name: "First-response time", src: "ClickUp/N8N", base: 2.4, target: 2, unit: "h", dir: "down" },
  { name: "Revenue / rep", src: "Razorpay", base: 420000, target: 450000, unit: "₹L", dir: "up", type: "volume" },
  { name: "Revenue / lead", src: "Razorpay", base: 1850, target: 2000, unit: "₹", dir: "up" },
  { name: "Renewal rate", src: "ClickUp", base: 62, target: 70, unit: "%", dir: "up" },
  { name: "Sales-cycle length", src: "ClickUp", base: 21, target: 18, unit: "d", dir: "down" },
  { name: "Quota attainment", src: "ClickUp", base: 84, target: 100, unit: "%", dir: "up" },
];
const MARKETING = [
  { name: "Leads by source", src: "ClickUp/Meta", base: 4, target: 4, unit: " ch", dir: "up" },
  { name: "CPL", src: "Ads/Razorpay", base: 142, target: 150, unit: "₹", dir: "down" },
  { name: "MQL rate", src: "ClickUp", base: 41, target: 40, unit: "%", dir: "up" },
  { name: "Nurture → conversion", src: "ClickUp/N8N", base: 9, target: 12, unit: "%", dir: "up" },
  { name: "Open / click / reply", src: "Messaging", base: 19, target: 21, unit: "%", dir: "up" },
  { name: "Nurture completion", src: "N8N", base: 73, target: 80, unit: "%", dir: "up" },
  { name: "CAC", src: "Ads/Razorpay", base: 6800, target: 5500, unit: "₹", dir: "down" },
  { name: "ROAS", src: "Ads/Razorpay", base: 2.9, target: 3.5, unit: "×", dir: "up" },
  { name: "Dormant lead %", src: "ClickUp", base: 27, target: 15, unit: "%", dir: "down" },
  { name: "Channel ROI", src: "Ads/Razorpay", base: 2.1, target: 2.5, unit: "×", dir: "up" },
];
const PRODUCT = [
  { name: "Activation", src: "App", base: 64, target: 70, unit: "%", dir: "up" },
  { name: "Trial → paid", src: "App/Razorpay", base: 38, target: 40, unit: "%", dir: "up" },
  { name: "WAU (of ~20)", src: "App", base: 13, target: 18, unit: "", dir: "up" },
  { name: "Feature adoption (Realm)", src: "App", base: 65, target: 85, unit: "%", dir: "up" },
  { name: "Session length", src: "App", base: 2.15, target: 30, unit: " min", dir: "up" },
  { name: "ARPU", src: "App/Razorpay", base: 1450, target: 1600, unit: "₹", dir: "up" },
  { name: "Expansion revenue", src: "Razorpay", base: 0, target: 50000, unit: "₹", dir: "up" },
  { name: "D30 retention", src: "App", base: 62, target: 70, unit: "%", dir: "up" },
  { name: "Churn", src: "App", base: 11, target: 8, unit: "%", dir: "down" },
  { name: "NPS", src: "Survey", base: 41, target: 50, unit: "", dir: "up" },
  { name: "Time-to-first-value", src: "App", base: 2.3, target: 3, unit: "d", dir: "down" },
];

/* ---------- matrix (persona × category) ---------- */
const MATRIX = [
  { cat: "Top of funnel", sales: ["Leads contacted", "412 / wk", "warn"], marketing: ["By source · CPL", "4 ch · ₹142", "good"], product: ["—", "", "na"] },
  { cat: "Conversion", sales: ["Win rate · show-up", "34% · 71%", "warn"], marketing: ["MQL · nurture→conv", "41% · 9%", "warn"], product: ["Activation · trial→paid", "64% · 38%", "warn"] },
  { cat: "Engagement", sales: ["1st response · touches", "2.4h · 4.1", "good"], marketing: ["Open / click / reply", "38/7/12%", "warn"], product: ["DAU/WAU/MAU", "6 / 13 / 20", "warn"] },
  { cat: "Revenue", sales: ["Rev/rep · renewals", "₹4.2L · 58%", "good"], marketing: ["CAC · ROAS", "₹6.8k · 2.9×", "warn"], product: ["ARPU", "₹1,450", "good"] },
  { cat: "Retention", sales: ["Renewal rate", "62%", "warn"], marketing: ["Dormant lead %", "27%", "bad"], product: ["D30 · churn", "62% · 11%", "warn"] },
  { cat: "Efficiency", sales: ["Cycle · quota", "21d · 84%", "warn"], marketing: ["Cost/lead · ROI", "₹142 · 2.1×", "warn"], product: ["Time-to-first-value", "2.3d", "good"] },
];

/* ---------- system health ---------- */
const SOURCES = [
  { name: "ClickUp", role: "CRM · funnel · comms", sync: "Every 15 min", fresh: "3 min", complete: 96, status: "good" },
  { name: "Smallest.ai", role: "AI calls · outcomes", sync: "Hourly", fresh: "42 min", complete: 78, status: "warn" },
  { name: "N8N", role: "Automation / orchestration", sync: "Real-time", fresh: "live", complete: 100, status: "good" },
  { name: "App analytics", role: "Product event stream", sync: "Streaming", fresh: "live", complete: 88, status: "warn" },
  { name: "Meta Ads", role: "Ad performance", sync: "Daily 6am", fresh: "6 h", complete: 100, status: "good" },
  { name: "Razorpay", role: "Payments", sync: "Every 30 min", fresh: "18 min", complete: 99, status: "good" },
];
const FLOWS = [
  { name: "Funnel sync", feeds: "Sales · Marketing", runs: 2880, failed: 12, uptime: 99.6, status: "good" },
  { name: "Call outcome tagging", feeds: "Sales · Marketing", runs: 720, failed: 41, uptime: 94.3, status: "warn" },
  { name: "Lead nurture sequences", feeds: "Marketing", runs: 1440, failed: 6, uptime: 99.6, status: "good" },
  { name: "Deadline alerts → WA/SMS", feeds: "Sales · Product", runs: 540, failed: 3, uptime: 99.4, status: "good" },
  { name: "Payment reconcile", feeds: "Sales", runs: 1440, failed: 0, uptime: 100, status: "good" },
  { name: "App event → warehouse", feeds: "Product", runs: 43200, failed: 210, uptime: 99.5, status: "good" },
];

/* ---------- render ---------- */
function scale(base, type, f) { return type === "volume" ? base * f : base; }

function kpiRow(k, f) {
  const cur = scale(k.base, k.type, f);
  const rag = ragOf(cur, k.target, k.dir);
  return `<tr><td><span class="cname">${k.name}</span></td><td class="muted">${k.src}</td>
    <td class="num"><b>${fmtVal(cur, k.unit)}</b></td><td class="num">${fmtVal(k.target, k.unit)}</td><td>${dot(rag)}</td></tr>`;
}
function kpiCard(k, f, hl) {
  const cur = scale(k.base, k.type, f);
  const rag = ragOf(cur, k.target, k.dir);
  const c = rag === "good" ? "var(--success)" : rag === "warn" ? "var(--warn)" : "var(--danger)";
  return `<div class="mcard${hl ? " hl" : ""}"><div class="mlab">${k.name}</div>
    <div class="mval" style="color:${c}">${fmtVal(cur, k.unit)}</div>
    <div class="mmeta">target ${fmtVal(k.target, k.unit)} · ${k.src}</div></div>`;
}

function render(pe) {
  const f = PERIODS[pe].f;

  /* north-stars */
  setHTML("northStars", NORTH.map((k) => {
    const rag = ragOf(k.base, k.target, k.dir);
    const c = rag === "good" ? "var(--success)" : rag === "warn" ? "var(--warn)" : "var(--danger)";
    return `<div class="kpi"><div class="k-label">${k.name}</div><div class="k-val" style="color:${c}">${fmtVal(k.base, k.unit)}</div>
      <div class="k-sub">target ${fmtVal(k.target, k.unit)} · ${k.owner} ${dot(rag)}</div></div>`;
  }).join(""));

  /* matrix */
  setHTML("matrixRows", MATRIX.map((r) => `<tr>
    <td><span class="cname">${r.cat}</span></td>
    ${["sales", "marketing", "product"].map((p) => {
      const cell = r[p];
      if (cell[2] === "na") return `<td class="muted">—</td>`;
      return `<td><div style="display:flex;gap:8px;align-items:center"><span>${cell[0]}<br><b>${cell[1]}</b></span>${dot(cell[2])}</div></td>`;
    }).join("")}
  </tr>`).join(""));

  /* persona tabs */
  setHTML("salesCards", SALES.slice(0, 6).map((k, i) => kpiCard(k, f, i === 3)).join(""));
  setHTML("salesTable", SALES.map((k) => kpiRow(k, f)).join(""));
  setHTML("marketingCards", MARKETING.slice(0, 6).map((k, i) => kpiCard(k, f, i === 6)).join(""));
  setHTML("marketingTable", MARKETING.map((k) => kpiRow(k, f)).join(""));
  setHTML("productCards", PRODUCT.slice(0, 6).map((k, i) => kpiCard(k, f, i === 4)).join(""));
  setHTML("productTable", PRODUCT.map((k) => kpiRow(k, f)).join(""));

  /* data health */
  setHTML("sourceCards", SOURCES.map((s) => `<div class="mcard"><div class="mlab">${s.name} ${dot(s.status)}</div>
    <div class="mval" style="font-size:16px">${s.complete}% complete</div>
    <div class="mmeta">${s.role} · sync ${s.sync} · fresh ${s.fresh}</div></div>`).join(""));
  setHTML("flowRows", FLOWS.map((x) => `<tr><td><span class="cname">${x.name}</span></td><td class="muted">${x.feeds}</td>
    <td class="num">${IN.format(x.runs)}</td><td class="num" style="color:${x.failed > 20 ? "var(--danger)" : "inherit"}">${x.failed}</td>
    <td class="num">${x.uptime}%</td><td>${dot(x.status)}</td></tr>`).join(""));

  setHTML("ovInsight", `<span class="ico">i</span><div><b>Blended read:</b> marketing efficiency (CAC, dormant leads) and product engagement (session length, adoption) are the two red zones;
    sales conversion is stable but show-up (71%) drags win rate. Everything here is stitched from ClickUp (funnel), Smallest.ai (show-up), N8N (automation) and app events — the unification the brief flags as the biggest gap.</div>`);
  setHTML("gapInsight", `<span class="ico">!</span><div><b>The gap:</b> metrics live across ClickUp / Smallest.ai / N8N with no single scorecard.
    Smallest.ai call-outcome tagging is only <b>78% complete</b> (41 failed syncs) — auto-computing show-up needs structured <code>set/attended/no-show</code> events.
    Fix the two amber sources + add app feature-event tracking and this whole scorecard runs with <b>zero manual exports</b>.</div>`);
}

/* ---------- tabs ---------- */
const TITLES = { overview: "Company Scorecard", sales: "Sales", marketing: "Marketing", product: "Product", data: "Data & Automation" };
function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === name));
  document.querySelectorAll("#nav .navlink").forEach((b) => b.classList.toggle("active", b.dataset.page === name));
  const h = document.getElementById("pageHeading"); if (h) h.textContent = TITLES[name] || "Scorecard";
  window.scrollTo({ top: 0 });
}

document.addEventListener("DOMContentLoaded", () => {
  const period = document.getElementById("period");
  render(period.value);
  showPage("overview");
  period.addEventListener("change", () => render(period.value));
  document.querySelectorAll("#nav .navlink").forEach((b) => b.addEventListener("click", () => showPage(b.dataset.page)));
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("themeBtn").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
  });
});

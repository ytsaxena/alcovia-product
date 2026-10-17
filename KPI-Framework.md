# Alcovia — KPI Framework & Metric Dictionary

**Owner:** Product, Systems & Analytics Lead
**Purpose:** one agreed source of truth for *what* we measure, *how* it's calculated, *where* it lives, and *who* owns it — so every dashboard is auditable and every OKR has a scoreboard.
**Scope:** student app + GTM motion. Parent/advisor/counsellor/admin product surfaces are out of scope.

---

## 0. Principles

1. **One metric, one definition, one owner.** No re-deriving numbers in separate sheets.
2. **Every KPI answers a decision.** If no action changes when it moves, it's vanity — drop it.
3. **Automate the collection, not the judgement.** N8N moves data; humans interpret it.
4. **Inputs before outputs.** Track leading indicators (show-up rate, feature *reused*) not just lagging ones (revenue, churn).
5. **Small-n honesty.** At ~20 active students, report rates with the raw counts (`5/11`, not just `45%`).

---

## 1. Personas & north-stars

| Persona | Job | North-star | Supporting stars |
|---|---|---|---|
| **Sales** | Convert qualified leads → enrolled parents | **Win rate** *(show-up rate as leading)* | Sales-cycle length, quota attainment, renewal rate |
| **Marketing** | Generate & nurture leads profitably | **CAC** *(with LTV:CAC)* | CPL, ROAS, channel ROI |
| **Product** | Activate, engage, retain students | **Retention** *(trial→paid as leading)* | Activation, feature adoption, NPS |

**Shared north-stars (company level):** `conversion rate · CAC · LTV:CAC · retention · NPS`

---

## 2. Metric dictionary

Legend — **Src** = source system · **Freq** = reporting cadence · **Owner** = accountable persona.

### 2.1 Sales

| KPI | Definition | Formula | Src | Freq | Owner |
|---|---|---|---|---|---|
| Leads contacted | Leads with ≥1 outbound touch | contacted ÷ assigned | ClickUp | Daily | Sales |
| Lead → Won | % of leads that enrol & pay | won ÷ total leads | ClickUp + Razorpay | Weekly | Sales |
| Win rate | Close rate from qualified | won ÷ qualified | ClickUp | Weekly | Sales |
| Show-up rate | Discovery calls actually attended | attended ÷ set | Smallest.ai | Weekly | Sales |
| Touchpoints | Avg touches before win | total touches ÷ won | ClickUp | Weekly | Sales |
| First-response time | Median lead-in → first contact | median(in − t1) | ClickUp / N8N | Daily | Sales |
| Revenue / rep | Revenue per salesperson | revenue ÷ active reps | Razorpay | Monthly | Sales |
| Revenue / lead | Yield per lead | revenue ÷ leads | Razorpay + ClickUp | Monthly | Sales |
| Renewal rate | Trials/full programs renewed | renewed ÷ due | ClickUp + Razorpay | Monthly | Sales |
| Sales-cycle length | Days lead → paid | avg(paid − lead-in) | ClickUp | Monthly | Sales |
| Quota attainment | Actual ÷ target | achieved ÷ quota | ClickUp | Monthly | Sales |

### 2.2 Marketing

| KPI | Definition | Formula | Src | Freq | Owner |
|---|---|---|---|---|---|
| Leads by source | Volume split by channel | count by source | ClickUp / Meta ads | Weekly | Marketing |
| CPL | Cost per lead | spend ÷ leads | Ads + Razorpay | Weekly | Marketing |
| MQL rate | Leads that qualify | MQL ÷ leads | ClickUp | Weekly | Marketing |
| Nurture → conversion | Nurtured leads that convert | converted ÷ nurtured | ClickUp / N8N | Monthly | Marketing |
| Open / click / reply | Messaging engagement | opens ÷ sent, etc. | Email/WA tooling | Weekly | Marketing |
| Nurture completion | % finishing nurture sequence | completed ÷ enrolled | N8N | Monthly | Marketing |
| CAC | Cost to acquire a paying user | total S&M spend ÷ new paid | Ads + Razorpay | Monthly | Marketing |
| ROAS | Return on ad spend | revenue ÷ ad spend | Ads + Razorpay | Weekly | Marketing |
| Dormant lead % | Leads with no activity in 30d | dormant ÷ total leads | ClickUp | Monthly | Marketing |
| Channel ROI | Return per channel | (rev − cost) ÷ cost | Ads + Razorpay | Monthly | Marketing |

### 2.3 Product (student app)

| KPI | Definition | Formula | Src | Freq | Owner |
|---|---|---|---|---|---|
| Activation | Installed → meaningful first action | activated ÷ installs | App analytics | Weekly | Product |
| Trial → paid | Trials converting to full program | paid ÷ trials | App + Razorpay | Monthly | Product |
| DAU / WAU / MAU | Active users per window | unique actives | App analytics | Daily/Weekly/Monthly | Product |
| Feature adoption | Tried → Reused → Habitual per feature | range of active students per stage | App analytics | Weekly | Product |
| Session length | Median time in app | median session duration | App analytics | Weekly | Product |
| ARPU | Revenue per active user | revenue ÷ active users | App + Razorpay | Monthly | Product |
| Expansion revenue | Upsell / add-on revenue | Σ upgrades | Razorpay | Monthly | Product |
| D30 / D90 retention | Still active at day 30/90 | active at Dn ÷ cohort | App analytics | Monthly | Product |
| Churn | Users lost per period | lost ÷ start-of-period | App analytics | Monthly | Product |
| NPS | Net promoter score | %promoters − %detractors | Survey | Quarterly | Product |
| Time-to-first-value | Install → first aha moment | median(aha − install) | App analytics | Weekly | Product |

---

## 3. System → Persona map

| System | Role | Feeds |
|---|---|---|
| **ClickUp** | CRM, funnel, comms log | Sales (contacted, win rate, cycle) · Marketing (lead source, MQL, dormant) |
| **Smallest.ai** | AI call scheduling & outcomes | Sales + Marketing (show-up rate, call outcomes) |
| **N8N** | Automation / orchestration layer | Cross-cutting ops (E, alerts, data sync, Product support) |
| **App analytics** | Product event stream | Product (DAU/WAU, adoption, retention, activation) |
| **Razorpay** | Payments | Revenue (Sales · Marketing · Product) |

**Reference data flow**

```
ClickUp ─┐
Smallest.ai ─┼─► N8N (extract · transform · schedule) ─► Warehouse/Sheet ─► Dashboards
Meta Ads ─┤                                                    │
App events ─┤                                                  └─► N8N alert rules (threshold breaches)
Razorpay ─┘
```

---

## 4. Cadence & governance

| Ritual | Who | Metrics reviewed |
|---|---|---|
| Daily standup (15m) | Sales + Marketing | Leads contacted, first-response time, show-up |
| Weekly GTM review | Sales · Marketing · Product | Funnel by stage, CAC, feature adoption, retention |
| Monthly business review | All + founder | Revenue vs target, LTV:CAC, churn, NPS |
| Quarterly OKR review | All | North-stars + OKR completion, re-scope |

**Alert rules (N8N):** show-up rate < 70% · CPL +25% WoW · 7-day active users below floor · any tier-1 feature with 0 habitual users.

---

## 5. Instrumentation gaps (what to build to close the "biggest gap")

The metrics currently live across ClickUp / N8N / Smallest.ai with **no unified dashboard**. Close with:

1. **Feature event tracking** in the app — emit `feature_opened` / `feature_reused` events per student (enables the Tried→Reused→Habitual funnel and tier-1 alerts).
2. **Call-outcome tagging** in Smallest.ai — structured `set / attended / no-show / reschedule` so show-up computes automatically.
3. **Ad-account → N8N** — pull Meta metrics nightly for CPL/CTR/ROAS without manual exports.
4. **Payment reconciliation** — Razorpay → ClickUp so Lead→Won and renewals auto-update.
5. **One blended scorecard** — the unified view that joins funnel (ClickUp), automation health (N8N), call outcomes (Smallest.ai) and product (app) — see the *Unified Persona Scorecard* dashboard.

---

## 6. What "good" looks like (targets to set with founders)

| KPI | Current | Target |
|---|---|---|
| Avg session length | 2.15 min | 30 min |
| WAU (of ~20) | 11–17 | 18+ |
| Dormant (2-week) | 7 students | ≤ 3 |
| Show-up rate | — | ≥ 75% |
| Tier-1 feature habitual users | 0 (Wellness, Streak, Rankings, Goals) | ≥ 8 |
| Trial → paid | — | ≥ 40% |

*Current figures from the app brief (45-day / ~20-student sample).*

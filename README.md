# 🧭 SplitCost

**Know what your split actually costs.**

A free, private financial recovery toolkit for people facing — or recovering from — divorce. Built from real questions people ask in personal-finance communities: *"We can't afford a divorce... but we are miserable."*

**🔗 Live site: [sidequestdigital.github.io/splitcost](https://sidequestdigital.github.io/splitcost/)**

---

## Why

When relationships end, the hardest question is usually the first one: **can I afford this?**

Lawyers won't give numbers away in free consults. Blog posts hand out worksheets. Almost nothing just tells you what splitting does to your money, month by month.

SplitCost gives you that number — privately, instantly, and for free.

## What's inside

| Tool | What it does |
|---|---|
| 💰 **Cost-of-Split Calculator** | Compares *staying* vs *splitting* over 12 months with your real inputs. Auto-fills sensible estimates when you don't know a figure yet. Includes legal-cost tiers from DIY (~$500) to high-conflict ($30k+). |
| ✅ **Recovery Roadmap** | 8 ordered steps from "freeze joint credit" to "get one real number on legal cost" — with tap-to-check progress saved in your browser. |
| 📄 **Paperwork Navigator** | Plain-language map of the financial paperwork most divorces involve: affidavits, asset worksheets, settlement agreements. |
| 💳 **Debt Triage** | Ranks your payoffs avalanche-style (highest rate first) or snowball-style (smallest balance first), with rough interest estimates. |

## Privacy by architecture

**Your numbers never leave your browser.**

- No accounts. No sign-up. No analytics. No server.
- Every calculation runs client-side in vanilla JavaScript.
- Roadmap progress is stored only in your own browser's `localStorage`.
- You can verify it yourself — read `app.js`, or open DevTools → Network and watch nothing leave.

For an audience mid-divorce, that's not a nice-to-have. It's the point.

## Tech

Deliberately boring:

- Static HTML + CSS + vanilla JS. No frameworks, no build step, no dependencies.
- Hosted free on **GitHub Pages** straight off `main`.
- Total payload: ~23 KB before fonts/browser defaults.

### Run locally

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

(Any static file server works. Opening `index.html` directly also works in most browsers.)

## Honest limits

- Estimates are only as good as your inputs — support orders, taxes and local costs vary enormously.
- This is **education, not legal or financial advice**. For decisions that matter, get a professional to check your numbers.
- The debt triage ranks payoff order; it doesn't replace your lender's amortization schedule.

## Status

**v0.1** — first public build.

Roadmap ideas: jurisdiction-aware cost presets, printable one-page summary, shareable scenario links (still client-side), multilingual support.

## License

MIT — see [LICENSE](LICENSE).

---

<p align="center">Built with 🛠 by <a href="https://github.com/SideQuestDigital">Side Quest Digital</a></p>

/* SplitCost v0.1 — all client-side, no network calls. */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const num = (id) => { const v = parseFloat($(id).value); return isNaN(v) || v < 0 ? 0 : v; };
  const money = (n) => (n < 0 ? "-" : "") + "$" + Math.abs(Math.round(n)).toLocaleString();
  const monthName = (i) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i];

  /* ---------- CALCULATOR ---------- */
  $("calcBtn").addEventListener("click", function () {
    const incMe = num("incMe"), incPartner = num("incPartner");
    const housing = num("housing"), utilities = num("utilities");
    const other = num("otherLiving"), childcare = num("childcare");

    const curIncome = incMe + incPartner;
    const curExpenses = housing + utilities + other + childcare;
    const staySurplus = curIncome - curExpenses;

    // Defaults if user leaves the split-side blank
    const utilEach = $("utilEach").value === "" ? Math.round(utilities * 0.6) : num("utilEach");
    const otherEach = $("otherEach").value === "" ? Math.round(other * 0.75) : num("otherEach");
    const rentMe = $("rentMe").value === "" ? Math.round(housing / 2) : num("rentMe");
    const rentPartner = $("rentPartner").value === "" ? Math.round(housing / 2) : num("rentPartner");

    const splitMonthlyPer = rentMe + utilEach + otherEach + childcare / 2;
    const splitMonthlyBoth = (rentMe + rentPartner) + utilEach * 2 + otherEach * 2 + childcare;
    const splitDelta = splitMonthlyBoth - curExpenses; // extra monthly cost for two households
    const legal = num("legalTier");
    const yearOne = splitDelta * 12 + legal;

    // Verdict
    const v = $("verdict");
    if (splitDelta <= 0) {
      v.textContent = "Splitting costs about the same or less per month — your main cost is the one-time legal fee (" + money(legal) + ").";
      v.className = "verdict";
    } else {
      v.textContent = "Splitting costs roughly " + money(splitDelta) + " more per month — and about " + money(yearOne) + " in year one including legal fees.";
      v.className = "verdict warn";
    }

    $("staySurplus").textContent = money(staySurplus);
    $("splitDelta").textContent = "+" + money(splitDelta);
    $("yearOne").textContent = money(yearOne);

    // 12-month table
    let rows = "<tr><th>Month</th><th>Staying surplus</th><th>Split surplus (you)</th><th>Cumulative extra cost</th></tr>";
    let cum = 0;
    for (let i = 0; i < 12; i++) {
      cum += splitDelta;
      const youIncome = incMe; // you alone after split
      const youExpenses = splitMonthlyPer;
      const youSurplus = youIncome - youExpenses - (i === 0 ? legal / 12 : 0);
      rows += "<tr><td>" + monthName(i) + "</td><td>" + money(staySurplus) + "</td><td>" + money(youSurplus) + "</td><td>" + money(cum + (i < 1 ? legal : 0)) + "</td></tr>";
    }
    $("monthTable").innerHTML = rows;

    $("calcResult").classList.remove("hidden");
    $("calcResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------- ROADMAP CHECKLIST ---------- */
  const STEPS = [
    { t: "Freeze joint credit & limit exposure", w: "Call card issuers to remove your name from shared accounts or lower limits. Don't close them unilaterally mid-process without advice — but stop new shared debt." },
    { t: "Open your own accounts", w: "A separate checking/savings in your name only. Redirect your income there. This is your footing post-split." },
    { t: "Pull your credit report", w: "Free at the official annual-credit source in your region. Know every joint account and balance before negotiations." },
    { t: "Build the budget you'll actually live on", w: "Use the calculator above for the two-household number. Be honest — support and housing are the two big shocks." },
    { t: "Run debt triage", w: "List every debt below. Pay the highest-rate one first while keeping minimums everywhere else." },
    { t: "Protect a self-care line item", w: "Mined posts show people skip doctors and pick up bad habits. A small, non-negotiable budget line for your health is not a luxury." },
    { t: "Gather paperwork", w: "3–6 months of statements for the affidavit. See the Paperwork Navigator. Accuracy beats optimism." },
    { t: "Get one real number on legal cost", w: "Even a 30-min paid consult beats guessing. Compare DIY / mediation / contested tiers in the calculator." }
  ];
  const KEY = "splitcost_roadmap_v1";
  const checklist = $("checklist");
  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { done = {}; }
  STEPS.forEach((s, i) => {
    const li = document.createElement("li");
    if (done[i]) li.classList.add("done");
    li.innerHTML = '<span class="step-title">' + s.t + '</span><span class="step-why">' + s.w + "</span>";
    li.addEventListener("click", function () {
      li.classList.toggle("done");
      done[i] = li.classList.contains("done");
      localStorage.setItem(KEY, JSON.stringify(done));
    });
    checklist.appendChild(li);
  });
  $("resetChecklist").addEventListener("click", function () {
    done = {};
    localStorage.removeItem(KEY);
    [...checklist.children].forEach((li) => li.classList.remove("done"));
  });

  /* ---------- DEBT TRIAGE ---------- */
  const debtRows = $("debtRows");
  function addDebtRow(name = "", rate = "", bal = "") {
    const row = document.createElement("div");
    row.className = "debt-row";
    row.innerHTML =
      '<input type="text" placeholder="e.g. Visa" value="' + name + '">' +
      '<input type="number" min="0" placeholder="rate %" value="' + rate + '">' +
      '<input type="number" min="0" placeholder="balance" value="' + bal + '">' +
      '<button class="debt-remove" title="Remove">×</button>';
    row.querySelector(".debt-remove").addEventListener("click", () => row.remove());
    debtRows.appendChild(row);
  }
  // Pre-fill with plausible blanks so the tool isn't empty on load
  addDebtRow("Credit card", "", "");
  addDebtRow("Car loan", "", "");
  $("addDebt").addEventListener("click", () => addDebtRow());

  $("debtBtn").addEventListener("click", function () {
    const debts = [];
    [...debtRows.children].forEach((row) => {
      const [nameEl, rateEl, balEl] = row.querySelectorAll("input");
      const balance = parseFloat(balEl.value);
      const rate = parseFloat(rateEl.value);
      if (!isNaN(balance) && balance > 0) {
        debts.push({ name: nameEl.value || "Debt", rate: isNaN(rate) ? 0 : rate, balance: balance });
      }
    });
    if (debts.length === 0) { $("debtResult").innerHTML = "<p class='fineprint'>Add at least one debt with a balance to see a plan.</p>"; $("debtResult").classList.remove("hidden"); return; }

    const strat = $("strategy").value;
    const extra = num("extraPay");
    debts.sort((a, b) => strat === "avalanche" ? (b.rate - a.rate) : (a.balance - b.balance));

    let totalBal = debts.reduce((s, d) => s + d.balance, 0);
    let html = "<p class='debt-total'>Pay off order (" + (strat === "avalanche" ? "highest rate first" : "smallest balance first") + "), extra " + money(extra) + "/mo:</p><ol class='payoff-list'>";
    debts.forEach((d, i) => {
      const firstYearInterest = d.balance * (d.rate / 100) * 1; // rough annual interest on this balance
      html += "<li><b>" + (i + 1) + ". " + d.name + "</b> — " + money(d.balance) + " @ " + d.rate + "% ≈ " + money(firstYearInterest) + " interest/yr</li>";
    });
    html += "</ol>";
    html += "<p class='fineprint'>Simplified: applying " + money(extra) + " extra to the top debt each month, then rolling it down the list, clears the total fastest. Real payoff time depends on minimum payments — this ranks the order, it doesn't replace your lender's amortization.</p>";
    $("debtResult").innerHTML = html;
    $("debtResult").classList.remove("hidden");
    $("debtResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();

import React, { useMemo } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { fmt, catColor, catLight } from "../constants";
import { MonthlyBarChart, SpendingDonut, BalanceLine } from "../charts";
import Counter from "../components/Counter";

// ── Responsive style injection ────────────────────────────────────────────────
const RESPONSIVE_CSS = `
  /* ── KPI Grid ── */
  .dash-kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 18px;
  }
  @media (max-width: 860px) {
    .dash-kpi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    /* Last card spans full width when 3 items in 2-col grid */
    .dash-kpi-grid > *:nth-child(3) {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 480px) {
    .dash-kpi-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .dash-kpi-grid > *:nth-child(3) {
      grid-column: auto;
    }
  }

  /* ── KPI Card internals ── */
  .dash-card-pad {
    padding: 22px 24px;
  }
  @media (max-width: 600px) {
    .dash-card-pad {
      padding: 16px 18px !important;
    }
  }
  @media (max-width: 380px) {
    .dash-card-pad {
      padding: 14px 14px !important;
    }
  }

  .dash-kpi-value {
    font-size: 28px;
  }
  @media (max-width: 860px) {
    .dash-kpi-value {
      font-size: 24px !important;
    }
  }
  @media (max-width: 480px) {
    .dash-kpi-value {
      font-size: 26px !important;
    }
  }
  @media (max-width: 360px) {
    .dash-kpi-value {
      font-size: 22px !important;
    }
  }

  /* ── Charts Row ── */
  .dash-charts-row {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  @media (max-width: 760px) {
    .dash-charts-row {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .dash-chart-bar {
    height: 210px;
  }
  @media (max-width: 760px) {
    .dash-chart-bar {
      height: 180px !important;
    }
  }
  @media (max-width: 480px) {
    .dash-chart-bar {
      height: 155px !important;
    }
  }

  .dash-chart-line {
    height: 200px;
  }
  @media (max-width: 760px) {
    .dash-chart-line {
      height: 170px !important;
    }
  }
  @media (max-width: 480px) {
    .dash-chart-line {
      height: 145px !important;
    }
  }

  /* ── Chart header row (title + legend) ── */
  .dash-chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .dash-legend {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }
  @media (max-width: 400px) {
    .dash-legend {
      gap: 8px;
    }
  }

  /* ── Transaction rows ── */
  .dash-tx-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px;
    gap: 8px;
  }

  .dash-tx-icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    font-size: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 420px) {
    .dash-tx-icon {
      width: 32px !important;
      height: 32px !important;
      font-size: 13px !important;
      border-radius: 8px !important;
    }
  }

  .dash-tx-desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  @media (max-width: 600px) {
    .dash-tx-desc {
      max-width: 140px;
    }
  }
  @media (max-width: 420px) {
    .dash-tx-desc {
      max-width: 110px;
    }
  }
  @media (max-width: 340px) {
    .dash-tx-desc {
      max-width: 80px;
    }
  }

  .dash-tx-meta {
    font-size: 11px;
    margin-top: 1px;
  }
  @media (max-width: 420px) {
    .dash-tx-meta {
      display: none;
    }
  }

  .dash-tx-amount {
    font-weight: 800;
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
    white-space: nowrap;
  }
  @media (max-width: 420px) {
    .dash-tx-amount {
      font-size: 13px !important;
    }
  }

  /* ── Recent Transactions header ── */
  .dash-txlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

function useResponsiveCss() {
  React.useEffect(() => {
    const id = "dashboard-responsive-css";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = RESPONSIVE_CSS;
      document.head.appendChild(style);
    }
    // cleanup not needed — stylesheet is shared across mounts
  }, []);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const { transactions: txns, tabKey } = state;

  useResponsiveCss();

  const totalIncome   = useMemo(() => txns.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0),  [txns]);
  const totalExpenses = useMemo(() => txns.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0), [txns]);
  const balance       = totalIncome - totalExpenses;

  const breakdown = useMemo(() => {
    const m = {};
    txns.filter(t => t.type === "expense").forEach(t => {
      m[t.category] = (m[t.category] || 0) + t.amount;
    });
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));
  }, [txns]);

  const trend = useMemo(() => {
    const m = {};
    txns.forEach(t => {
      const d   = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short" }) + " '" + String(d.getFullYear()).slice(2);
      if (!m[key]) m[key] = { month: label, income: 0, expenses: 0, order: key };
      if (t.type === "income") m[key].income += t.amount;
      else m[key].expenses += t.amount;
    });
    return Object.values(m).sort((a, b) => a.order.localeCompare(b.order)).slice(-6);
  }, [txns]);

  const kpis = [
    {
      label:  "Total Balance",
      value:  Math.abs(balance),
      accent: balance >= 0 ? "#10b981" : "#f43f5e",
      sub:    balance >= 0 ? "Positive ↑" : "Deficit ↓",
      bg:     balance >= 0
        ? "linear-gradient(135deg,#10b98114,#10b98105)"
        : "linear-gradient(135deg,#f43f5e14,#f43f5e05)",
      border: balance >= 0 ? "#10b98122" : "#f43f5e22",
    },
    {
      label:  "Total Income",
      value:  totalIncome,
      accent: "#6366f1",
      sub:    `${txns.filter(t => t.type === "income").length} entries`,
      bg:     "linear-gradient(135deg,#6366f114,#6366f105)",
      border: "#6366f122",
    },
    {
      label:  "Total Expenses",
      value:  totalExpenses,
      accent: "#f43f5e",
      sub:    `${txns.filter(t => t.type === "expense").length} entries`,
      bg:     "linear-gradient(135deg,#f43f5e14,#f43f5e05)",
      border: "#f43f5e22",
    },
  ];

  return (
    <div key={`d-${tabKey}`}>

      {/* ── KPI Cards ── */}
      <div className="dash-kpi-grid">
        {kpis.map((c, i) => (
          <div
            key={i}
            className="card fade-up dash-card-pad"
            style={{
              background: c.bg,
              border:     `1px solid ${c.border}`,
              position:   "relative",
              overflow:   "hidden",
            }}
          >
            {/* decorative circle */}
            <div style={{
              position: "absolute", top: -20, right: -20,
              width: 80, height: 80, borderRadius: "50%",
              background: c.accent + "0d",
              pointerEvents: "none",
            }} />

            <div style={{ fontSize: 12, color: s.muted, fontWeight: 600, marginBottom: 10, letterSpacing: ".3px" }}>
              {c.label}
            </div>
            <div
              className="num dash-kpi-value"
              style={{
                fontWeight: 800,
                letterSpacing: "-1px",
                fontFamily: "'JetBrains Mono', monospace",
                color: s.text,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <Counter to={c.value} dur={900 + i * 100} />
            </div>
            <div style={{ fontSize: 12, color: c.accent, marginTop: 8, fontWeight: 600 }}>{c.sub}</div>

            {/* bottom accent bar */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg,${c.accent}00,${c.accent}99,${c.accent}00)`,
              pointerEvents: "none",
            }} />
          </div>
        ))}
      </div>

      {/* ── Monthly Bar + Spending Donut ── */}
      <div className="dash-charts-row">
        <div
          className="card fade-up dash-card-pad"
          style={{ background: s.card, border: `1px solid ${s.border}`, animationDelay: ".2s" }}
        >
          <div className="dash-chart-header">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Monthly Overview</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>Income vs Expenses</div>
            </div>
            <div className="dash-legend">
              {[["Income", "#10b981"], ["Expenses", "#f43f5e"]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: s.muted, fontWeight: 500 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div className="dash-chart-bar">
            <MonthlyBarChart trend={trend} />
          </div>
        </div>

        <div
          className="card fade-up dash-card-pad"
          style={{ background: s.card, border: `1px solid ${s.border}`, animationDelay: ".28s" }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Spending Breakdown</div>
          <div style={{ fontSize: 12, color: s.muted, marginBottom: 16 }}>Hover segments to explore</div>
          <SpendingDonut breakdown={breakdown} />
        </div>
      </div>

      {/* ── Balance Trajectory ── */}
      <div
        className="card fade-up dash-card-pad"
        style={{ background: s.card, border: `1px solid ${s.border}`, marginBottom: 14, animationDelay: ".34s" }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Balance Trajectory</div>
        <div style={{ fontSize: 12, color: s.muted, marginBottom: 16 }}>Cumulative net balance over months</div>
        <div className="dash-chart-line">
          <BalanceLine trend={trend} />
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div
        className="card fade-up dash-card-pad"
        style={{ background: s.card, border: `1px solid ${s.border}`, animationDelay: ".4s" }}
      >
        <div className="dash-txlist-header">
          <div style={{ fontSize: 14, fontWeight: 700 }}>Recent Transactions</div>
          <button
            onClick={() => dispatch({ type: "SET_TAB", payload: "transactions" })}
            style={{
              fontSize: 13, color: "#6366f1", background: "none",
              border: "none", cursor: "pointer", fontWeight: 700,
              fontFamily: "inherit", flexShrink: 0, padding: 0,
            }}
          >
            View all →
          </button>
        </div>

        {txns.slice(0, 7).map((t, i) => (
          <div
            key={t.id}
            className="tx-row dash-tx-row"
            style={{
              borderBottom: `1px solid ${s.border}`,
              borderRadius: 8,
              animation:    `fadeUp .4s ease ${i * 0.04}s both`,
            }}
          >
            {/* Left: icon + text */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              <div
                className="dash-tx-icon"
                style={{
                  background: catLight(t.category),
                  border:     `1px solid ${catColor(t.category)}28`,
                }}
              >
                {t.type === "income" ? "↑" : "↓"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="dash-tx-desc" style={{ fontSize: 13, fontWeight: 600 }}>
                  {t.description}
                </div>
                <div className="dash-tx-meta" style={{ color: s.muted }}>
                  {t.category} · {t.date}
                </div>
              </div>
            </div>

            {/* Right: amount */}
            <div
              className="dash-tx-amount"
              style={{ color: t.type === "income" ? "#10b981" : "#f43f5e" }}
            >
              {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

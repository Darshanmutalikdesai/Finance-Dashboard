import React, { useMemo } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { fmt } from "../constants";
import { BalanceLine, CategoryBar } from "../charts";

// ── Responsive style injection ──────────────────────────────────────────────
const RESPONSIVE_CSS = `
  .insights-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  /* Tablet: stack stat cards 2+1 */
  @media (max-width: 768px) {
    .insights-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .insights-grid > *:last-child {
      grid-column: 1 / -1;
    }
  }

  /* Mobile: single column */
  @media (max-width: 480px) {
    .insights-grid {
      grid-template-columns: 1fr;
    }
    .insights-grid > *:last-child {
      grid-column: auto;
    }
    .insights-stat-value {
      font-size: 20px !important;
    }
    .insights-card-pad {
      padding: 16px !important;
    }
    .insights-obs-icon {
      width: 34px !important;
      height: 34px !important;
      font-size: 15px !important;
      flex-shrink: 0;
    }
    .insights-chart-line {
      height: 170px !important;
    }
  }

  /* Clamp category bar height on small screens */
  @media (max-width: 600px) {
    .insights-cat-bar {
      height: auto !important;
      min-height: 120px;
    }
  }
`;

function useResponsiveCss() {
  React.useEffect(() => {
    const id = "insights-responsive-css";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = RESPONSIVE_CSS;
      document.head.appendChild(style);
    }
    return () => {
      // leave style alive; harmless across remounts
    };
  }, []);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const { state } = useApp();
  const s = useTheme();
  const { transactions: txns, tabKey } = state;

  useResponsiveCss();

  const totalIncome   = useMemo(() => txns.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0),  [txns]);
  const totalExpenses = useMemo(() => txns.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0), [txns]);
  const balance       = totalIncome - totalExpenses;

  const breakdown = useMemo(() => {
    const m = {};
    txns.filter(t => t.type === "expense").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
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

  const top = breakdown[0];

  // Stat card data
  const statCards = [
    {
      label:  "Savings Rate",
      value:  totalIncome > 0 ? `${Math.round((balance / totalIncome) * 100)}%` : "—",
      accent: balance >= 0 ? "#10b981" : "#f43f5e",
      sub:    "of income saved",
    },
    {
      label:  "Avg. Transaction",
      value:  txns.length > 0 ? fmt(Math.round((totalIncome + totalExpenses) / txns.length)) : "—",
      accent: "#6366f1",
      sub:    "per entry",
    },
    {
      label:  "Top Spend Category",
      value:  top?.label || "—",
      accent: "#f59e0b",
      sub:    top ? fmt(top.value) + " total" : "—",
    },
  ];

  // Observations data
  const observations = [
    top && {
      icon:  "📊",
      title: `${top.label} leads spending`,
      desc:  `${fmt(top.value)} — ${Math.round((top.value / (totalExpenses || 1)) * 100)}% of total expenses.`,
      color: "#f59e0b",
    },
    {
      icon:  totalIncome >= totalExpenses ? "💚" : "⚠️",
      title: totalIncome >= totalExpenses ? "You're in surplus" : "Deficit detected",
      desc:  totalIncome >= totalExpenses
        ? `Saving ${fmt(balance)} — ${Math.round((balance / (totalIncome || 1)) * 100)}% savings rate.`
        : `Spending ${fmt(Math.abs(balance))} more than earned.`,
      color: totalIncome >= totalExpenses ? "#10b981" : "#f43f5e",
    },
    {
      icon:  "📈",
      title: "Income sources",
      desc:  `${txns.filter(t => t.type === "income").length} income entries totalling ${fmt(totalIncome)} across ${trend.length} months.`,
      color: "#6366f1",
    },
  ].filter(Boolean);

  // Shared card style
  const cardBase = {
    background: s.card,
    border:     `1px solid ${s.border}`,
  };

  return (
    <div
      key={`i-${tabKey}`}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* ── Stat mini-cards ── */}
      <div className="insights-grid">
        {statCards.map((c, i) => (
          <div
            key={i}
            className="card fade-up insights-card-pad"
            style={{ ...cardBase, padding: "20px 22px" }}
          >
            <div style={{ fontSize: 12, color: s.muted, marginBottom: 8, fontWeight: 600 }}>
              {c.label}
            </div>
            <div
              className="insights-stat-value"
              style={{ fontSize: 24, fontWeight: 800, color: c.accent, fontFamily: "'JetBrains Mono'" }}
            >
              {c.value}
            </div>
            <div style={{ fontSize: 12, color: s.muted, marginTop: 6 }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Horizontal category bar ── */}
      {breakdown.length > 0 && (
        <div
          className="card fade-up insights-card-pad"
          style={{ ...cardBase, padding: "20px 22px", animationDelay: ".1s" }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Spending by Category</div>
          <div style={{ fontSize: 12, color: s.muted, marginBottom: 18 }}>Hover bars for details</div>
          {/* height is set inline for JS-driven sizing, but capped via CSS on small screens */}
          <div
            className="insights-cat-bar"
            style={{ height: Math.max(breakdown.length * 50 + 20, 140) }}
          >
            <CategoryBar breakdown={breakdown} totalExpenses={totalExpenses} />
          </div>
        </div>
      )}

      {/* ── Balance trajectory ── */}
      <div
        className="card fade-up insights-card-pad"
        style={{ ...cardBase, padding: "20px 22px", animationDelay: ".16s" }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Balance Trajectory</div>
        <div style={{ fontSize: 12, color: s.muted, marginBottom: 16 }}>Cumulative savings over months</div>
        <div
          className="chart-height-line insights-chart-line"
          style={{ height: 210 }}
        >
          <BalanceLine trend={trend} />
        </div>
      </div>

      {/* ── Key observations ── */}
      <div
        className="card fade-up insights-card-pad"
        style={{ ...cardBase, padding: "22px 24px", animationDelay: ".22s" }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Key Observations</div>
        {observations.map((o, i, arr) => (
          <div
            key={i}
            style={{
              display:      "flex",
              gap:          14,
              padding:      "13px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${s.border}` : "none",
              alignItems:   "flex-start",
            }}
          >
            <div
              className="insights-obs-icon"
              style={{
                width:           40,
                height:          40,
                borderRadius:    12,
                background:      o.color + "18",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                fontSize:        17,
                flexShrink:      0,
              }}
            >
              {o.icon}
            </div>
            <div style={{ minWidth: 0 /* prevent text overflow pushing layout */ }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{o.title}</div>
              <div style={{ fontSize: 13, color: s.muted, lineHeight: 1.65, wordBreak: "break-word" }}>
                {o.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
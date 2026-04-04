import React, { useMemo } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { fmt, catColor, catLight } from "../constants";
import { MonthlyBarChart, SpendingDonut, BalanceLine } from "../charts";
import Counter from "../components/Counter";


//  DASHBOARD PAGE
export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const { transactions: txns, tabKey } = state;

  const totalIncome   = useMemo(() => txns.filter(t => t.type === "income").reduce((a,t) => a+t.amount, 0), [txns]);
  const totalExpenses = useMemo(() => txns.filter(t => t.type === "expense").reduce((a,t) => a+t.amount, 0), [txns]);
  const balance       = totalIncome - totalExpenses;

  const breakdown = useMemo(() => {
    const m = {};
    txns.filter(t => t.type === "expense").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]).map(([label, value]) => ({ label, value }));
  }, [txns]);

  const trend = useMemo(() => {
    const m = {};
    txns.forEach(t => {
      const d = new Date(t.date);
      const key   = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      const label = d.toLocaleString("default", { month:"short" }) + " '" + String(d.getFullYear()).slice(2);
      if (!m[key]) m[key] = { month:label, income:0, expenses:0, order:key };
      if (t.type === "income") m[key].income += t.amount;
      else m[key].expenses += t.amount;
    });
    return Object.values(m).sort((a,b) => a.order.localeCompare(b.order)).slice(-6);
  }, [txns]);

  const kpis = [
    { label:"Total Balance",  value:Math.abs(balance),  accent:balance>=0?"#10b981":"#f43f5e", sub:balance>=0?"Positive ↑":"Deficit ↓",    bg:balance>=0?"linear-gradient(135deg,#10b98114,#10b98105)":"linear-gradient(135deg,#f43f5e14,#f43f5e05)", border:balance>=0?"#10b98122":"#f43f5e22" },
    { label:"Total Income",   value:totalIncome,         accent:"#6366f1", sub:`${txns.filter(t=>t.type==="income").length} entries`,  bg:"linear-gradient(135deg,#6366f114,#6366f105)", border:"#6366f122" },
    { label:"Total Expenses", value:totalExpenses,       accent:"#f43f5e", sub:`${txns.filter(t=>t.type==="expense").length} entries`, bg:"linear-gradient(135deg,#f43f5e14,#f43f5e05)", border:"#f43f5e22" },
  ];

  return (
    <div key={`d-${tabKey}`}>
      {/* ── KPI Cards ── */}
      <div className="kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:18 }}>
        {kpis.map((c, i) => (
          <div key={i} className="card fade-up" style={{ background:c.bg, border:`1px solid ${c.border}`, padding:"22px 24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:c.accent+"0d" }}/>
            <div style={{ fontSize:12, color:s.muted, fontWeight:600, marginBottom:10, letterSpacing:".3px" }}>{c.label}</div>
            <div className="num" style={{ fontSize:28, fontWeight:800, letterSpacing:"-1px", fontFamily:"'JetBrains Mono'", color:s.text, animationDelay:`${i*.1}s` }}>
              <Counter to={c.value} dur={900+i*100}/>
            </div>
            <div style={{ fontSize:12, color:c.accent, marginTop:8, fontWeight:600 }}>{c.sub}</div>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${c.accent}00,${c.accent}99,${c.accent}00)` }}/>
          </div>
        ))}
      </div>

      {/* ── Monthly Bar + Spending Donut ── */}
      <div className="charts-row" style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:14, marginBottom:14 }}>
        <div className="card fade-up" style={{ background:s.card, border:`1px solid ${s.border}`, padding:"20px 22px", animationDelay:".2s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700 }}>Monthly Overview</div>
              <div style={{ fontSize:12, color:s.muted, marginTop:2 }}>Income vs Expenses</div>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[["Income","#10b981"],["Expenses","#f43f5e"]].map(([l,c]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:s.muted, fontWeight:500 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c }}/>{l}
                </div>
              ))}
            </div>
          </div>
          <div className="chart-height-bar" style={{ height:210 }}><MonthlyBarChart trend={trend}/></div>
        </div>

        <div className="card fade-up" style={{ background:s.card, border:`1px solid ${s.border}`, padding:"20px 22px", animationDelay:".28s" }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>Spending Breakdown</div>
          <div style={{ fontSize:12, color:s.muted, marginBottom:16 }}>Hover segments to explore</div>
          <SpendingDonut breakdown={breakdown}/>
        </div>
      </div>

      {/* ── Balance Trajectory ── */}
      <div className="card fade-up" style={{ background:s.card, border:`1px solid ${s.border}`, padding:"20px 22px", marginBottom:14, animationDelay:".34s" }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>Balance Trajectory</div>
        <div style={{ fontSize:12, color:s.muted, marginBottom:16 }}>Cumulative net balance over months</div>
        <div className="chart-height-line" style={{ height:200 }}><BalanceLine trend={trend}/></div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="card fade-up" style={{ background:s.card, border:`1px solid ${s.border}`, padding:"20px 22px", animationDelay:".4s" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700 }}>Recent Transactions</div>
          <button
            onClick={() => dispatch({ type:"SET_TAB", payload:"transactions" })}
            style={{ fontSize:13, color:"#6366f1", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}
          >
            View all →
          </button>
        </div>
        {txns.slice(0,7).map((t, i) => (
          <div key={t.id} className="tx-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 8px", borderBottom:`1px solid ${s.border}`, borderRadius:8, animation:`fadeUp .4s ease ${i*.04}s both` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:catLight(t.category), display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, border:`1px solid ${catColor(t.category)}28`, flexShrink:0 }}>
                {t.type === "income" ? "↑" : "↓"}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.description}</div>
                <div style={{ fontSize:11, color:s.muted, marginTop:1 }}>{t.category} · {t.date}</div>
              </div>
            </div>
            <div style={{ fontWeight:800, fontSize:14, fontFamily:"'JetBrains Mono'", color:t.type==="income"?"#10b981":"#f43f5e", flexShrink:0, marginLeft:10 }}>
              {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
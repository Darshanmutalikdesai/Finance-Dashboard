import React, { useMemo } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { fmt, catColor, catLight } from "../constants";


//  TRANSACTIONS PAGE
export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const { transactions: txns, search, fType, fCat, sort, tabKey } = state;
  const isAdmin  = state.role === "admin";
  const usedCats = [...new Set(txns.map(t => t.category))];

  const iBase = {
    padding: "9px 12px",
    border: `1px solid ${s.border}`,
    borderRadius: 10,
    background: s.surface,
    color: s.text,
    fontSize: 13,
    fontFamily: "inherit",
  };

  // ── Filtered + sorted list ──
  const filtered = useMemo(() => {
    let l = [...txns];
    if (search)      l = l.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (fType !== "all") l = l.filter(t => t.type === fType);
    if (fCat  !== "all") l = l.filter(t => t.category === fCat);
    l.sort((a, b) => {
      if (sort === "date-desc")   return new Date(b.date)  - new Date(a.date);
      if (sort === "date-asc")    return new Date(a.date)  - new Date(b.date);
      if (sort === "amount-desc") return b.amount - a.amount;
      return a.amount - b.amount;
    });
    return l;
  }, [txns, search, fType, fCat, sort]);

  // ── CSV export ──
  const exportCSV = () => {
    const rows = [
      ["Date","Description","Category","Type","Amount"],
      ...filtered.map(t => [t.date, t.description, t.category, t.type, t.amount]),
    ];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div key={`t-${tabKey}`} style={{ animation: "fadeUp .4s ease" }}>
      {/* ── Filter bar ── */}
      <div className="card" style={{ background:s.card, border:`1px solid ${s.border}`, padding:"14px 18px", marginBottom:12 }}>
        <div className="filter-row" style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          {/* Search */}
          <div style={{ flex:1, minWidth:180, position:"relative" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.muted} strokeWidth="2" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => dispatch({ type:"SET_SEARCH", payload:e.target.value })}
              placeholder="Search…"
              style={{ ...iBase, width:"100%", paddingLeft:30 }}
            />
          </div>

          <select value={fType} onChange={e => dispatch({ type:"SET_FTYPE", payload:e.target.value })} style={iBase}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={fCat} onChange={e => dispatch({ type:"SET_FCAT", payload:e.target.value })} style={iBase}>
            <option value="all">All Categories</option>
            {usedCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={sort} onChange={e => dispatch({ type:"SET_SORT", payload:e.target.value })} style={iBase}>
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="amount-desc">Highest</option>
            <option value="amount-asc">Lowest</option>
          </select>

          <button onClick={exportCSV} style={{ ...iBase, background:"transparent", color:s.muted, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>
            ↓ CSV
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card" style={{ background:s.card, border:`1px solid ${s.border}`, overflow:"hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"50px 24px", textAlign:"center", color:s.muted, fontSize:14 }}>
            No results match your filters.
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="tx-table" style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${s.border}`, background:s.surface }}>
                  {["Date","Description","Category","Type","Amount",...(isAdmin?["Delete"]:[])].map(h => (
                    <th key={h} style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className="tx-row" style={{ borderBottom:`1px solid ${s.border}`, animation:`fadeUp .35s ease ${Math.min(i,10)*.025}s both` }}>
                    <td style={{ padding:"12px 14px", fontSize:12, color:s.muted, fontFamily:"'JetBrains Mono'", whiteSpace:"nowrap" }}>{t.date}</td>
                    <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.description}</td>
                    <td style={{ padding:"12px 14px" }}>
                      <span className="chip" style={{ background:catLight(t.category), color:catColor(t.category), border:`1px solid ${catColor(t.category)}28` }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <span className="chip" style={{ background:t.type==="income"?"#10b98118":"#f43f5e18", color:t.type==="income"?"#10b981":"#f43f5e" }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding:"12px 14px", fontSize:13, fontWeight:800, fontFamily:"'JetBrains Mono'", color:t.type==="income"?"#10b981":"#f43f5e", whiteSpace:"nowrap" }}>
                      {t.type==="income"?"+":"-"}{fmt(t.amount)}
                    </td>
                    {isAdmin && (
                      <td style={{ padding:"12px 14px" }}>
                        <button
                          onClick={() => dispatch({ type:"DELETE_TRANSACTION", id:t.id })}
                          style={{ fontSize:11, color:"#f43f5e", background:"#f43f5e14", border:"1px solid #f43f5e28", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{ padding:"11px 16px", borderTop:`1px solid ${s.border}`, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:12, color:s.muted }}>{filtered.length} records</span>
            <span style={{ fontSize:12, color:s.muted }}>
              Net:{" "}
              <strong style={{ color:s.text, fontFamily:"'JetBrains Mono'" }}>
                {fmt(filtered.reduce((sum,t) => t.type==="income" ? sum+t.amount : sum-t.amount, 0))}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
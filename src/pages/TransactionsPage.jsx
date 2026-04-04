import React, { useMemo, useState } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { fmt, catColor, catLight } from "../constants";


//  TRANSACTION DETAIL POPUP
function TxPopup({ tx, onClose, s }) {
  if (!tx) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1300,
        background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: s.card, borderRadius: 22, width: "100%", maxWidth: 400,
          border: `1px solid ${s.border}`,
          boxShadow: "0 32px 80px rgba(0,0,0,.45)",
          animation: "slideIn .35s cubic-bezier(.22,1,.36,1)",
          overflow: "hidden",
        }}
      >
        {/* ── Coloured header strip ── */}
        <div style={{
          background: tx.type === "income"
            ? "linear-gradient(135deg,#10b98122,#10b98108)"
            : "linear-gradient(135deg,#f43f5e22,#f43f5e08)",
          borderBottom: `1px solid ${s.border}`,
          padding: "24px 24px 20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: tx.type === "income" ? "#10b98122" : "#f43f5e22",
              border: `1.5px solid ${tx.type === "income" ? "#10b98144" : "#f43f5e44"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>
              {tx.type === "income" ? "↑" : "↓"}
            </div>
            <button onClick={onClose} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 9, width: 32, height: 32, cursor: "pointer", color: s.muted, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono'", color: tx.type === "income" ? "#10b981" : "#f43f5e", letterSpacing: "-1px" }}>
            {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: tx.type === "income" ? "#10b98122" : "#f43f5e22", color: tx.type === "income" ? "#10b981" : "#f43f5e", textTransform: "uppercase", letterSpacing: ".5px" }}>
              {tx.type}
            </span>
          </div>
        </div>

        {/* ── Details ── */}
        <div style={{ padding: "20px 24px 24px" }}>
          {[
            { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Transaction Date", value: new Date(tx.date).toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" }) },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Time of Transaction", value: (() => { const d = new Date(tx.date); return isNaN(d.getHours()) ? "Not recorded" : d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }); })() },
            { icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z", label: "Category", value: tx.category, isChip: true },
            { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Purpose / Description", value: tx.description },
            { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Amount", value: fmt(tx.amount), isMono: true },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${s.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: s.surface, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={s.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={row.icon}/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: s.muted, fontWeight: 700, letterSpacing: ".5px", marginBottom: 4, textTransform: "uppercase" }}>{row.label}</div>
                {row.isChip ? (
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: catLight(tx.category), color: catColor(tx.category), border: `1px solid ${catColor(tx.category)}28` }}>{row.value}</span>
                ) : (
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.text, fontFamily: row.isMono ? "'JetBrains Mono'" : "inherit", wordBreak: "break-word" }}>{row.value}</div>
                )}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, fontSize: 11, color: s.muted, textAlign: "center", fontFamily: "'JetBrains Mono'" }}>ID · {tx.id}</div>
        </div>
      </div>
    </div>
  );
}


//  TRANSACTIONS PAGE
export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const { transactions: txns, search, fType, fCat, sort, tabKey } = state;
  const isAdmin  = state.role === "admin";
  const usedCats = [...new Set(txns.map(t => t.category))];

  const [selectedTx, setSelectedTx] = useState(null);
  const [page,       setPage]        = useState(1);
  const [perPage,    setPerPage]     = useState(10);

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
    if (search)          l = l.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (fType !== "all") l = l.filter(t => t.type === fType);
    if (fCat  !== "all") l = l.filter(t => t.category === fCat);
    l.sort((a, b) => {
      if (sort === "date-desc")   return new Date(b.date) - new Date(a.date);
      if (sort === "date-asc")    return new Date(a.date) - new Date(b.date);
      if (sort === "amount-desc") return b.amount - a.amount;
      return a.amount - b.amount;
    });
    return l;
  }, [txns, search, fType, fCat, sort]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

  // reset to page 1 when filters/perPage change
  const handlePerPage = (val) => { setPerPage(val); setPage(1); };

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

  // ── Page number buttons ──
  const pageButtons = () => {
    const btns = [];
    const delta = 1;
    const left  = safePage - delta;
    const right = safePage + delta;
    let last = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (last && i - last > 1) btns.push("...");
        btns.push(i);
        last = i;
      }
    }
    return btns;
  };

  return (
    <div key={`t-${tabKey}`} style={{ animation: "fadeUp .4s ease" }}>

      {/* ── Responsive styles ── */}
      <style>{`
        .filter-row { flex-direction: row; }
        .tx-table td, .tx-table th { padding: 12px 14px; }
        .page-btn { min-width: 34px; height: 34px; font-size: 13px; }
        .footer-bar { flex-direction: row; align-items: center; }
        .per-page-label { display: inline; }

        @media (max-width: 768px) {
          .filter-row { flex-direction: column !important; }
          .filter-row > * { width: 100% !important; }
          .tx-table td, .tx-table th { padding: 9px 10px !important; font-size: 11px !important; }
          .chip { font-size: 10px !important; padding: 2px 7px !important; }
          .page-btn { min-width: 30px !important; height: 30px !important; font-size: 12px !important; }
          .footer-bar { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
        }

        @media (max-width: 480px) {
          .tx-col-cat, .tx-col-type { display: none; }
          .per-page-label { display: none; }
          .page-btn { min-width: 28px !important; height: 28px !important; font-size: 11px !important; }
        }
      `}</style>

      {/* ── Detail Popup ── */}
      <TxPopup tx={selectedTx} onClose={() => setSelectedTx(null)} s={s} />

      {/* ── Filter bar ── */}
      <div className="card" style={{ background:s.card, border:`1px solid ${s.border}`, padding:"14px 18px", marginBottom:12 }}>
        <div className="filter-row" style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ flex:1, minWidth:140, position:"relative" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.muted} strokeWidth="2" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => { dispatch({ type:"SET_SEARCH", payload:e.target.value }); setPage(1); }}
              placeholder="Search…"
              style={{ ...iBase, width:"100%", paddingLeft:30, boxSizing:"border-box" }}
            />
          </div>

          <select value={fType} onChange={e => { dispatch({ type:"SET_FTYPE", payload:e.target.value }); setPage(1); }} style={iBase}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={fCat} onChange={e => { dispatch({ type:"SET_FCAT", payload:e.target.value }); setPage(1); }} style={iBase}>
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
            <table className="tx-table" style={{ width:"100%", borderCollapse:"collapse", minWidth:320 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${s.border}`, background:s.surface }}>
                  <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px", whiteSpace:"nowrap" }}>Date</th>
                  <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px" }}>Description</th>
                  <th className="tx-col-cat" style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px" }}>Category</th>
                  <th className="tx-col-type" style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px" }}>Type</th>
                  <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px", whiteSpace:"nowrap" }}>Amount</th>
                  {isAdmin && <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:s.muted, letterSpacing:".7px" }}>Delete</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((t, i) => (
                  <tr
                    key={t.id}
                    className="tx-row"
                    onClick={() => setSelectedTx(t)}
                    style={{ borderBottom:`1px solid ${s.border}`, animation:`fadeUp .35s ease ${Math.min(i,10)*.025}s both`, cursor:"pointer" }}
                  >
                    <td style={{ padding:"12px 14px", fontSize:12, color:s.muted, fontFamily:"'JetBrains Mono'", whiteSpace:"nowrap" }}>{t.date}</td>
                    <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.description}</td>
                    <td className="tx-col-cat" style={{ padding:"12px 14px" }}>
                      <span className="chip" style={{ background:catLight(t.category), color:catColor(t.category), border:`1px solid ${catColor(t.category)}28` }}>{t.category}</span>
                    </td>
                    <td className="tx-col-type" style={{ padding:"12px 14px" }}>
                      <span className="chip" style={{ background:t.type==="income"?"#10b98118":"#f43f5e18", color:t.type==="income"?"#10b981":"#f43f5e" }}>{t.type}</span>
                    </td>
                    <td style={{ padding:"12px 14px", fontSize:13, fontWeight:800, fontFamily:"'JetBrains Mono'", color:t.type==="income"?"#10b981":"#f43f5e", whiteSpace:"nowrap" }}>
                      {t.type==="income"?"+":"-"}{fmt(t.amount)}
                    </td>
                    {isAdmin && (
                      <td style={{ padding:"12px 14px" }}>
                        <button
                          onClick={e => { e.stopPropagation(); dispatch({ type:"DELETE_TRANSACTION", id:t.id }); }}
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

        {/* ── Footer: per-page + pagination + net ── */}
        {filtered.length > 0 && (
          <div className="footer-bar" style={{ padding:"12px 16px", borderTop:`1px solid ${s.border}`, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>

            {/* Left — per page selector */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span className="per-page-label" style={{ fontSize:12, color:s.muted }}>Show</span>
              {[10, 20, 40].map(n => (
                <button
                  key={n}
                  onClick={() => handlePerPage(n)}
                  style={{
                    padding:"4px 10px", borderRadius:8, fontSize:12, fontFamily:"inherit",
                    fontWeight: perPage === n ? 700 : 500,
                    cursor:"pointer",
                    background: perPage === n ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : s.surface,
                    color:      perPage === n ? "white" : s.muted,
                    border:     perPage === n ? "none"  : `1px solid ${s.border}`,
                  }}
                >{n}</button>
              ))}
              <span className="per-page-label" style={{ fontSize:12, color:s.muted }}>per page</span>
            </div>

            {/* Centre — page buttons */}
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              {/* Prev */}
              <button
                className="page-btn"
                onClick={() => goTo(safePage - 1)}
                disabled={safePage === 1}
                style={{ minWidth:34, height:34, borderRadius:8, border:`1px solid ${s.border}`, background:s.surface, color:safePage===1?s.muted:s.text, cursor:safePage===1?"not-allowed":"pointer", fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", opacity:safePage===1?.4:1 }}
              >‹</button>

              {pageButtons().map((btn, idx) =>
                btn === "..." ? (
                  <span key={`e${idx}`} style={{ color:s.muted, fontSize:13, padding:"0 4px" }}>…</span>
                ) : (
                  <button
                    key={btn}
                    className="page-btn"
                    onClick={() => goTo(btn)}
                    style={{ minWidth:34, height:34, borderRadius:8, fontSize:13, fontFamily:"inherit", fontWeight: btn===safePage?700:500, cursor:"pointer", border: btn===safePage?"none":`1px solid ${s.border}`, background: btn===safePage?"linear-gradient(135deg,#6366f1,#8b5cf6)":s.surface, color: btn===safePage?"white":s.text, display:"flex", alignItems:"center", justifyContent:"center" }}
                  >{btn}</button>
                )
              )}

              {/* Next */}
              <button
                className="page-btn"
                onClick={() => goTo(safePage + 1)}
                disabled={safePage === totalPages}
                style={{ minWidth:34, height:34, borderRadius:8, border:`1px solid ${s.border}`, background:s.surface, color:safePage===totalPages?s.muted:s.text, cursor:safePage===totalPages?"not-allowed":"pointer", fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", opacity:safePage===totalPages?.4:1 }}
              >›</button>
            </div>

            {/* Right — record count + net */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
              <span style={{ fontSize:12, color:s.muted }}>{(safePage-1)*perPage+1}–{Math.min(safePage*perPage, filtered.length)} of {filtered.length}</span>
              <span style={{ fontSize:12, color:s.muted }}>
                Net: <strong style={{ color:s.text, fontFamily:"'JetBrains Mono'" }}>{fmt(filtered.reduce((sum,t) => t.type==="income"?sum+t.amount:sum-t.amount,0))}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
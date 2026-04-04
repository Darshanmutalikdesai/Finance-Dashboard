import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useTheme } from "../context/AppContext";
import { fmt, catColor, catLight } from "../constants";


//  SHARED TOOLTIP BASE
const ttBase = (dark) => ({
  backgroundColor: dark ? "rgba(8,14,30,.97)" : "rgba(255,255,255,.97)",
  titleColor:   dark ? "#e2e8f0" : "#0f172a",
  bodyColor:    dark ? "#94a3b8" : "#64748b",
  borderColor:  dark ? "rgba(99,102,241,.28)" : "rgba(99,102,241,.18)",
  borderWidth: 1, cornerRadius: 12, padding: 13,
  titleFont: { family: "'Sora'", size: 12, weight: "700" },
  bodyFont:  { family: "'Sora'", size: 12 },
  usePointStyle: true, boxWidth: 10, boxHeight: 10, boxPadding: 5,
});


//  MONTHLY BAR CHART
export function MonthlyBarChart({ trend }) {
  const s = useTheme();
  const data = {
    labels: trend.map(d => d.month),
    datasets: [
      {
        label: "Income",
        data: trend.map(d => d.income),
        backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0,0,0,260); g.addColorStop(0,"#10b98199"); g.addColorStop(1,"#10b98122"); return g; },
        hoverBackgroundColor: "#10b981cc",
        borderRadius: { topLeft:8, topRight:8 }, borderSkipped: false,
        borderColor: "#10b981", borderWidth: { top:2.5, left:0, right:0, bottom:0 },
        categoryPercentage: .72, barPercentage: .88,
      },
      {
        label: "Expenses",
        data: trend.map(d => d.expenses),
        backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0,0,0,260); g.addColorStop(0,"#f43f5e99"); g.addColorStop(1,"#f43f5e22"); return g; },
        hoverBackgroundColor: "#f43f5ecc",
        borderRadius: { topLeft:8, topRight:8 }, borderSkipped: false,
        borderColor: "#f43f5e", borderWidth: { top:2.5, left:0, right:0, bottom:0 },
        categoryPercentage: .72, barPercentage: .88,
      },
    ],
  };

  return (
    <Bar data={data} options={{
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1100, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: { ...ttBase(s.dark), callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` } },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: s.dark ? "#3d5068" : "#94a3b8", font: { family: "'Sora'", size: 11, weight: "600" } } },
        y: {
          grid: { color: s.dark ? "rgba(99,102,241,.06)" : "rgba(99,102,241,.05)", drawTicks: false },
          border: { display: false, dash: [4,4] },
          ticks: { color: s.dark ? "#3d5068" : "#94a3b8", font: { family: "'Sora'", size: 10 }, callback: v => "₹"+(v/1000).toFixed(0)+"k", maxTicksLimit: 5 },
        },
      },
    }}/>
  );
}


//  SPENDING DONUT CHART
export function SpendingDonut({ breakdown }) {
  const s = useTheme();
  const [active, setActive] = useState(null);
  const labels = breakdown.map(d => d.label);
  const values = breakdown.map(d => d.value);
  const colors = breakdown.map(d => catColor(d.label));
  const total  = values.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0, margin: "0 auto" }}>
        <Doughnut
          data={{ labels, datasets: [{ data: values, backgroundColor: colors.map(c => c+"cc"), hoverBackgroundColor: colors, borderColor: s.dark ? "#080c18" : "#fff", hoverBorderColor: s.dark ? "#080c18" : "#fff", borderWidth: 3, hoverBorderWidth: 3, hoverOffset: 10 }] }}
          options={{
            responsive: true, maintainAspectRatio: false, cutout: "70%",
            animation: { animateRotate: true, animateScale: true, duration: 950, easing: "easeOutQuart" },
            plugins: {
              legend: { display: false },
              tooltip: { ...ttBase(s.dark), callbacks: { label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)} (${Math.round((ctx.raw/total)*100)}%)` } },
            },
            onHover: (_, els) => setActive(els.length > 0 ? els[0].index : null),
          }}
        />
        {/* Center label */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {active !== null ? (
            <>
              <div style={{ width:9, height:9, borderRadius:"50%", background:colors[active], marginBottom:5, boxShadow:`0 0 10px ${colors[active]}` }}/>
              <div style={{ fontSize:11, fontWeight:700, color:colors[active], textAlign:"center", maxWidth:70, lineHeight:1.3 }}>{labels[active]}</div>
              <div style={{ fontSize:15, fontWeight:800, color:s.text, fontFamily:"'JetBrains Mono'", marginTop:3 }}>{Math.round((values[active]/total)*100)}%</div>
              <div style={{ fontSize:10, color:s.muted, fontFamily:"'JetBrains Mono'", marginTop:1 }}>{fmt(values[active])}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize:10, color:s.muted, letterSpacing:".6px", fontWeight:600 }}>TOTAL</div>
              <div style={{ fontSize:14, fontWeight:800, color:s.text, fontFamily:"'JetBrains Mono'", marginTop:2 }}>{fmt(total)}</div>
              <div style={{ fontSize:10, color:s.muted, marginTop:1 }}>expenses</div>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ flex:1, minWidth:120, display:"flex", flexDirection:"column", gap:8 }}>
        {breakdown.slice(0,6).map((d, i) => (
          <div key={d.label} style={{ display:"flex", alignItems:"center", gap:8, opacity: active!==null && active!==i ? .3 : 1, transition:"opacity .2s" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:colors[i], flexShrink:0, boxShadow:`0 0 6px ${colors[i]}99` }}/>
            <span style={{ fontSize:12, color:s.muted, flex:1, fontWeight:500 }}>{d.label}</span>
            <span style={{ fontSize:11, fontFamily:"'JetBrains Mono'", color:s.text, fontWeight:700 }}>{Math.round((d.value/total)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

//  BALANCE LINE CHART
export function BalanceLine({ trend }) {
  const s = useTheme();
  let running = 0;
  const balances = trend.map(d => { running += d.income - d.expenses; return running; });

  const data = {
    labels: trend.map(d => d.month),
    datasets: [
      {
        label: "Balance", data: balances, borderColor: "#6366f1",
        backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0,0,0,200); g.addColorStop(0,"#6366f155"); g.addColorStop(1,"#6366f105"); return g; },
        borderWidth:3, pointRadius:5, pointHoverRadius:9,
        pointBackgroundColor:"#6366f1", pointHoverBackgroundColor:"#fff",
        pointBorderColor:"#6366f1", pointBorderWidth:2, pointHoverBorderWidth:3,
        fill:true, tension:.45,
      },
      {
        label: "Income", data: trend.map(d => d.income), borderColor: "#10b98170",
        backgroundColor: "transparent", borderWidth:1.8, borderDash:[5,4],
        pointRadius:3, pointHoverRadius:6, pointBackgroundColor:"#10b981", fill:false, tension:.45,
      },
      {
        label: "Expenses", data: trend.map(d => d.expenses), borderColor: "#f43f5e70",
        backgroundColor: "transparent", borderWidth:1.8, borderDash:[5,4],
        pointRadius:3, pointHoverRadius:6, pointBackgroundColor:"#f43f5e", fill:false, tension:.45,
      },
    ],
  };

  return (
    <Line data={data} options={{
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1100, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display:true, position:"top", align:"end", labels:{ color: s.dark?"#4f637d":"#94a3b8", font:{family:"'Sora'",size:11,weight:"500"}, usePointStyle:true, pointStyleWidth:8, boxHeight:8, padding:14 } },
        tooltip: { ...ttBase(s.dark), callbacks:{ label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` } },
      },
      scales: {
        x: { grid:{display:false}, border:{display:false}, ticks:{color:s.dark?"#3d5068":"#94a3b8",font:{family:"'Sora'",size:11,weight:"600"}} },
        y: {
          grid: { color:s.dark?"rgba(99,102,241,.06)":"rgba(99,102,241,.05)", drawTicks:false },
          border: { display:false, dash:[4,4] },
          ticks: { color:s.dark?"#3d5068":"#94a3b8", font:{family:"'Sora'",size:10}, callback:v=>"₹"+(v/1000).toFixed(0)+"k", maxTicksLimit:5 },
        },
      },
    }}/>
  );
}

//  CATEGORY HORIZONTAL BAR CHART
export function CategoryBar({ breakdown, totalExpenses }) {
  const s = useTheme();
  const colors = breakdown.map(d => catColor(d.label));

  return (
    <Bar
      data={{ labels: breakdown.map(d => d.label), datasets:[{ label:"Amount", data:breakdown.map(d=>d.value), backgroundColor:colors.map(c=>c+"bb"), hoverBackgroundColor:colors, borderRadius:8, borderSkipped:false, borderColor:colors, borderWidth:{left:3,right:0,top:0,bottom:0} }] }}
      options={{
        indexAxis: "y", responsive:true, maintainAspectRatio:false,
        animation: { duration:1000, easing:"easeOutQuart" },
        plugins: {
          legend: { display:false },
          tooltip: { ...ttBase(s.dark), callbacks:{ label: ctx => ` ${fmt(ctx.raw)} — ${Math.round((ctx.raw/totalExpenses)*100)}% of total` } },
        },
        scales: {
          x: { grid:{color:s.dark?"rgba(99,102,241,.06)":"rgba(99,102,241,.05)",drawTicks:false}, border:{display:false}, ticks:{color:s.dark?"#3d5068":"#94a3b8",font:{family:"'Sora'",size:10},callback:v=>"₹"+(v/1000).toFixed(0)+"k",maxTicksLimit:5} },
          y: { grid:{display:false}, border:{display:false}, ticks:{color:s.dark?"#94a3b8":"#475569",font:{family:"'Sora'",size:12,weight:"600"}} },
        },
      }}
    />
  );
}
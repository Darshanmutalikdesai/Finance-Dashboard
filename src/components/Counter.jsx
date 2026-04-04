import React, { useState, useEffect, useRef } from "react";


//  ANIMATED COUNTER
//  Counts up from 0 → `to` over `dur` ms with an ease-out curve.
export default function Counter({ to, dur = 950 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [to, dur]);

  return <span>₹{Number(val).toLocaleString("en-IN")}</span>;
}
"use client";

import React, { useState, useEffect, useRef } from "react";

export const AnimatedCount = ({
  value,
  duration = 1100,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = eased * value;
      setDisplay(
        decimals ? parseFloat(current.toFixed(decimals)) : Math.round(current),
      );
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, decimals]);

  return <>{display.toLocaleString()}</>;
};

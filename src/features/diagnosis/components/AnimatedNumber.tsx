"use client";

import { useState, useEffect } from "react";

type Props = {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

export default function AnimatedNumber({ target, suffix = "", prefix = "", duration = 1200 }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return (
    <>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </>
  );
}

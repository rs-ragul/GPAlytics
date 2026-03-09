"use client";

import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
  suffix?: string;
}

export function AnimatedNumber({ 
  value, 
  decimals = 2, 
  className = "",
  suffix = ""
}: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => 
    current.toFixed(decimals)
  );
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span>{display}</motion.span>
      {suffix && <span className="ml-1">{suffix}</span>}
    </motion.span>
  );
}

interface NumberCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

export function NumberCounter({ value, label, icon, color = "text-primary" }: NumberCounterProps) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      <div className={`text-4xl font-bold ${color} mb-1`}>
        <AnimatedNumber value={value} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}


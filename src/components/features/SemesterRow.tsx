"use client";

import { motion } from "framer-motion";
import { X, Calendar } from "lucide-react";

interface SemesterRowProps {
  id: string;
  name: string;
  gpa: number;
  credits: number;
  onNameChange: (id: string, name: string) => void;
  onGPAChange: (id: string, gpa: number) => void;
  onCreditsChange: (id: string, credits: number) => void;
  onRemove: (id: string) => void;
}

export function SemesterRow({
  id,
  name,
  gpa,
  credits,
  onNameChange,
  onGPAChange,
  onCreditsChange,
  onRemove,
}: SemesterRowProps) {
  return (
    <motion.div
      className="grid grid-cols-12 gap-3 items-center p-4 bg-white/5 rounded-xl border border-white/5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="col-span-1 flex justify-center">
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="col-span-4">
        <input
          type="text"
          placeholder="Semester name (e.g., Fall 2024)"
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="col-span-3">
        <input
          type="number"
          min="0"
          max="10"
          step="0.01"
          value={gpa || ""}
          onChange={(e) => onGPAChange(id, parseFloat(e.target.value) || 0)}
          placeholder="GPA"
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border text-sm text-center focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="col-span-3">
        <input
          type="number"
          min="0"
          value={credits || ""}
          onChange={(e) => onCreditsChange(id, parseInt(e.target.value) || 0)}
          placeholder="Credits"
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border text-sm text-center focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <button
          onClick={() => onRemove(id)}
          className="p-2 rounded-lg hover:bg-error/20 text-muted-foreground hover:text-error transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface SemesterTableHeaderProps {}

export function SemesterTableHeader({}: SemesterTableHeaderProps) {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-2 text-sm font-medium text-muted-foreground">
      <div className="col-span-1"></div>
      <div className="col-span-4">Semester</div>
      <div className="col-span-3 text-center">GPA</div>
      <div className="col-span-3 text-center">Credits</div>
      <div className="col-span-1"></div>
    </div>
  );
}


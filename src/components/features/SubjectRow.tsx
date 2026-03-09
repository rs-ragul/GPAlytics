"use client";

import { motion } from "framer-motion";
import { X, GripVertical } from "lucide-react";
import { GRADES, GRADE_POINTS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SubjectRowProps {
  id: string;
  name: string;
  credits: number;
  grade: string;
  onNameChange: (id: string, name: string) => void;
  onCreditsChange: (id: string, credits: number) => void;
  onGradeChange: (id: string, grade: string) => void;
  onRemove: (id: string) => void;
}

export function SubjectRow({
  id,
  name,
  credits,
  grade,
  onNameChange,
  onCreditsChange,
  onGradeChange,
  onRemove,
}: SubjectRowProps) {
  return (
    <motion.div
      className="grid grid-cols-12 gap-3 items-center p-4 bg-white/5 rounded-xl border border-white/5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="col-span-1 flex justify-center">
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
      </div>
      
      <div className="col-span-4">
        <input
          type="text"
          placeholder="Subject name"
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="col-span-2">
        <input
          type="number"
          min="1"
          max="6"
          value={credits}
          onChange={(e) => onCreditsChange(id, parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border text-sm text-center focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="col-span-4">
        <select
          value={grade}
          onChange={(e) => onGradeChange(id, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value="">Select</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g} ({GRADE_POINTS[g]})
            </option>
          ))}
        </select>
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

interface SubjectTableHeaderProps {}

export function SubjectTableHeader({}: SubjectTableHeaderProps) {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-2 text-sm font-medium text-muted-foreground">
      <div className="col-span-1"></div>
      <div className="col-span-4">Subject Name</div>
      <div className="col-span-2 text-center">Credits</div>
      <div className="col-span-4 text-center">Grade</div>
      <div className="col-span-1"></div>
    </div>
  );
}


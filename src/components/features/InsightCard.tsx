"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Zap, 
  Star, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Info 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Insight } from "@/lib/insights";

const iconMap = {
  trophy: Trophy,
  "trending-up": TrendingUp,
  target: Target,
  zap: Zap,
  star: Star,
  users: Users,
  "alert-circle": AlertCircle,
  "check-circle": CheckCircle,
  info: Info,
};

const typeStyles = {
  success: {
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "text-success",
    glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "text-warning",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  info: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: "text-primary",
    glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]",
  },
};

interface InsightCardProps {
  insight: Insight;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const Icon = iconMap[insight.icon as keyof typeof iconMap] || Info;
  const style = typeStyles[insight.type];

  return (
    <motion.div
      className={cn(
        "relative p-5 rounded-xl border transition-all duration-300",
        style.bg,
        style.border,
        style.glow,
        "card-hover"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-lg bg-white/10", style.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">
            {insight.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface InsightsListProps {
  insights: Insight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) {
    return (
      <div className="text-center py-12">
        <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Add subjects to see personalized insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <InsightCard key={insight.id} insight={insight} index={index} />
      ))}
    </div>
  );
}


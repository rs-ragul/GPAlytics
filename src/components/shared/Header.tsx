"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Calculator, 
  FileText, 
  Scan, 
  Lightbulb, 
  TrendingUp,
  LayoutDashboard,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: GraduationCap },
  { href: "/gpa", label: "GPA Calculator", icon: Calculator },
  { href: "/cgpa", label: "CGPA Calculator", icon: FileText },
  { href: "/scan", label: "Scan Results", icon: Scan },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/predict", label: "Predictor", icon: TrendingUp },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="mx-auto max-w-7xl px-4 py-4">
        <div className="glass rounded-full px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">GradePilot</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "text-white" 
                        : "text-muted-foreground hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-lg"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button - simplified for now */}
            <div className="md:hidden">
              <Link href="/gpa" className="text-sm text-primary font-medium">
                Calculate
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}


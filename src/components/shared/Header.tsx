"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Calculator, 
  FileText, 
  ChevronDown,
  Scan, 
  Lightbulb, 
  TrendingUp,
  LayoutDashboard,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const calculatorItems = [
  { href: "/gpa-calculator", label: "GPA Calculator" },
  { href: "/sgpa-calculator", label: "SGPA Calculator" },
  { href: "/cgpa-calculator", label: "CGPA Calculator" },
];

const mainNavItems = [
  { href: "/", label: "Home", icon: GraduationCap },
  { href: "/predict", label: "Predictor", icon: TrendingUp },
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/about", label: "About", icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const isCalculatorActive = calculatorItems.some((item) => pathname === item.href);

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
            <Link href="/" className="flex items-center gap-2 mr-3">
              <Image
                src="/gpalyticslogo.png"
                alt="GPAlytics logo"
                width={40}
                height={40}
                className="rounded-xl"
                priority
              />
              <span className="text-xl font-bold gradient-text">GPAlytics</span>
            </Link>

            <div className="hidden md:flex items-center gap-1 ml-3">
              {mainNavItems.slice(0, 1).map((item) => {
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

              <div className="relative group">
                <button
                  type="button"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    isCalculatorActive
                      ? "text-white bg-primary/20"
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Calculator className="w-4 h-4" />
                  Calculators
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute left-0 top-full mt-2 hidden group-hover:block group-focus-within:block min-w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl">
                  {calculatorItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-primary/20 text-white"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {mainNavItems.slice(1).map((item) => {
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
              <Link href="/gpa-calculator" className="text-sm text-primary font-medium">
                Calculate
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}


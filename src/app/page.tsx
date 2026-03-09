"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Calculator, 
  Scan, 
  TrendingUp, 
  Lightbulb, 
  Target,
  BarChart3,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { GlassCard } from "@/components/shared/GlassCard";

const features = [
  {
    icon: Calculator,
    title: "GPA Calculator",
    description: "Calculate your semester GPA with real-time updates and smart grade insights.",
    href: "/gpa",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "CGPA Tracker",
    description: "Track your cumulative GPA across all semesters with visual trends.",
    href: "/cgpa",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Scan,
    title: "OCR Scanner",
    description: "Upload result screenshots and automatically extract grades using AI.",
    href: "/scan",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Get personalized academic recommendations based on your performance.",
    href: "/insights",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Target,
    title: "Goal Simulator",
    description: "Predict future CGPA and set achievable academic goals.",
    href: "/predict",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "View comprehensive analytics and track your academic journey.",
    href: "/dashboard",
    color: "from-indigo-500 to-violet-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 mesh-gradient" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Academic Analytics</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Smart GPA & CGPA</span>
              <br />
              <span className="gradient-text">Calculator for Students</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Calculate, track, and predict your academic performance with advanced analytics 
              and intelligent insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/gpa">
                <AnimatedButton 
                  size="lg" 
                  icon={<Calculator className="w-5 h-5" />}
                >
                  Calculate GPA
                </AnimatedButton>
              </Link>
              <Link href="/scan">
                <AnimatedButton 
                  size="lg" 
                  variant="outline"
                  icon={<Scan className="w-5 h-5" />}
                >
                  Upload Result Screenshot
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: "10+", label: "Grade Scales" },
              { value: "100%", label: "Client-Side" },
              { value: "0", label: "API Costs" },
              { value: "24/7", label: "Available" },
            ].map((stat, index) => (
              <GlassCard key={stat.label} className="py-4 px-2">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools to help you understand, track, and improve your academic performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <GlassCard hover className="h-full group">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Optimize Your Grades?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Start calculating your GPA now and discover insights that can help you achieve your academic goals.
              </p>
              <Link href="/gpa">
                <AnimatedButton size="lg" icon={<Calculator className="w-5 h-5" />}>
                  Get Started Free
                </AnimatedButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2024 GradePilot. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}


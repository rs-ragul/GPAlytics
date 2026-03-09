"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { 
  GraduationCap, 
  Shield, 
  Code, 
  Sparkles,
  Globe,
  Linkedin,
  Github,
  Instagram
} from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "Website",
    href: "https://rscreationstech.vercel.app/",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ragulethicalhacker/",
    icon: Linkedin,
    color: "from-blue-600 to-blue-700",
  },
  {
    name: "GitHub",
    href: "https://github.com/rs-ragul",
    icon: Github,
    color: "from-gray-600 to-gray-800",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ragul._.rs",
    icon: Instagram,
    color: "from-pink-500 to-purple-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About the <span className="gradient-text">Creator</span>
          </h1>
        </motion.div>

        {/* Creator Profile */}
        <GlassCard className="mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-primary" />
                </div>
              </div>
              <motion.div
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-success flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-2">Ragul S</h2>
                <p className="text-muted-foreground mb-4">
                  Computer Science (Cybersecurity) Student
                </p>
              </motion.div>

              <motion.p
                className="text-lg leading-relaxed text-foreground/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                This project was built by Ragul S, a Computer Science (Cybersecurity) student 
                passionate about ethical hacking, software development, and building tools 
                that help students analyze their academic performance.
              </motion.p>
            </div>
          </div>
        </GlassCard>

        {/* Skills & Interests */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <GlassCard>
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Ethical Hacking</h3>
              <p className="text-sm text-muted-foreground">
                Cybersecurity enthusiast focused on identifying vulnerabilities and securing systems
              </p>
            </motion.div>
          </GlassCard>

          <GlassCard>
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                <Code className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Software Development</h3>
              <p className="text-sm text-muted-foreground">
                Building modern web applications and tools using cutting-edge technologies
              </p>
            </motion.div>
          </GlassCard>

          <GlassCard>
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Education</h3>
              <p className="text-sm text-muted-foreground">
                Creating tools that help students track and improve their academic performance
              </p>
            </motion.div>
          </GlassCard>
        </div>

        {/* Social Links */}
        <GlassCard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-center">
              Connect with <span className="gradient-text">Ragul S</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center gap-2 transition-transform group-hover:scale-105 group-hover:shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">{link.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </GlassCard>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


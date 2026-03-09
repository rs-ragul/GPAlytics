"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, Linkedin, Github, Instagram } from "lucide-react";

const socialLinks = [
  {
    name: "Website",
    href: "https://rscreationstech.vercel.app/",
    icon: Globe,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ragulethicalhacker/",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/rs-ragul",
    icon: Github,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ragul._.rs",
    icon: Instagram,
  },
];

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Image
              src="/gpalyticslogo.png"
              alt="GPAlytics logo"
              width={32}
              height={32}
              className="rounded-lg"
              loading="lazy"
            />
            <span className="text-lg font-bold gradient-text">GPAlytics</span>
          </div>

          {/* Internal SEO Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-white transition-colors">
              About
            </Link>
            <Link href="/gpa-calculator" className="text-muted-foreground hover:text-white transition-colors">
              GPA Calculator
            </Link>
            <Link href="/cgpa-calculator" className="text-muted-foreground hover:text-white transition-colors">
              CGPA Calculator
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-white transition-colors">
              Blog
            </Link>
          </div>

          {/* Creator Credits */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Built by <span className="text-white font-medium">Ragul S</span> –{" "}
              <span className="gradient-text font-medium">RS Creations Tech</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  title={link.name}
                >
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          © {new Date().getFullYear()} GPAlytics. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}


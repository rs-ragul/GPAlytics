"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { getFirebaseAuth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/authErrors";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validateForm(): boolean {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setError("");

    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      const friendlyMessage = getAuthErrorMessage(err);
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Login to GPAlytics</h1>
            <p className="text-muted-foreground mt-2">
              Access your personal dashboard and saved academic records.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                }}
                className={`w-full px-4 py-3 rounded-xl bg-background/50 border outline-none transition-colors ${
                  emailError
                    ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                className={`w-full px-4 py-3 rounded-xl bg-background/50 border outline-none transition-colors ${
                  passwordError
                    ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}
                placeholder="Enter your password"
              />
              {passwordError && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {passwordError}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 text-sm text-success bg-success/10 border border-success/30 rounded-lg p-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <AnimatedButton
              type="submit"
              className="w-full"
              loading={loading}
              disabled={success !== ""}
              icon={<LogIn className="w-4 h-4" />}
            >
              Login
            </AnimatedButton>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

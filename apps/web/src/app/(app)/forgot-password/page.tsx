"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Mail, Lock, Check, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="fixed inset-0 flex min-h-screen flex-col overflow-y-auto font-sans bg-background-dark">
      {/* Subtle gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--sj-brand-rgb), 0.12) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <Link
          href="/login"
          className="mb-10 flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-slate-100">
            Shadow<span className="text-brand">Journal</span>
          </span>
        </Link>

        {/* Central card */}
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-dark/95 p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
          <h1 className="mb-2 font-headline text-3xl font-bold text-slate-100 md:text-4xl">
            Reclaim your <span className="italic">light.</span>
          </h1>
          <p className="mb-8 font-sans text-slate-400">
            Enter the email associated with your psyche to receive a reset link.
          </p>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="rounded-xl border-white/10 bg-background-dark/80 pl-12 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="w-full justify-center gap-2"
            >
              Send reset link
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center gap-6 font-sans text-[11px] uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" />
              Private
            </span>
          </div>
          <div className="flex gap-4 font-sans text-[11px] uppercase tracking-wider text-slate-500">
            <Link href="#" className="text-brand hover:underline">
              Privacy policy
            </Link>
            <Link href="#" className="text-brand hover:underline">
              Terms of service
            </Link>
          </div>
          <p className="font-sans text-[11px] uppercase tracking-wider text-slate-600">
            © 2024 Shadow Journal
          </p>
        </div>
      </div>
    </div>
  );
}

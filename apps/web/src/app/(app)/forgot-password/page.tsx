"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/providers/Auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuthContext();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(null);

    const { error: resetError } = await resetPassword(values.email.trim());

    if (resetError) {
      const message = resetError.message?.toLowerCase() ?? "";
      if (message.includes("rate") && message.includes("limit")) {
        setError(
          "We've already sent a reset email recently. Please check your inbox (and spam) and try again in a few minutes if needed.",
        );
      } else {
        setError(
          resetError.message || "Something went wrong. Please try again.",
        );
      }
      return;
    }

    setSuccess("If an account exists for that email, we've sent a reset link.");
  };

  return (
    <div className="bg-background-dark fixed inset-0 flex min-h-screen flex-col overflow-y-auto font-sans">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--sj-brand-rgb), 0.12) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <Link
          href="/signin"
          className="mb-10 flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <img
            src="/images/brandLogo.png"
            alt="Shadow Journal"
            className="h-9 w-9 rounded-full object-contain"
          />
          <span className="font-sans text-xl font-bold tracking-tight text-slate-100">
            Shadow<span className="text-brand">Journal</span>
          </span>
        </Link>

        <div className="bg-surface-dark/95 w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
          <h1 className="font-headline mb-2 text-3xl font-bold text-slate-100 md:text-4xl">
            Reclaim your <span className="italic">light.</span>
          </h1>
          <p className="mb-8 font-sans text-slate-400">
            Enter the email associated with your psyche to receive a reset link.
          </p>

          {error && (
            <Alert
              variant="destructive"
              className="mb-4"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium tracking-[0.15em] text-slate-500 uppercase"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="bg-background-dark/80 focus-visible:ring-brand rounded-xl border-white/10 pl-12 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="w-full justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
              {!isSubmitting && <ArrowRight className="h-5 w-5" />}
            </Button>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-brand inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to sign in
            </Link>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center gap-6 font-sans text-[11px] tracking-wider text-slate-500 uppercase">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" />
              Private
            </span>
          </div>
          <div className="flex gap-4 font-sans text-[11px] tracking-wider text-slate-500 uppercase">
            <Link
              href="#"
              className="text-brand hover:underline"
            >
              Privacy policy
            </Link>
            <Link
              href="#"
              className="text-brand hover:underline"
            >
              Terms of service
            </Link>
          </div>
          <p className="font-sans text-[11px] tracking-wider text-slate-600 uppercase">
            (c) 2026 Shadow Journal
          </p>
        </div>
      </div>
    </div>
  );
}

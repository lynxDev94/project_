"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Check, ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/providers/Auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, signOut } = useAuthContext();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(null);
    setSuccess(null);

    const { error } = await updatePassword(values.password);

    if (error) {
      setError(
        error.message ||
          "Unable to reset password. The link may be invalid or expired.",
      );
      return;
    }

    // For stricter security: clear any session established via the reset link
    await signOut();

    setSuccess("Your password has been updated. Please sign in with your new password.");

    // After a short delay, redirect to sign-in (without auto-login)
    setTimeout(() => {
      router.push("/signin?message=Password%20updated%20successfully");
    }, 2000);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
            Set a new <span className="italic">password.</span>
          </h1>
          <p className="mb-8 font-sans text-slate-400">
            Choose a strong password to protect your Shadow Journal.
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
                htmlFor="password"
                className="text-xs font-medium tracking-[0.15em] text-slate-500 uppercase"
              >
                New password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className="bg-background-dark/80 focus-visible:ring-brand rounded-xl border-white/10 pl-4 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-xs font-medium tracking-[0.15em] text-slate-500 uppercase"
              >
                Confirm password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="bg-background-dark/80 focus-visible:ring-brand rounded-xl border-white/10 pl-4 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="w-full justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-brand inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
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
          <p className="font-sans text-[11px] tracking-wider text-slate-600 uppercase">
            © 2024 Shadow Journal
          </p>
        </div>
      </div>
    </div>
  );
}


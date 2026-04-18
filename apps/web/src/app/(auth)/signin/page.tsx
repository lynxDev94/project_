"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/providers/Auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LOGIN_BG_IMAGE = "/images/login-bg.png";

const signinSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const { signIn, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("redirect");
  const postAuthPath =
    raw?.startsWith("/dashboard") && !raw.startsWith("//") ? raw : "/dashboard";

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showManualRedirect, setShowManualRedirect] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const urlMessage = searchParams.get("message");
    if (urlMessage) {
      setMessage(urlMessage);
    }

    const urlError = searchParams.get("error");
    if (urlError) {
      setError(urlError);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(postAuthPath);
    }
  }, [isAuthenticated, router, postAuthPath]);

  const onSubmit = async (values: SigninFormValues) => {
    setError(null);

    try {
      const result = await signIn({
        email: values.email.trim(),
        password: values.password,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        setShowManualRedirect(true);
      }, 5000);
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex min-h-screen overflow-y-auto font-sans">
      <div className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden lg:flex">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${LOGIN_BG_IMAGE})` }}
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(180deg, rgba(var(--sj-background-dark-rgb), 0.85) 0%, rgba(var(--sj-background-dark-rgb), 0.75) 100%)`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <img
              src="/images/brandLogo.png"
              alt="Shadow Journal"
              className="h-8 w-8 rounded-full object-contain"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-slate-100">
              Shadow<span className="text-brand">Journal</span>
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="font-headline text-4xl leading-tight font-bold text-slate-100 xl:text-5xl">
              <span className="font-medium">Enter the </span>
              <span className="glow-text text-brand">Unconscious.</span>
            </h1>
            <p className="max-w-md font-sans text-lg leading-relaxed text-slate-400">
              Begin your journey into the depths of the self with AI-guided
              Jungian insights. Face your shadow, integrate your persona, and
              find wholeness.
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <Lock className="h-4 w-4" />
            Private journaling with a secure connection
          </div>
        </div>
      </div>

      <div className="bg-surface-dark relative flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-16">
        <div className="mx-auto w-full max-w-md space-y-8">
          <Link
            href="/"
            className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 backdrop-blur-sm hover:bg-white/10 hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold text-slate-100 md:text-4xl">
              Welcome back
            </h2>
            <p className="font-sans text-slate-400">
              Continue your path to individuation.
            </p>
            {message && !isSuccess && (
              <Alert className="mb-4 bg-blue-50 text-blue-800">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-dark px-4 text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">
                Continue with email
              </span>
            </div>
          </div>

          {isSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription className="flex flex-col gap-2">
                <span>Success! We're redirecting you to the dashboard...</span>
                {showManualRedirect && (
                  <Button
                    type="button"
                    onClick={() => router.push(postAuthPath)}
                    variant="outline"
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Go to Dashboard Now
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-400"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 pl-12 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-400"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-brand text-sm font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 pl-12 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="w-full"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting
                ? "Signing in..."
                : isSuccess
                  ? "Signed In Successfully"
                  : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand font-medium hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-end gap-1 text-right text-[11px] tracking-wider text-slate-500 uppercase">
          <div className="flex gap-4">
            <Link
              href="#"
              className="hover:text-slate-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-slate-400"
            >
              Terms of Service
            </Link>
          </div>
          <p>
            © 2024 Shadow Journal Lab. For personal growth purposes only. Not a
            substitute for medical therapy.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/providers/Auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LOGIN_BG_IMAGE = "/images/login-bg.png";

export default function SigninInterface() {
  const { signIn, signInWithGoogle, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showManualRedirect, setShowManualRedirect] = useState<boolean>(false);

  // Handle URL parameters
  useEffect(() => {
    // Check for message parameter
    const urlMessage = searchParams.get("message");
    if (urlMessage) {
      setMessage(urlMessage);
    }

    // Check for error parameter
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(urlError);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // Show success message and set up manual redirect timer
      setIsSuccess(true);

      // Set a timer to show manual redirect button after 5 seconds
      setTimeout(() => {
        setShowManualRedirect(true);
      }, 5000);
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await signInWithGoogle();
    if (error) {
      setIsLoading(false);
      setError(error.message);

      return;
    }

  }

  // keep isLoading: true, as we're doing a redirect
  return (
    <div className="fixed inset-0 flex min-h-screen overflow-y-auto font-sans">
      {/* Left: Branding — full-height background image + overlay */}
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
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brandLogo.png"
              alt="Shadow Journal"
              className="h-8 w-8 object-contain rounded-full"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-slate-100">
              Shadow<span className="text-brand">Journal</span>
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold leading-tight text-slate-100 xl:text-5xl">
              <span className="font-medium">Enter the </span>
              <span className="glow-text text-brand">Unconscious.</span>
            </h1>
            <p className="max-w-md font-sans text-lg leading-relaxed text-slate-400">
              Begin your journey into the depths of the self with AI-guided
              Jungian insights. Face your shadow, integrate your persona, and find
              wholeness.
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <Lock className="h-4 w-4" />
            Encrypted & Private Journaling
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex w-full flex-col justify-between bg-surface-dark p-8 lg:w-1/2 lg:p-16">
        <div className="mx-auto w-full max-w-md space-y-8">
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
          {/* 
          <Button
            type="button"
            variant="outlineDark"
            size="xl"
            className="w-full justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button> */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-dark px-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
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
                    onClick={() => router.push("/dashboard")}
                    variant="outline"
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Go to Dashboard Now
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}


          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-400">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="rounded-xl border-white/10 bg-surface-dark pl-12 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-brand"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-400">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute z-10 left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  className="rounded-xl border-white/10 bg-surface-dark pl-12 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-brand"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" variant="primary" size="xl" className="w-full" disabled={isLoading || isSuccess}>
            {isLoading
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
              className="font-medium text-brand hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-end gap-1 text-right text-[11px] uppercase tracking-wider text-slate-500">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-400">
              Terms of Service
            </Link>
          </div>
          <p>© 2024 Shadow Journal Lab. For personal growth purposes only. Not a substitute for medical therapy.</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { z } from "zod";
import { Lock, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/Auth";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SIGNUP_BG_IMAGE = "/images/signup-bg.png";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms to continue",
    }),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signUp } = useAuthContext();
  const router = useRouter();

  const [formValues, setFormValues] = useState<Partial<SignupFormValues>>({
    firstName: "",
    lastName: "",
    companyName: "",
    termsAccepted: false,
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormValues, string>>
  >({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = () => {
    try {
      signupSchema.parse(formValues);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof SignupFormValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof SignupFormValues] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await signUp({
        email: formValues.email!,
        password: formValues.password!,
        metadata: {
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          company_name: formValues.companyName || null,
          name: `${formValues.firstName} ${formValues.lastName}`.trim(),
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      router.push(
        "/signin?message=Please check your email to confirm your account",
      );
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex min-h-screen overflow-y-auto font-sans">
      <div className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden lg:flex">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${SIGNUP_BG_IMAGE})` }}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
              <span className="font-medium">Begin your </span>
              <span className="glow-text text-brand">Individuation.</span>
            </h1>
            <p className="max-w-md font-sans text-lg leading-relaxed text-slate-400">
              Start your journey into the depths of the self. Integrate your
              shadow, explore your psyche, and find wholeness through AI-guided
              Jungian insights.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm">
              <p className="font-sans text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
                Private & Encrypted
              </p>
              <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-slate-400">
                Your unconscious is yours alone. All entries are end-to-end
                encrypted.
              </p>
            </div>

            <div className="flex gap-6 font-sans text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="uppercase">Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="h-4 w-4" />
                <span className="uppercase">Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-dark relative flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-16">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold text-slate-100 md:text-4xl">
              Create an account
            </h2>
            <p className="font-sans text-slate-400">
              Join thousands exploring the depths of their psyche.
            </p>
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

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="font-sans text-slate-400"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 font-sans text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                  type="text"
                  placeholder="John"
                  value={formValues.firstName || ""}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="font-sans text-slate-400"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formValues.lastName || ""}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.lastName}
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 font-sans text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-sans text-slate-400"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formValues.email || ""}
                  onChange={handleInputChange}
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 font-sans text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-sans text-slate-400"
              >
                Password
              </Label>
              <div className="relative">
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formValues.password || ""}
                  onChange={handleInputChange}
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 font-sans text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-sans text-slate-400"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formValues.confirmPassword || ""}
                  onChange={handleInputChange}
                  className="bg-surface-dark focus-visible:ring-brand rounded-xl border-white/10 font-sans text-slate-100 placeholder:text-slate-500 focus-visible:ring-2"
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={!!formValues.termsAccepted}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    termsAccepted: e.target.checked,
                  }))
                }
                aria-invalid={!!errors.termsAccepted}
                className="bg-surface-dark text-brand focus:ring-brand mt-1 h-4 w-4 rounded border-white/20"
              />
              <span className="font-sans text-sm text-slate-400">
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-brand hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-brand hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-destructive mt-1 text-sm">
                {errors.termsAccepted}
              </p>
            )}

            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center font-sans text-slate-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-brand font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-end gap-1 text-right font-sans text-[11px] tracking-wider text-slate-500 uppercase">
          <div className="flex items-center gap-2">
            <Link
              href="/privacy-policy"
              className="hover:text-slate-400"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms-of-service"
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

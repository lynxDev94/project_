import { Mail } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-background-dark border-t border-white/5 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <img
                src="/images/brandLogo.png"
                alt="Shadow Journal"
                className="h-6 w-6 rounded-full object-contain"
              />
              <span className="font-sans text-lg font-bold tracking-tight">
                Shadow<span className="text-brand">Journal</span>
              </span>
            </div>
            <p className="mb-6 max-w-sm text-slate-500">
              Shadow Journal is a Jungian journal dedicated to the
              democratization of depth psychology tools. We believe everyone
              deserves a mirror to help them understand themselves better.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:bg-brand/20 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors"
              >
                <Mail className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-6 font-sans font-bold text-slate-100">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link
                  href="#process"
                  className="hover:text-brand transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#safety"
                  className="hover:text-brand transition-colors"
                >
                  Safety
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-brand transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 font-sans font-bold text-slate-100">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link
                  href="#philosophy"
                  className="hover:text-brand transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-brand transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-600 md:flex-row">
          <p>
            © 2026 Shadow Journal. For personal growth purposes only. Not a
            substitute for medical therapy.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-slate-400"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-slate-400"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

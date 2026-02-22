import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="bg-background-dark/80 fixed top-0 right-0 left-0 z-50 border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/home"
          className="flex items-center gap-2"
        >
          <img
            src="/images/brandLogo.png"
            alt="Shadow Journal"
            className="h-8 w-8 rounded-full object-contain"
          />
          <span className="font-sans text-xl font-bold tracking-tight">
            <span className="text-brand"> Shadow</span>
            <span className="font-extralight text-white">Journal</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <Link
            href="#"
            className="hover:text-brand transition-colors"
          >
            Philosophy
          </Link>
          <Link
            href="#"
            className="hover:text-brand transition-colors"
          >
            The Process
          </Link>
          <Link
            href="#"
            className="hover:text-brand transition-colors"
          >
            Safety
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="border-brand/20 bg-brand/10 hover:bg-brand/20 rounded-full border px-5 py-2 text-white transition-all"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-brand hover:bg-brand/90 rounded-full px-5 py-2 text-white transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

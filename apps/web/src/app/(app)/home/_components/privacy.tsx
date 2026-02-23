import { Lock, Shield } from "lucide-react";

export const Privacy = () => {
  return (
    <section
      id="safety"
      className="bg-surface-dark/20 relative border-y border-white/5 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-brand mb-3 block text-xs font-bold tracking-widest uppercase">
              Built for Privacy
            </span>
            <h2 className="font-headline mb-6 text-3xl font-light md:text-4xl">
              Your Thoughts Stay Private
            </h2>
            <p className="mb-8 text-lg text-slate-400">
              Your journal is personal - it should stay that way. We use secure
              authentication, encrypted connections, and privacy-first design so
              your entries stay protected and under your control.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Lock className="text-brand mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-slate-100">
                    Encrypted Connection (HTTPS)
                  </h4>
                  <p className="text-sm text-slate-400">
                    Your entries are protected while being sent and saved.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Shield className="text-brand mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-slate-100">
                    Private Access Only
                  </h4>
                  <p className="text-sm text-slate-400">
                    Only you can view your entries — protected by secure
                    authentication.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Shield className="text-brand mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-slate-100">
                    Delete Anytime
                  </h4>
                  <p className="text-sm text-slate-400">
                    You can delete entries or your account whenever you want.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <img
              src="/images/privacy.png"
              alt="Locked journal on a desk"
              className="mx-auto mb-4 h-24 w-auto rounded-xl object-cover"
            />
            <p className="mb-2 font-sans text-sm font-semibold text-slate-100">
              Private by Design
            </p>
            <p className="text-xs text-slate-500">
              Your entries stay encrypted and in your control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

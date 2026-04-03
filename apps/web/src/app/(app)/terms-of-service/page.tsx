import Link from "next/link";

const COMPANY_NAME = "shadowMindJournal";
const CONTACT_EMAIL = "hello@shadowMindJournal.com";

export default function TermsOfServicePage() {
  return (
    <main className="bg-background-dark min-h-screen text-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Link href="/home" className="text-brand hover:text-brand/80 text-sm">
          &larr; Back to Home
        </Link>

        <h1 className="font-headline mt-6 text-4xl font-semibold text-white">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: April 3, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Agreement</h2>
            <p className="mt-2">
              These Terms of Service (the "Terms") are a legal agreement between you
              and {COMPANY_NAME} ("we", "us", "our"). By accessing or using Shadow
              Journal and related services (the "Services"), you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Eligibility and Accounts</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>You must provide accurate account information and keep it updated.</li>
              <li>You are responsible for activity under your account credentials.</li>
              <li>
                We may suspend or terminate accounts used for abuse, fraud, or violations
                of these Terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. License to Use the Service</h2>
            <p className="mt-2">
              We grant you a limited, non-exclusive, non-transferable, revocable license
              to use the Services for personal or internal business use in accordance with
              these Terms.
            </p>
            <p className="mt-2">
              You may not copy, reverse engineer, resell, or misuse the Services except as
              permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Paid Plans, Billing, and Credits</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Certain features require a paid subscription or one-time purchases. Billing
                is processed by Stripe.
              </li>
              <li>
                Subscription and top-up credits are consumed when you use eligible AI
                features.
              </li>
              <li>
                You can manage or cancel subscriptions via the billing portal where
                available.
              </li>
              <li>
                Fees are non-refundable except where required by law or explicitly stated.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. AI Features</h2>
            <p className="mt-2">
              AI output is generated automatically and may be incomplete or inaccurate. It
              is provided for reflection and informational purposes only, not medical,
              psychiatric, therapeutic, legal, or financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Acceptable Use</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Do not use the Services for unlawful, harmful, or fraudulent activity.</li>
              <li>Do not attempt to bypass security, abuse APIs, or disrupt operations.</li>
              <li>Do not upload content you do not have rights to use.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Third-Party Services</h2>
            <p className="mt-2">
              The Services rely on third-party providers (for example, hosting, payments,
              and model providers). We are not responsible for third-party service outages
              or policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Privacy</h2>
            <p className="mt-2">
              Your use of the Services is also governed by our
              {" "}
              <Link href="/privacy-policy" className="text-brand hover:text-brand/80">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Termination</h2>
            <p className="mt-2">
              You may stop using the Services at any time. We may suspend or terminate
              access if you materially violate these Terms or where required for security or
              legal reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Disclaimers</h2>
            <p className="mt-2">
              The Services are provided "as is" and "as available" to the maximum extent
              permitted by law, without warranties of uninterrupted availability,
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">11. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, we are not liable for indirect,
              incidental, special, consequential, or punitive damages, or loss of profits,
              data, or goodwill arising from your use of the Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">12. Changes to the Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use after changes means
              you accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">13. Governing Law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of the Republic of Lithuania, excluding
              conflict-of-law rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">14. Contact</h2>
            <p className="mt-2">
              Questions about these Terms can be sent to
              {" "}
              <a className="text-brand hover:text-brand/80" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

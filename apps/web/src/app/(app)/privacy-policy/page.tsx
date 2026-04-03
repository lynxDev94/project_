import Link from "next/link";

const COMPANY_NAME = "shadowMindJournal";
const CONTACT_EMAIL = "hello@shadowMindJournal.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background-dark min-h-screen text-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Link href="/home" className="text-brand hover:text-brand/80 text-sm">
          &larr; Back to Home
        </Link>

        <h1 className="font-headline mt-6 text-4xl font-semibold text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: April 3, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Who We Are</h2>
            <p className="mt-2">
              This Privacy Policy explains how {COMPANY_NAME} ("we", "us", "our")
              collects, uses, and shares personal information when you use Shadow Journal
              and related services (the "Services").
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Information We Collect</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-white">Account data:</span> email,
                authentication identifiers, and account preferences.
              </li>
              <li>
                <span className="font-medium text-white">Journal content:</span> entries,
                tags, and analysis requests you submit.
              </li>
              <li>
                <span className="font-medium text-white">Usage and device data:</span> log
                data such as IP address, browser/device metadata, and request timestamps.
              </li>
              <li>
                <span className="font-medium text-white">Payment data:</span> billing
                metadata, subscription status, and transaction references. Card details are
                processed by Stripe and are not stored by us.
              </li>
              <li>
                <span className="font-medium text-white">Support communications:</span>
                messages sent to us by email or support channels.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. How We Collect Data</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Directly from you (sign-up, journal writing, purchases, support).</li>
              <li>Automatically through normal operation of the Services.</li>
              <li>From service providers required to operate features (for example, Stripe).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. How We Use Data</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Provide and secure the Services.</li>
              <li>Process subscriptions, one-time purchases, and account management.</li>
              <li>Run AI analysis features that you explicitly request.</li>
              <li>Maintain product reliability, diagnose errors, and prevent abuse.</li>
              <li>Comply with legal, accounting, and tax obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. AI Processing</h2>
            <p className="mt-2">
              If you choose to use AI analysis features, relevant journal content is sent to
              our AI processing stack and model providers to generate a response. We do not
              sell your journal data.
            </p>
            <p className="mt-2">
              Model/provider retention and processing practices are governed by their own
              policies and agreements. You can avoid AI processing by not using AI analysis
              actions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Sharing of Information</h2>
            <p className="mt-2">We share data only where needed to operate the Services, including:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Infrastructure and authentication providers (for example, Supabase).</li>
              <li>Payment processors (for example, Stripe).</li>
              <li>AI orchestration/model providers for requested analysis operations.</li>
              <li>Legal authorities when required by law.</li>
            </ul>
            <p className="mt-2">We do not sell personal information to data brokers.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Data Retention</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Journal content and account data are retained while your account is active,
                unless you delete content earlier.
              </li>
              <li>
                After account deletion, data is removed subject to short operational backup
                windows and legal retention duties.
              </li>
              <li>
                Payment and accounting records may be retained for legally required periods.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Security</h2>
            <p className="mt-2">
              We use reasonable technical and organizational measures to protect data,
              including secure transport and controlled access. No online system is 100%
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Your Rights and Choices</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Access, update, or delete your account information.</li>
              <li>Delete journal content and account through product settings.</li>
              <li>Contact us for data access or deletion requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Children</h2>
            <p className="mt-2">
              The Services are not intended for children under 13, and we do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">11. International Transfers</h2>
            <p className="mt-2">
              Your data may be processed in jurisdictions other than your own as required to
              provide the Services. Where applicable, we use appropriate safeguards for
              international data transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">12. Policy Updates</h2>
            <p className="mt-2">
              We may update this policy from time to time. Material changes will be posted on
              this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">13. Contact</h2>
            <p className="mt-2">
              For privacy questions or requests, contact us at
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



import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VecoSoft collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-24">
      <Container className="max-w-3xl">
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-[var(--color-paper)]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-[var(--color-muted-2)]">Last updated: August 2026</p>

        <div className="prose-content mt-12 space-y-10 text-sm leading-relaxed text-[var(--color-muted)]">
          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">1. Overview</h2>
            <p>
              This Privacy Policy explains what information VecoSoft (&quot;we&quot;, &quot;us&quot;)
              collects when you use our website, contact us, request a quote, or apply for a role,
              and how that information is used, stored, and protected.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">2. Information We Collect</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Contact details you submit through our forms (name, email, phone, company)</li>
              <li>Project details submitted through our quote request form</li>
              <li>Application materials submitted through our careers page (CV, cover letter, links)</li>
              <li>Basic technical data such as browser type and pages visited, used for site analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">3. How We Use Your Information</h2>
            <p>We use the information you provide to:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Respond to inquiries and quote requests</li>
              <li>Evaluate job applications</li>
              <li>Improve our website and services</li>
              <li>Meet legal and contractual obligations</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">4. Job Application Data</h2>
            <p>
              CVs and application materials are stored securely and used solely to evaluate your
              candidacy. We retain application data for up to 12 months unless you request earlier
              deletion. You may request deletion of your application data at any time by emailing{" "}
              {SITE.email}.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">5. Data Security</h2>
            <p>
              We apply reasonable technical safeguards — including access controls, secure storage,
              and validated file uploads — to protect the data you share with us. No system is
              completely secure, and we work to minimize risk at every stage.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">6. Cookies</h2>
            <p>
              Our website may use minimal cookies for essential functionality and, where enabled,
              privacy-respecting analytics. You can control cookie preferences through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">7. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us at {SITE.email}.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">8. Contact</h2>
            <p>
              Questions about this policy can be sent to {SITE.email}.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

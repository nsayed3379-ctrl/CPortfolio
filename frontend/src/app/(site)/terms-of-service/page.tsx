import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of VecoSoft's website and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-24">
      <Container className="max-w-3xl">
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-[var(--color-paper)]">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-[var(--color-muted-2)]">Last updated: August 2026</p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-[var(--color-muted)]">
          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the VecoSoft website, you agree to be bound by these Terms of
              Service. If you do not agree, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">2. Use of This Website</h2>
            <p>
              This website is provided for informational purposes and to facilitate inquiries about
              our services. You agree not to misuse the site, attempt unauthorized access to our
              systems, or submit false information through our forms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">3. Intellectual Property</h2>
            <p>
              All content on this website — including text, design, graphics, and branding — is the
              property of VecoSoft unless otherwise stated, and may not be reproduced without
              permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">4. Project Engagements</h2>
            <p>
              Any actual client engagement, deliverables, pricing, timeline, and ownership terms are
              governed by a separate signed agreement between VecoSoft and the client, not by this
              website. Details shown on service and product pages are illustrative and may be
              adjusted per project scope.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">5. Job Applications</h2>
            <p>
              Submitting a job application through this website does not guarantee an interview or
              offer of employment. Application data is handled as described in our{" "}
              <Link href="/privacy-policy" className="focus-ring text-[var(--color-cyan)] underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">6. Limitation of Liability</h2>
            <p>
              VecoSoft is not liable for any indirect, incidental, or consequential damages arising
              from the use of this website. Information on this site is provided &quot;as is&quot;
              without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">7. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the website after
              changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[var(--color-paper)]">8. Contact</h2>
            <p>Questions about these Terms can be sent to {SITE.email}.</p>
          </section>
        </div>
      </Container>
    </div>
  );
}

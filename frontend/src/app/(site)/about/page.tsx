import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import TeamSection from "@/components/about/TeamSection";
import { sanityFetchList } from "@/sanity/fetch";
import { TEAM_MEMBER_LIST_QUERY } from "@/sanity/queries";
import { fallbackTeamMembers } from "@/sanity/fallbacks";
import type { TeamMemberDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "About Us",
  description: "VecoSoft is a technology studio building software, AI systems, and digital products for ambitious businesses.",
};

export default async function AboutPage() {

  const fetchedTeam = await sanityFetchList<TeamMemberDoc>(TEAM_MEMBER_LIST_QUERY, {}, { tags: ["teamMember"] });
  const team = fetchedTeam.length > 0 ? fetchedTeam : fallbackTeamMembers();

  return (
    <div>
      <section className="border-b border-[var(--color-border)] py-20">
        <Container>
          <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl">
            We build the software behind ambitious businesses.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)]">
            VecoSoft is a technology studio working across web, mobile, and AI — helping teams
            ship products that are fast, secure, and built to last well past launch day.
          </p>
        </Container>
      </section>

      <TeamSection members={team} />

      <section className="py-20 text-center">
        <Container>
          <h2 className="text-balance mx-auto max-w-lg text-3xl font-medium tracking-tight text-[var(--color-paper)]">
            Want to work together?
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/get-a-quote" variant="primary" showArrow>Get a Quote</Button>
            <Button href="/careers" variant="secondary">View Careers</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

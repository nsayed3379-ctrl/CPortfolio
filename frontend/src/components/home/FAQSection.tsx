"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { FAQS } from "@/lib/constants";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = { question: string; answer: string };

export default function FAQSection({ faqs: faqsProp }: { faqs?: Faq[] }) {
  const faqs = faqsProp && faqsProp.length > 0 ? faqsProp : FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions, answered directly."
        />
        <div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-medium text-[var(--color-paper)]">
                    {faq.question}
                  </span>
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 text-[var(--color-cyan)] transition-transform duration-200",
                      isOpen && "rotate-45"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

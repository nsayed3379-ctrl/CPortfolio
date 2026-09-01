import { SITE } from "@/lib/constants";
import { Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export default function ContactInfo() {
  const items = [
    { icon: Mail, label: "Email", value: SITE.email },
    { icon: MapPin, label: "Location", value: SITE.location },
    { icon: Clock, label: "Working Hours", value: "Sun–Thu, 10:00–18:00 (GMT+6)" },
    { icon: ShieldCheck, label: "Response Time", value: "Within 24–48 hours" },
  ];

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-cyan)]">
            <item.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted-2)]">{item.label}</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--color-paper)]">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

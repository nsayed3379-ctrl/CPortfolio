// This route is intentionally statically rendered and excluded from search
// engines (metadata/viewport come from next-sanity's own studio helpers,
// which set noindex) — the admin panel should never show up in Google.
export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

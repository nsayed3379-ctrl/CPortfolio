// A separate root layout for the /studio route group, using Next.js's
// "multiple root layouts" pattern (each top-level route group defines its
// own <html>/<body>). This is deliberate: the admin panel should never
// inherit the public site's Navbar, Footer, or metadata (title/OG tags) —
// it's a completely different application living at the same domain.
// Sanity Studio brings its own styling, so no CSS is imported here.

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button, Card, Stack, Text } from "@sanity/ui";
import { DownloadIcon } from "@sanity/icons/Download";
import type { StringInputProps } from "sanity";

// The `cvBase64` field stores a PDF as base64 text (see jobApplication.ts
// for why — no separate file-asset/public-URL exposure for something this
// sensitive). Left as Sanity's default text input, that field would
// render as an enormous, completely unreadable wall of characters — no
// way for an admin to actually open the CV they're supposed to be
// reviewing. This component replaces that default input entirely with a
// single button that turns the stored base64 back into an openable PDF,
// entirely client-side in the admin's own browser — nothing is
// re-uploaded or sent anywhere else to make this work.
//
// Uses a Blob URL, NOT a `data:` URI. The first version of this component
// used `href="data:application/pdf;base64,..."` directly — this looked
// correct and is a commonly-shown pattern, but modern Chrome/Edge/Firefox
// block top-level navigation to `data:` URIs as an anti-phishing measure,
// so clicking the button opened a blank "Untitled" tab showing nothing.
// Blob URLs (`URL.createObjectURL`) aren't subject to that restriction and
// are the standard fix for exactly this symptom.
export function CvFileInput(props: StringInputProps) {
  const base64 = typeof props.value === "string" ? props.value : undefined;
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const [decodeError, setDecodeError] = useState(false);

  useEffect(() => {
    // `atob`/`Blob`/`URL.createObjectURL` are browser-only APIs. Doing
    // this inside useEffect (never inside render/useMemo) guarantees it
    // only ever runs after client-side mount, never during any
    // server-side rendering pass Next.js might attempt for the Studio
    // shell — avoiding a "Blob is not defined" style SSR crash.
    //
    // No early-reset branch for a missing `base64` here: `blobUrl` and
    // `decodeError` already start at their correct defaults
    // (undefined/false), and this field is read-only and set once at
    // application-submission time — it doesn't flip from populated to
    // empty during this component's lifetime, so there's nothing to
    // reset back to.
    if (!base64) return;

    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // Same justified exception as Preloader.tsx: `url` only exists
      // after this browser-only decode work runs (can't be computed
      // during render/SSR), so storing it requires a setState call here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlobUrl(url);
      setDecodeError(false);
      return () => URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[CvFileInput] Failed to decode stored CV base64:", error);
      setDecodeError(true);
      setBlobUrl(undefined);
    }
  }, [base64]);

  if (!base64) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Text size={1} muted>
          No CV data on this document.
        </Text>
      </Card>
    );
  }

  if (decodeError) {
    return (
      <Card padding={3} radius={2} tone="critical" border>
        <Text size={1}>
          Couldn&apos;t decode the stored CV data — it may be corrupted. Check
          the browser console for details.
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap={3}>
      <Card padding={3} radius={2} tone="positive" border>
        <Text size={1}>
          A CV is on file. Click below to open it — your browser&apos;s built-in
          PDF viewer will handle previewing and downloading it.
        </Text>
      </Card>
      {blobUrl ? (
        <Button
          as="a"
          href={blobUrl}
          target="_blank"
          rel="noopener noreferrer"
          text="View / Download CV (PDF)"
          icon={DownloadIcon}
          tone="primary"
          mode="default"
        />
      ) : (
        <Button text="Preparing..." icon={DownloadIcon} tone="primary" mode="default" disabled />
      )}
    </Stack>
  );
}


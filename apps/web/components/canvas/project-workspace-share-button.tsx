"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@skwash/ui";

type ProjectWorkspaceShareButtonProps = {
  orgName: string;
};

type CopyState = "idle" | "copied" | "error";

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M216 112v96a16 16 0 0 1-16 16H56a16 16 0 0 1-16-16v-96a16 16 0 0 1 16-16h24a8 8 0 0 1 0 16H56v96h144v-96h-24a8 8 0 0 1 0-16h24a16 16 0 0 1 16 16M93.66 69.66 120 43.31V136a8 8 0 0 0 16 0V43.31l26.34 26.35a8 8 0 0 0 11.32-11.32l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 11.32 11.32" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M10.5 13.5 13.5 10.5M7 17a3.5 3.5 0 0 1 0-5l3-3a3.5 3.5 0 0 1 5 5l-.5.5M17 7a3.5 3.5 0 0 1 0 5l-3 3a3.5 3.5 0 1 1-5-5l.5-.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 12 4.2 4.2L19 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

async function writeToClipboard(value: string) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is not available.");
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

export function ProjectWorkspaceShareButton({
  orgName,
}: ProjectWorkspaceShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState !== "copied") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  async function handleCopy() {
    const currentUrl = shareUrl || window.location.href;

    try {
      await writeToClipboard(currentUrl);
      setShareUrl(currentUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  const copyLabel =
    copyState === "copied" ? "Copied" : copyState === "error" ? "Retry" : "Copy";

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        setIsOpen(open);

        if (open && typeof window !== "undefined") {
          setShareUrl(window.location.href);
          setCopyState("idle");
        }
      }}
      open={isOpen}
    >
      <Dialog.Trigger
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
      >
        <ShareIcon />
        <span>Share</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-zinc-950/55 backdrop-blur-[2px]" />
        <Dialog.Viewport className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <Dialog.Popup className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_32px_80px_rgba(15,23,42,0.28)] outline-none">
            <Dialog.Close
              aria-label="Close share dialog"
              className="absolute right-5 top-5 rounded-full p-2 text-zinc-900 transition hover:bg-zinc-100"
            >
              <CloseIcon />
            </Dialog.Close>

            <div className="px-6 pb-7 pt-11 md:px-9 md:pb-8 md:pt-12">
              <Dialog.Title
                className="text-center text-2xl font-semibold tracking-tight text-zinc-950 md:text-[1.85rem]"
                id="project-share-dialog-title"
              >
                Share this Skwish
              </Dialog.Title>
              <Dialog.Description className="mx-auto mt-4 max-w-xl text-center text-sm leading-6 text-zinc-400">
                All{" "}
                <span className="font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-4">
                  &apos;{orgName}&apos;
                </span>{" "}
                team members have full access
              </Dialog.Description>
            </div>

            <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-6 md:px-9 md:py-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-950">
                    <CheckIcon />
                  </span>
                  <p className="text-sm leading-6 text-zinc-950">
                    Anyone with the share link has access
                  </p>
                </div>

                <Button
                  className="inline-flex h-10 items-center gap-2 self-start rounded-xl px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 md:self-auto"
                  onClick={handleCopy}
                  type="button"
                  variant="ghost"
                >
                  <LinkIcon />
                  <span>{copyLabel}</span>
                </Button>
              </div>

              <p className="sr-only">{shareUrl}</p>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

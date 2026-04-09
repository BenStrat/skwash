"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@skwash/ui";
import { getProjectDomain, type ProjectDetail } from "@/lib/projects";
import {
  VIEWPORTS,
  ViewportSelector,
  type ViewportPreset,
} from "@/components/canvas/viewport-selector";
import { LocalizedDateTime } from "@/components/shared/localized-date-time";

type ReviewMode = "browse" | "comment";
type IframeState = "loading" | "ready" | "blocked";

type ProjectWorkspaceContextValue = {
  project: ProjectDetail;
  reviewTitle: string;
  reviewUrl: string;
  reviewDomain: string;
  activeViewport: ViewportPreset;
  setActiveViewport: (viewport: ViewportPreset) => void;
  mode: ReviewMode;
  setMode: (mode: ReviewMode) => void;
  iframeState: IframeState;
  setIframeState: React.Dispatch<React.SetStateAction<IframeState>>;
  reloadKey: number;
  retryIframe: () => void;
};

const ProjectWorkspaceContext =
  createContext<ProjectWorkspaceContextValue | null>(null);

function formatReviewItemTitle(title: string | undefined) {
  if (!title) {
    return "Base review item";
  }

  return title === "Home" ? "Home" : title;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function getViewportHeight(viewport: ViewportPreset) {
  switch (viewport) {
    case "mobile":
      return 812;
    case "tablet":
      return 960;
    case "wide":
      return 1080;
    case "desktop":
    default:
      return 900;
  }
}

function useProjectWorkspace() {
  const context = useContext(ProjectWorkspaceContext);

  if (!context) {
    throw new Error(
      "Project workspace components must be used inside the provider.",
    );
  }

  return context;
}

export function ProjectWorkspaceProvider({
  project,
  children,
}: {
  project: ProjectDetail;
  children: React.ReactNode;
}) {
  const [activeViewport, setActiveViewport] =
    useState<ViewportPreset>("desktop");
  const [mode, setMode] = useState<ReviewMode>("browse");
  const [iframeState, setIframeState] = useState<IframeState>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  const reviewItem = project.review_items[0];
  const reviewTitle = formatReviewItemTitle(reviewItem?.title ?? project.name);
  const reviewUrl = reviewItem?.url ?? project.base_url;
  const reviewDomain = getProjectDomain(project.base_url);

  useEffect(() => {
    setIframeState("loading");

    const timeoutId = window.setTimeout(() => {
      setIframeState((currentState) =>
        currentState === "loading" ? "blocked" : currentState,
      );
    }, 15_000);

    return () => window.clearTimeout(timeoutId);
  }, [project.base_url, reloadKey]);

  return (
    <ProjectWorkspaceContext.Provider
      value={{
        project,
        reviewTitle,
        reviewUrl,
        reviewDomain,
        activeViewport,
        setActiveViewport,
        mode,
        setMode,
        iframeState,
        setIframeState,
        reloadKey,
        retryIframe: () => setReloadKey((currentKey) => currentKey + 1),
      }}
    >
      {children}
    </ProjectWorkspaceContext.Provider>
  );
}

export function ProjectWorkspaceSidebarHeader() {
  const { project, reviewDomain } = useProjectWorkspace();

  return (
    <div className="border-b border-zinc-200 px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Project review
          </p>
          <h2 className="mt-2 truncate text-2xl font-semibold tracking-tight text-zinc-950">
            {reviewDomain}
          </h2>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-700">
          {formatLabel(project.review_status)}
        </span>
      </div>
    </div>
  );
}

export function ProjectWorkspaceSidebarContent() {
  const { project, reviewTitle, reviewUrl } = useProjectWorkspace();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">
              Open review items
            </p>
            <p className="text-sm text-zinc-500">1 active, 0 resolved</p>
          </div>
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-indigo-600 px-2 text-sm font-semibold text-white">
            1
          </span>
        </div>
      </div>

      <div className="flex-1 px-5 py-4">
        <article className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-950">{reviewTitle}</p>
          <p className="mt-1 truncate text-sm text-zinc-500">{reviewUrl}</p>
          <div className="mt-4 rounded-2xl bg-zinc-50 p-3 text-sm text-zinc-600">
            <p className="font-medium text-zinc-900">Latest note</p>
            <p className="mt-2 leading-6">
              The canvas now fills the workspace area, and page controls live in
              the shared chrome instead of inside the stage itself.
            </p>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Updated <LocalizedDateTime value={project.updated_at} />
          </p>
        </article>
      </div>
    </div>
  );
}

export function ProjectWorkspaceTopBarStart() {
  const { project, reviewDomain } = useProjectWorkspace();

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
        <Link
          className="rounded-xl border border-zinc-200 px-3 py-1 transition hover:border-zinc-300 hover:bg-zinc-50"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
          Workspace
        </span>
      </div>
      <div className="mt-2">
        <p className="truncate text-sm font-semibold text-zinc-950">
          {project.name}
        </p>
        <p className="text-sm text-zinc-500">{reviewDomain}</p>
      </div>
    </div>
  );
}

export function ProjectWorkspaceTopBarControls() {
  const { activeViewport, setActiveViewport, mode, setMode, reviewDomain } =
    useProjectWorkspace();

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-center">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          {reviewDomain}
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-center">
        <ViewportSelector onChange={setActiveViewport} value={activeViewport} />

        <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1">
          <Button
            className={[
              "h-auto rounded-xl px-4 py-2 text-sm font-medium",
              mode === "browse"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500",
            ].join(" ")}
            onClick={() => setMode("browse")}
            type="button"
            variant="ghost"
          >
            Browse
          </Button>
          <Button
            className={[
              "h-auto rounded-xl px-4 py-2 text-sm font-medium",
              mode === "comment"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-500",
            ].join(" ")}
            onClick={() => setMode("comment")}
            type="button"
            variant="ghost"
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectWorkspaceTopBarActions() {
  const { project, retryIframe } = useProjectWorkspace();

  return (
    <>
      <a
        className="inline-flex h-10 items-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
        href={project.base_url}
        rel="noreferrer"
        target="_blank"
      >
        Open site
      </a>
      <Button onClick={retryIframe} type="button" variant="ghost">
        Reload frame
      </Button>
    </>
  );
}

export function ProjectCanvasStage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stageViewportRef = useRef<HTMLDivElement | null>(null);
  const [stageViewportWidth, setStageViewportWidth] = useState(0);
  const {
    project,
    reviewTitle,
    reviewUrl,
    reviewDomain,
    activeViewport,
    mode,
    iframeState,
    setIframeState,
    reloadKey,
    retryIframe,
  } = useProjectWorkspace();

  const activeViewportConfig =
    VIEWPORTS.find((viewport) => viewport.key === activeViewport) ??
    VIEWPORTS[2];
  const activeViewportHeight = getViewportHeight(activeViewport);
  const browserChromeHeight = 56;
  const browserFrameHeight = browserChromeHeight + activeViewportHeight;
  const availableStageWidth = Math.max(stageViewportWidth, 320);
  const stageScale = Math.min(
    1,
    availableStageWidth / activeViewportConfig.width,
  );
  const scaledFrameWidth = activeViewportConfig.width * stageScale;
  const scaledFrameHeight = browserFrameHeight * stageScale;

  useEffect(() => {
    const node = stageViewportRef.current;

    if (!node) {
      return;
    }

    const updateWidth = () => {
      setStageViewportWidth(node.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  function handleIframeLoad() {
    const frame = iframeRef.current;

    try {
      if (frame?.contentWindow?.location.href === "about:blank") {
        setIframeState("blocked");
        return;
      }
    } catch {
      // Cross-origin frames are expected here. A load event is enough to treat
      // the frame as ready for browse mode.
    }

    setIframeState("ready");
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#202124]">
      <div
        ref={stageViewportRef}
        className="flex min-h-0 min-w-0 flex-1 items-start justify-center overflow-auto"
      >
        <div
          className="shrink-0"
          style={{
            width: `${scaledFrameWidth}px`,
            height: `${scaledFrameHeight}px`,
          }}
        >
          <div
            className="overflow-hidden bg-white"
            style={{
              width: `${activeViewportConfig.width}px`,
              height: `${browserFrameHeight}px`,
              transform: `scale(${stageScale})`,
              transformOrigin: "top center",
            }}
          >
            <div className="flex h-14 items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>

              <div className="min-w-0 flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500">
                <span className="block truncate">{reviewUrl}</span>
              </div>

              <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {mode}
              </span>
            </div>

            <div
              className="relative bg-white"
              style={{ height: `${activeViewportHeight}px` }}
            >
              {iframeState === "blocked" ? (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%)] p-8">
                  <div className="max-w-xl space-y-4 text-center">
                    <h2 className="text-xl font-semibold text-zinc-950">
                      This site cannot be embedded inside the review canvas.
                    </h2>
                    <p className="text-sm leading-6 text-zinc-600">
                      The target site is sending security headers that block
                      iframes. You can retry, switch to a staging environment
                      that allows embedding, or open the site in a new tab while
                      keeping the review context in the sidebar.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button onClick={retryIframe} type="button">
                        Retry
                      </Button>
                      <a
                        className="inline-flex h-10 items-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
                        href={project.base_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open site in new tab
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {iframeState === "loading" ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/92 backdrop-blur-sm">
                      <div className="space-y-3 text-center">
                        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-zinc-200" />
                        <div className="space-y-1">
                          <p className="font-medium text-zinc-900">
                            Loading {reviewDomain}
                          </p>
                          <p className="text-sm text-zinc-500">
                            If the frame stays blank for 15 seconds, Skwash will
                            treat it as a blocked embed.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <iframe
                    key={reloadKey}
                    ref={iframeRef}
                    className="h-full w-full bg-white"
                    onLoad={handleIframeLoad}
                    src={project.base_url}
                    title={`${project.name} review canvas`}
                  />

                  {mode === "comment" ? (
                    <div
                      aria-label="Comment overlay"
                      className="absolute inset-0 z-20 cursor-crosshair bg-indigo-500/10"
                    >
                      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white shadow-lg">
                        Overlay active
                      </div>
                      <div className="pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-2xl bg-white/92 p-3 text-sm text-zinc-700 shadow-lg backdrop-blur">
                        Annotation capture is staged here. The stage now fills
                        the workspace instead of being wrapped in a separate
                        card.
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#1b1c1f] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
        {reviewTitle}
      </div>
    </section>
  );
}

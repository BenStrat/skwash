"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Button } from "@skwash/ui";
import { getProjectDomain, type ProjectDetail } from "@/lib/projects";
import { formatRelativeUpdate } from "@/components/dashboard/project-dashboard.utils";
import {
  VIEWPORTS,
  ViewportSelector,
  type ViewportPreset,
} from "@/components/canvas/viewport-selector";

type ReviewMode = "browse" | "comment";
type IframeState = "loading" | "ready" | "blocked";

type ProjectWorkspaceContextValue = {
  project: ProjectDetail;
  reviewerName: string;
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

function formatReviewStatus(value: ProjectDetail["review_status"]) {
  if (value === "none") {
    return null;
  }

  return value.replaceAll("_", " ");
}

function getViewportHeight(viewport: ViewportPreset) {
  switch (viewport) {
    case "mobile":
      return 670;
    case "tablet":
      return 770;
    case "desktop":
    default:
      return 900;
  }
}

type DevicePreviewConfig = {
  label: string;
  shellWidth: number;
  shellHeight: number;
  headerHeight: number;
  footerHeight: number;
  sideInset: number;
  shellRadius: number;
  screenRadius: number;
  speakerWidth: number;
  speakerHeight: number;
  homeButtonSize: number;
};

function getDevicePreviewConfig(
  viewport: Exclude<ViewportPreset, "desktop">,
  contentWidth: number,
  contentHeight: number,
): DevicePreviewConfig {
  const tabletReferenceWidth = 578;
  const tabletReferenceSideInset = 14;
  const tabletReferenceHeaderHeight = 60;
  const tabletReferenceSpeakerWidth = 54;
  const tabletReferenceSpeakerHeight = 8;

  if (viewport === "tablet") {
    const sideInset = tabletReferenceSideInset;
    const headerHeight = tabletReferenceHeaderHeight;
    const footerHeight = 18;
    const shellWidth = contentWidth + sideInset * 2;
    const shellHeight = headerHeight + contentHeight + footerHeight;

    return {
      label: "Tablet View",
      shellWidth,
      shellHeight,
      headerHeight,
      footerHeight,
      sideInset,
      shellRadius: 30,
      screenRadius: 20,
      speakerWidth: 54,
      speakerHeight: 8,
      homeButtonSize: 0,
    };
  }

  const sideInset = 16;
  const headerHeight = tabletReferenceHeaderHeight;
  const footerHeight = 56;
  const shellWidth = contentWidth + sideInset * 2;
  const shellHeight = headerHeight + contentHeight + footerHeight;

  return {
    label: "Mobile View",
    shellWidth,
    shellHeight,
    headerHeight,
    footerHeight,
    sideInset,
    shellRadius: 34,
    screenRadius: 22,
    speakerWidth: tabletReferenceSpeakerWidth,
    speakerHeight: tabletReferenceSpeakerHeight,
    homeButtonSize: 38,
  };
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
  reviewerName,
  children,
}: {
  project: ProjectDetail;
  reviewerName: string;
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
        reviewerName,
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
  const reviewStatusLabel = formatReviewStatus(project.review_status);

  return (
    <div className="border-b border-zinc-200 px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-950">
            {reviewDomain}
          </h2>
        </div>
        {reviewStatusLabel ? (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-700">
            {reviewStatusLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function ProjectWorkspaceSidebarContent() {
  const { project, reviewerName } = useProjectWorkspace();
  const activeCount = Math.max(project.review_items.length, 1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 px-5 py-6">
        <article className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {activeCount}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-950">{reviewerName}</p>
              <p className="text-sm text-zinc-400">
                {formatRelativeUpdate(project.updated_at)}
              </p>
            </div>
          </div>

          <p className="pl-9 text-sm font-medium text-zinc-950">comment</p>
        </article>
      </div>
    </div>
  );
}

export function ProjectWorkspaceTopBarControls() {
  const { project, activeViewport, setActiveViewport, mode, setMode } =
    useProjectWorkspace();

  return (
    <div className="relative flex w-full flex-col gap-3 lg:min-h-10 lg:justify-center">
      <div className="flex justify-start lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2">
        <ViewportSelector
          onChange={setActiveViewport}
          reviewCounts={project.viewport_review_counts}
          value={activeViewport}
        />
      </div>

      <div className="flex justify-center">
        <ToggleGroup
          aria-label="Review mode"
          className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1"
          onValueChange={(groupValue) => {
            const nextMode = groupValue[0] as ReviewMode | undefined;

            if (nextMode) {
              setMode(nextMode);
            }
          }}
          value={[mode]}
        >
          <Toggle
            className={(state) =>
              [
                "h-auto rounded-xl px-4 py-2 text-sm font-medium transition",
                state.pressed
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500",
              ].join(" ")
            }
            value="browse"
          >
            Browse
          </Toggle>
          <Toggle
            className={(state) =>
              [
                "h-auto rounded-xl px-4 py-2 text-sm font-medium transition",
                state.pressed
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-500",
              ].join(" ")
            }
            value="comment"
          >
            Comment
          </Toggle>
        </ToggleGroup>
      </div>
    </div>
  );
}

export function ProjectCanvasStage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stageViewportRef = useRef<HTMLDivElement | null>(null);
  const [stageViewportWidth, setStageViewportWidth] = useState(0);
  const [stageViewportHeight, setStageViewportHeight] = useState(0);
  const {
    project,
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
    VIEWPORTS[0];
  const isDesktopViewport = activeViewport === "desktop";
  const activeViewportHeight =
    isDesktopViewport && stageViewportHeight > 0
      ? stageViewportHeight
      : getViewportHeight(activeViewport);
  const devicePreviewConfig =
    activeViewport === "desktop"
      ? null
      : getDevicePreviewConfig(
          activeViewport,
          activeViewportConfig.width,
          activeViewportHeight,
        );
  const availableStageWidth = Math.max(stageViewportWidth, 320);
  const availableStageHeight = Math.max(stageViewportHeight, 320);
  const tabletViewportConfig =
    VIEWPORTS.find((viewport) => viewport.key === "tablet") ?? VIEWPORTS[0];
  const tabletPreviewConfig = getDevicePreviewConfig(
    "tablet",
    tabletViewportConfig.width,
    getViewportHeight("tablet"),
  );
  const tabletPreviewScale = Math.min(
    1,
    availableStageWidth / tabletPreviewConfig.shellWidth,
  );
  const deviceLabelLaneHeight = isDesktopViewport
    ? 0
    : Math.max(
        stageViewportHeight -
          tabletPreviewConfig.shellHeight * tabletPreviewScale,
        0,
      );
  const deviceBottomInset = activeViewport === "mobile" ? 24 : 0;
  const availableDeviceBodyHeight = Math.max(
    stageViewportHeight - deviceLabelLaneHeight - deviceBottomInset,
    320,
  );
  const stageScale =
    isDesktopViewport || !devicePreviewConfig
      ? 1
      : availableDeviceBodyHeight / devicePreviewConfig.shellHeight;
  const scaledShellWidth = isDesktopViewport
    ? availableStageWidth
    : (devicePreviewConfig?.shellWidth ?? activeViewportConfig.width) *
      stageScale;
  const scaledShellHeight = isDesktopViewport
    ? activeViewportHeight
    : (devicePreviewConfig?.shellHeight ?? activeViewportHeight) * stageScale;
  const scaledFrameWidth = isDesktopViewport
    ? availableStageWidth
    : scaledShellWidth;
  const scaledFrameHeight = isDesktopViewport
    ? activeViewportHeight
    : Math.max(
        stageViewportHeight,
        deviceLabelLaneHeight + scaledShellHeight + deviceBottomInset,
      );

  useEffect(() => {
    const node = stageViewportRef.current;

    if (!node) {
      return;
    }

    const updateViewportBounds = () => {
      setStageViewportWidth(node.clientWidth);
      setStageViewportHeight(node.clientHeight);
    };

    updateViewportBounds();

    const observer = new ResizeObserver(() => {
      updateViewportBounds();
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

  const canvasSurface = (
    <div className="relative h-full bg-white">
      {iframeState === "blocked" ? (
        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%)] p-8">
          <div className="max-w-xl space-y-4 text-center">
            <h2 className="text-xl font-semibold text-zinc-950">
              This site cannot be embedded inside the review canvas.
            </h2>
            <p className="text-sm leading-6 text-zinc-600">
              The target site is sending security headers that block iframes.
              You can retry, switch to a staging environment that allows
              embedding, or open the site in a new tab while keeping the review
              context in the sidebar.
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
                    If the frame stays blank for 15 seconds, Skwash will treat
                    it as a blocked embed.
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
                Annotation capture is staged here. The stage now fills the
                workspace instead of being wrapped in a separate card.
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
      <div
        ref={stageViewportRef}
        className={[
          "flex min-h-0 min-w-0 flex-1 overflow-auto",
          isDesktopViewport
            ? "items-stretch justify-center"
            : "items-start justify-center",
        ].join(" ")}
      >
        {isDesktopViewport ? (
          <div className="h-full w-full overflow-hidden bg-white">
            {canvasSurface}
          </div>
        ) : devicePreviewConfig ? (
          <div
            className="shrink-0"
            style={{
              width: `${scaledFrameWidth}px`,
              height: `${scaledFrameHeight}px`,
            }}
          >
            {deviceLabelLaneHeight > 0 ? (
              <div
                className="flex items-center justify-center"
                style={{ height: `${deviceLabelLaneHeight}px` }}
              >
                <span className="text-[11px] font-medium tracking-[0.08em] text-zinc-400">
                  {devicePreviewConfig.label}
                </span>
              </div>
            ) : null}

            <div
              style={{
                width: `${scaledShellWidth}px`,
                height: `${scaledShellHeight}px`,
              }}
            >
              <div
                className="border border-zinc-200/80 bg-[#fcfcfb] shadow-[0_24px_60px_rgba(15,23,42,0.08),0_6px_20px_rgba(15,23,42,0.05)]"
                style={{
                  width: `${devicePreviewConfig.shellWidth}px`,
                  height: `${devicePreviewConfig.shellHeight}px`,
                  borderTopLeftRadius: `${devicePreviewConfig.shellRadius}px`,
                  borderTopRightRadius: `${devicePreviewConfig.shellRadius}px`,
                  borderBottomLeftRadius:
                    activeViewport === "tablet"
                      ? 0
                      : `${devicePreviewConfig.shellRadius}px`,
                  borderBottomRightRadius:
                    activeViewport === "tablet"
                      ? 0
                      : `${devicePreviewConfig.shellRadius}px`,
                  paddingLeft: `${devicePreviewConfig.sideInset}px`,
                  paddingRight: `${devicePreviewConfig.sideInset}px`,
                  transform: `scale(${stageScale})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ height: `${devicePreviewConfig.headerHeight}px` }}
                >
                  <span
                    className="rounded-full border border-zinc-200 bg-white/90"
                    style={{
                      width: `${devicePreviewConfig.speakerWidth}px`,
                      height: `${devicePreviewConfig.speakerHeight}px`,
                    }}
                  />
                </div>

                <div
                  className="overflow-hidden border border-zinc-200 bg-white"
                  style={{
                    width: `${activeViewportConfig.width}px`,
                    height: `${activeViewportHeight}px`,
                    borderRadius: 0,
                  }}
                >
                  {canvasSurface}
                </div>

                {devicePreviewConfig.homeButtonSize > 0 ? (
                  <div
                    className="flex items-center justify-center"
                    style={{ height: `${devicePreviewConfig.footerHeight}px` }}
                  >
                    <span
                      className="block rounded-full border border-zinc-200 bg-[#fafaf9] shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]"
                      style={{
                        width: `${devicePreviewConfig.homeButtonSize}px`,
                        height: `${devicePreviewConfig.homeButtonSize}px`,
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ height: `${devicePreviewConfig.footerHeight}px` }} />
                )}
              </div>
            </div>

            {deviceBottomInset > 0 ? (
              <div style={{ height: `${deviceBottomInset}px` }} />
            ) : null}
          </div>
        ) : null}
      </div>

    </section>
  );
}

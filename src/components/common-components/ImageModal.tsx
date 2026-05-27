"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Info,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ImageModalProps } from "@/types/common-components-types";
import { hexToRgba } from "@/utils/functions";

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
  showNavigation = true,
  showDownload = true,
  showZoom = true,
  allowKeyboardNavigation = true,
}) => {
  const { theme } = useTheme();

  // ── Core state ──────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(
    null,
  );
  const [pinchStartScale, setPinchStartScale] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isSliding, setIsSliding] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  // ── Auto-hide controls ───────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isZoomed) setShowControls(false);
    }, 3000);
  }, [isZoomed]);

  // ── Open / close lifecycle ───────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    document.body.style.overflow = "";
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsFullscreen(false);
      closeTimeoutRef.current = null;
    }, 320);
  }, [onClose, isClosing]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
      setImageLoaded(false);
    }
  }, [isOpen, initialIndex]);

  // ── Thumbnail scroll-into-view ───────────────────────────────────────
  useEffect(() => {
    if (!thumbnailStripRef.current || !hasMultipleImages || !isVisible) return;
    const strip = thumbnailStripRef.current;
    const active = strip.children[currentIndex] as HTMLElement;
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentIndex, hasMultipleImages, isVisible]);

  // ── Keyboard ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !allowKeyboardNavigation || isClosing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowLeft":
          if (hasMultipleImages) navigatePrevious();
          break;
        case "ArrowRight":
          if (hasMultipleImages) navigateNext();
          break;
        case "+":
        case "=":
          if (showZoom) zoomIn();
          break;
        case "-":
          if (showZoom) zoomOut();
          break;
        case "0":
          if (showZoom) resetZoom();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "i":
        case "I":
          setShowInfo((p) => !p);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    allowKeyboardNavigation,
    hasMultipleImages,
    showZoom,
    handleClose,
    isClosing,
  ]);

  // ── Fullscreen API ───────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await modalRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((f) => !f);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // ── Navigation ───────────────────────────────────────────────────────
  const slideImage = (direction: "left" | "right", cb: () => void) => {
    setSlideDirection(direction);
    setIsSliding(true);
    setImageLoaded(false);
    setTimeout(() => {
      cb();
      setIsSliding(false);
      setSlideDirection(null);
    }, 220);
  };

  const navigatePrevious = () => {
    if (isSliding) return;
    resetZoom();
    slideImage("right", () =>
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)),
    );
  };

  const navigateNext = () => {
    if (isSliding) return;
    resetZoom();
    slideImage("left", () =>
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)),
    );
  };

  // ── Zoom ─────────────────────────────────────────────────────────────
  const zoomIn = () =>
    setScale((prev) => {
      const n = Math.min(prev + 0.25, 5);
      if (n > 1) setIsZoomed(true);
      return n;
    });
  const zoomOut = () =>
    setScale((prev) => {
      const n = Math.max(prev - 0.25, 0.5);
      if (n <= 1) {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      }
      return n;
    });
  const resetZoom = () => {
    setScale(1);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  // ── Download ─────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!currentImage) return;
    const a = document.createElement("a");
    a.href = currentImage.url;
    a.download = currentImage.name || "image";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Drag (when zoomed) ───────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    resetControlsTimer();
    if (!isDragging || !isZoomed) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // ── Wheel zoom ───────────────────────────────────────────────────────
  const handleWheel = (e: React.WheelEvent) => {
    if (!showZoom || (!e.ctrlKey && !e.metaKey)) return;
    e.preventDefault();
    e.deltaY < 0 ? zoomIn() : zoomOut();
  };

  // ── Touch / pinch ────────────────────────────────────────────────────
  const getTouchDistance = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && showZoom) {
      setPinchStartDistance(getTouchDistance(e.touches));
      setPinchStartScale(scale);
    } else if (e.touches.length === 1 && !isZoomed && hasMultipleImages) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistance !== null && showZoom) {
      const ratio = getTouchDistance(e.touches) / pinchStartDistance;
      const n = Math.min(Math.max(pinchStartScale * ratio, 0.5), 5);
      setScale(n);
      setIsZoomed(n > 1);
      if (n <= 1) setPosition({ x: 0, y: 0 });
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    setPinchStartDistance(null);
    if (touchStartX === null || touchStartY === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (
      !isZoomed &&
      hasMultipleImages &&
      Math.abs(dx) > 60 &&
      Math.abs(dx) > Math.abs(dy)
    )
      dx < 0 ? navigateNext() : navigatePrevious();
    setTouchStartX(null);
    setTouchStartY(null);
  };

  if (!isOpen && !isClosing) return null;

  // ── Image transform ───────────────────────────────────────────────────
  const slideStyle: React.CSSProperties = isSliding
    ? {
        opacity: 0,
        transform: `scale(${scale}) translate(${position.x / scale + (slideDirection === "left" ? -50 : 50)}px, ${position.y / scale}px)`,
      }
    : {
        opacity: imageLoaded ? 1 : 0,
        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
      };

  const primaryColor = theme?.primary || "#0E9E8E";
  const accentColor = theme?.accent || "#0891b2";

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap");

        /* ── Entrance / exit ── */
        @keyframes im-backdrop-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes im-backdrop-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes im-panel-in {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes im-panel-out {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.97) translateY(16px);
          }
        }
        @keyframes im-bar-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes im-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes im-pulse-ring {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
          }
        }
        @keyframes im-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes im-info-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .im-backdrop {
          animation: im-backdrop-in 0.32s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
          pointer-events: auto;
        }
        .im-backdrop.closing {
          animation: im-backdrop-out 0.28s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
          pointer-events: none;
        }
        .im-panel {
          animation: im-panel-in 0.34s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          pointer-events: auto;
        }
        .im-panel.closing {
          animation: im-panel-out 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          pointer-events: none;
        }
        .im-bar {
          animation: im-bar-in 0.4s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .im-img {
          transition:
            opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .im-spinner {
          animation: im-spin 0.85s linear infinite;
        }
        .im-info-panel {
          animation: im-info-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── Nav arrows ── */
        .im-nav-btn {
          transition:
            background 0.18s,
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.18s;
          opacity: 0.72;
        }
        .im-nav-btn:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.1) !important;
        }
        .im-nav-btn:active {
          transform: translateY(-50%) scale(0.94) !important;
        }

        /* ── Control buttons ── */
        .im-ctrl-btn {
          transition:
            background 0.15s,
            transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.15s,
            border-color 0.15s;
        }
        .im-ctrl-btn:hover:not(:disabled) {
          transform: scale(1.1);
          opacity: 1 !important;
        }
        .im-ctrl-btn:active:not(:disabled) {
          transform: scale(0.92);
        }

        /* ── Close button ── */
        .im-close-btn {
          transition:
            background 0.15s,
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .im-close-btn:hover {
          transform: scale(1.08) rotate(90deg);
        }
        .im-close-btn:active {
          transform: scale(0.9) rotate(90deg);
        }

        /* ── Thumbnails ── */
        .im-thumb {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
        }
        .im-thumb:hover {
          transform: scale(1.08) translateY(-3px);
        }
        .im-thumb.active {
          transform: scale(1.1) translateY(-4px);
        }
        .im-thumb::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.5) 0%,
            transparent 55%
          );
          border-radius: inherit;
          pointer-events: none;
        }

        /* ── Dot indicators ── */
        .im-dot {
          transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .im-dot:hover {
          transform: scale(1.3);
        }

        /* ── Shimmer skeleton ── */
        .im-skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.04) 100%
          );
          background-size: 200% 100%;
          animation: im-shimmer 1.6s ease-in-out infinite;
        }

        /* ── Zoom percentage badge ── */
        .im-zoom-badge {
          transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .im-zoom-badge:hover {
          transform: scale(1.05);
        }

        /* ── Mobile: hide arrows, show swipe hint ── */
        @media (max-width: 480px) {
          .im-nav-btn {
            display: none !important;
          }
          .im-hint-desktop {
            display: none !important;
          }
        }
        @media (min-width: 481px) {
          .im-hint-mobile {
            display: none !important;
          }
        }
        @media (max-width: 360px) {
          .im-zoom-pct {
            display: none;
          }
        }

        /* ── Scrollbar ── */
        .im-thumb-strip::-webkit-scrollbar {
          display: none;
        }
        .im-thumb-strip {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        /* ── Focus outline ── */
        .im-ctrl-btn:focus-visible,
        .im-nav-btn:focus-visible,
        .im-close-btn:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }
      `}</style>

      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        className={`im-backdrop ${isClosing ? "closing" : ""} fixed inset-0 z-[998]`}
        style={{
          background: "rgba(4, 10, 18, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        onClick={handleClose}
      />

      {/* ── Modal shell ───────────────────────────────────────────────── */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-none"
        onMouseMove={resetControlsTimer}
      >
        <div
          className={`im-panel ${isClosing ? "closing" : ""} relative flex flex-col w-full h-full pointer-events-auto`}
          style={{
            maxWidth: "min(1380px, 96vw)",
            maxHeight: "min(92vh, 940px)",
            gap: "10px",
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* ── Top bar ─────────────────────────────────────────────── */}
          <div
            className="im-bar flex items-center justify-between gap-3 px-1"
            style={{ flexShrink: 0 }}
          >
            {/* Left: image meta */}
            <div className="flex-1 min-w-0">
              {currentImage?.name && (
                <p
                  className="text-sm sm:text-base font-semibold truncate leading-tight"
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {currentImage.name}
                </p>
              )}
              {currentImage?.description && (
                <p
                  className="text-[11px] sm:text-xs truncate mt-0.5"
                  style={{
                    color: "rgba(255,255,255,0.42)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {currentImage.description}
                </p>
              )}
            </div>

            {/* Center: counter pill */}
            {hasMultipleImages && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: primaryColor,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                >
                  {currentIndex + 1}
                </span>
                <span
                  style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}
                >
                  /
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "11px",
                  }}
                >
                  {images.length}
                </span>
              </div>
            )}

            {/* Right: action icons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Info toggle */}
              {(currentImage?.name || currentImage?.description) && (
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className="im-ctrl-btn w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: showInfo
                      ? `${primaryColor}22`
                      : "rgba(255,255,255,0.07)",
                    border: `1px solid ${showInfo ? `${primaryColor}55` : "rgba(255,255,255,0.1)"}`,
                    color: showInfo ? primaryColor : "rgba(255,255,255,0.65)",
                    opacity: 0.9,
                  }}
                  aria-label="Toggle info"
                  title="Info (I)"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="im-ctrl-btn w-9 h-9 rounded-xl items-center justify-center hidden sm:flex"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.65)",
                  opacity: 0.9,
                }}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                title="Fullscreen (F)"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Divider */}
              <div
                className="w-px h-5 mx-0.5 hidden sm:block"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />

              {/* Close */}
              <button
                onClick={handleClose}
                className="im-close-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(220,60,60,0.12)",
                  border: "1px solid rgba(220,60,60,0.25)",
                  color: "rgba(255,150,150,0.9)",
                }}
                aria-label="Close"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>

          {/* ── Main image area ──────────────────────────────────────── */}
          <div
            ref={imageContainerRef}
            className="relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "default",
              minHeight: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Skeleton / spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="im-skeleton absolute inset-0 rounded-2xl" />
                <div
                  className="im-spinner relative w-10 h-10 rounded-full"
                  style={{
                    border: `2px solid rgba(255,255,255,0.08)`,
                    borderTopColor: primaryColor,
                  }}
                />
              </div>
            )}

            {/* Image */}
            <img
              key={currentIndex}
              src={currentImage?.url}
              alt={currentImage?.name || "Image"}
              className="im-img max-w-full max-h-full object-contain select-none pointer-events-none"
              style={{
                ...slideStyle,
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: "6px",
              }}
              onLoad={() => setImageLoaded(true)}
              draggable={false}
            />

            {/* ── Info overlay ── */}
            {showInfo && (currentImage?.name || currentImage?.description) && (
              <div
                className="im-info-panel absolute bottom-3 left-3 right-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(6,10,18,0.82)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {currentImage?.name && (
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {currentImage.name}
                  </p>
                )}
                {currentImage?.description && (
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {currentImage.description}
                  </p>
                )}
              </div>
            )}

            {/* ── Zoom level indicator (top-left corner) ── */}
            {isZoomed && (
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-lg"
                style={{
                  background: "rgba(6,10,18,0.75)",
                  border: `1px solid ${primaryColor}44`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    color: primaryColor,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                >
                  {Math.round(scale * 100)}%
                </span>
              </div>
            )}

            {/* ── Nav arrows ── */}
            {showNavigation && hasMultipleImages && (
              <>
                <button
                  onClick={navigatePrevious}
                  className="im-nav-btn absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(8,14,24,0.72)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                  aria-label="Previous image"
                  title="Previous (←)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={navigateNext}
                  className="im-nav-btn absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(8,14,24,0.72)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                  aria-label="Next image"
                  title="Next (→)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* ── Thumbnail strip (≤ 20 images) ───────────────────────── */}
          {hasMultipleImages && images.length <= 20 && (
            <div
              ref={thumbnailStripRef}
              className="im-thumb-strip flex gap-2 overflow-x-auto px-1"
              style={{ flexShrink: 0, paddingBottom: "2px" }}
            >
              {images.map((img, idx) => (
                <button
                  key={img.id ?? idx}
                  className={`im-thumb relative rounded-xl overflow-hidden ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    if (idx === currentIndex) return;
                    resetZoom();
                    const dir = idx > currentIndex ? "left" : "right";
                    setSlideDirection(dir);
                    setIsSliding(true);
                    setImageLoaded(false);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setIsSliding(false);
                      setSlideDirection(null);
                    }, 180);
                  }}
                  style={{
                    width: "clamp(44px, 7vw, 60px)",
                    height: "clamp(32px, 5.2vw, 44px)",
                    flexShrink: 0,
                    border:
                      idx === currentIndex
                        ? `2px solid ${primaryColor}`
                        : "2px solid rgba(255,255,255,0.08)",
                    opacity: idx === currentIndex ? 1 : 0.5,
                    background: "rgba(255,255,255,0.04)",
                    padding: 0,
                    borderRadius: "12px",
                    boxShadow:
                      idx === currentIndex
                        ? `0 0 0 3px ${primaryColor}28, 0 6px 16px rgba(0,0,0,0.4)`
                        : "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.name || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "10px" }}
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}

          {/* ── Dot indicators (> 20 images) ────────────────────────── */}
          {hasMultipleImages && images.length > 20 && (
            <div
              className="flex items-center justify-center gap-1.5 flex-wrap px-2"
              style={{ flexShrink: 0 }}
            >
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    resetZoom();
                    setCurrentIndex(idx);
                    setImageLoaded(false);
                  }}
                  className="im-dot rounded-full"
                  style={{
                    width: idx === currentIndex ? "22px" : "6px",
                    height: "6px",
                    background:
                      idx === currentIndex
                        ? `linear-gradient(90deg, ${primaryColor}, ${accentColor})`
                        : "rgba(255,255,255,0.2)",
                    boxShadow:
                      idx === currentIndex
                        ? `0 0 8px ${primaryColor}66`
                        : "none",
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* ── Bottom controls bar ──────────────────────────────────── */}
          <div
            className="im-bar flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              flexShrink: 0,
            }}
          >
            {/* Keyboard hints */}
            <div
              className="im-hint-desktop hidden sm:flex items-center gap-3"
              style={{
                color: "rgba(255,255,255,0.22)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
              }}
            >
              {allowKeyboardNavigation && hasMultipleImages && <span>← →</span>}
              {showZoom && <span>Ctrl+Scroll</span>}
              <span>Esc</span>
            </div>
            <div
              className="im-hint-mobile text-[10px]"
              style={{
                color: "rgba(255,255,255,0.22)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {hasMultipleImages ? "Swipe to navigate" : ""}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {showZoom && (
                <>
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="im-ctrl-btn w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(255,255,255,0.75)",
                      opacity: 0.85,
                    }}
                    title="Zoom Out (−)"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Zoom % + reset */}
                  <button
                    onClick={resetZoom}
                    className="im-zoom-pct im-zoom-badge h-8 sm:h-9 px-3 rounded-xl flex items-center justify-center text-[11px] font-medium"
                    style={{
                      background: isZoomed
                        ? `${primaryColor}1a`
                        : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isZoomed ? `${primaryColor}44` : "rgba(255,255,255,0.09)"}`,
                      color: isZoomed ? primaryColor : "rgba(255,255,255,0.55)",
                      fontFamily: "'DM Mono', monospace",
                      minWidth: "48px",
                      opacity: 0.9,
                    }}
                    title="Reset Zoom (0)"
                    aria-label={`Zoom ${Math.round(scale * 100)}%. Click to reset`}
                  >
                    {Math.round(scale * 100)}%
                  </button>

                  <button
                    onClick={zoomIn}
                    disabled={scale >= 5}
                    className="im-ctrl-btn w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(255,255,255,0.75)",
                      opacity: 0.85,
                    }}
                    title="Zoom In (+)"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Reset zoom shortcut */}
                  {isZoomed && (
                    <button
                      onClick={resetZoom}
                      className="im-ctrl-btn w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${primaryColor}15`,
                        border: `1px solid ${primaryColor}33`,
                        color: primaryColor,
                        opacity: 0.9,
                      }}
                      title="Reset Zoom (0)"
                      aria-label="Reset zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    className="w-px h-5 mx-0.5 hidden sm:block"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                </>
              )}

              {showDownload && (
                <button
                  onClick={handleDownload}
                  className="im-ctrl-btn flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    opacity: 0.85,
                  }}
                  title="Download Image"
                  aria-label="Download image"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline font-medium">Save</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageModal;

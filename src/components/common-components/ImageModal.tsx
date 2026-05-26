"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

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
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    setIsVisible(false);

    document.body.style.overflow = "";

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, 300);
  }, [onClose, isClosing]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
      setImageLoaded(false);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (thumbnailStripRef.current && hasMultipleImages && isVisible) {
      const strip = thumbnailStripRef.current;
      const active = strip.children[currentIndex] as HTMLElement;
      if (active) {
        active.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentIndex, hasMultipleImages, isVisible]);

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

  const slideImage = (direction: "left" | "right", callback: () => void) => {
    setSlideDirection(direction);
    setIsSliding(true);
    setImageLoaded(false);
    setTimeout(() => {
      callback();
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

  const zoomIn = () => {
    setScale((prev) => {
      const next = Math.min(prev + 0.3, 4);
      if (next > 1) setIsZoomed(true);
      return next;
    });
  };

  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.3, 0.5);
      if (next <= 1) {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = currentImage.name || "image";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (!showZoom || (!e.ctrlKey && !e.metaKey)) return;
    e.preventDefault();
    e.deltaY < 0 ? zoomIn() : zoomOut();
  };

  // Touch gestures
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
      const dist = getTouchDistance(e.touches);
      const ratio = dist / pinchStartDistance;
      const next = Math.min(Math.max(pinchStartScale * ratio, 0.5), 4);
      setScale(next);
      if (next > 1) setIsZoomed(true);
      if (next <= 1) {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setPinchStartDistance(null);
    if (touchStartX === null || touchStartY === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartX;
    const deltaY = endY - touchStartY;
    if (
      !isZoomed &&
      hasMultipleImages &&
      Math.abs(deltaX) > 60 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      deltaX < 0 ? navigateNext() : navigatePrevious();
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Don't render anything if not open and not in closing animation
  if (!isOpen && !isClosing) return null;

  const slideStyle = isSliding
    ? {
        opacity: 0,
        transform: `scale(${scale}) translate(${position.x / scale + (slideDirection === "left" ? -40 : 40)}px, ${position.y / scale}px)`,
      }
    : {
        opacity: imageLoaded ? 1 : 0,
        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
      };

  return (
    <>
      <style jsx global>{`
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
            transform: scale(0.96) translateY(12px);
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
            transform: scale(0.96) translateY(12px);
          }
        }
        @keyframes im-bar-in {
          from {
            opacity: 0;
            transform: translateY(16px);
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
          animation: im-panel-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          pointer-events: auto;
        }
        .im-panel.closing {
          animation: im-panel-out 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          pointer-events: none;
        }
        .im-bar {
          animation: im-bar-in 0.4s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .im-img {
          transition:
            opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .im-spinner {
          animation: im-spin 0.9s linear infinite;
        }
        .im-nav-btn {
          transition:
            background 0.18s,
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.18s;
        }
        .im-nav-btn:hover {
          background: rgba(255, 255, 255, 0.18) !important;
          transform: translateY(-50%) scale(1.12);
        }
        .im-nav-btn:active {
          transform: translateY(-50%) scale(0.96);
        }
        .im-ctrl-btn {
          transition:
            background 0.15s,
            transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.15s;
        }
        .im-ctrl-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.18) !important;
          transform: scale(1.12);
        }
        .im-ctrl-btn:active:not(:disabled) {
          transform: scale(0.93);
        }
        .im-close-btn {
          transition:
            background 0.15s,
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .im-close-btn:hover {
          background: rgba(220, 60, 60, 0.82) !important;
          transform: scale(1.1) rotate(90deg);
        }
        .im-close-btn:active {
          transform: scale(0.92) rotate(90deg);
        }
        .im-thumb {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
        }
        .im-thumb:hover {
          transform: scale(1.06) translateY(-2px);
        }
        .im-thumb.active {
          transform: scale(1.08) translateY(-3px);
        }
        .im-dot {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (max-width: 480px) {
          .im-nav-btn {
            display: none !important;
          }
        }
        @media (max-width: 360px) {
          .im-zoom-pct {
            display: none;
          }
        }
      `}</style>

      {/* Backdrop - Will click through when closing */}
      <div
        className={`im-backdrop ${isClosing ? "closing" : ""} fixed inset-0 z-[998]`}
        style={{
          background: "rgba(8, 14, 22, 0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        onClick={handleClose}
      />

      {/* Modal Shell */}
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div
          className={`im-panel ${isClosing ? "closing" : ""} relative flex flex-col w-full h-full pointer-events-auto`}
          style={{
            maxWidth: "min(1280px, 96vw)",
            maxHeight: "min(90vh, 900px)",
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Rest of your component remains the same */}
          {/* Top Bar */}
          <div
            className="im-bar relative flex items-center justify-between gap-2 mb-2 px-1"
            style={{ flexShrink: 0 }}
          >
            <div className="flex-1 min-w-0 pl-1">
              {currentImage?.name && (
                <p
                  className="text-sm sm:text-base font-semibold truncate leading-tight"
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {currentImage.name}
                </p>
              )}
              {currentImage?.description && (
                <p
                  className="text-xs truncate mt-0.5"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {currentImage.description}
                </p>
              )}
            </div>

            {hasMultipleImages && (
              <div
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  fontFamily: "'DM Mono', monospace",
                  flexShrink: 0,
                }}
              >
                {currentIndex + 1} / {images.length}
              </div>
            )}

            <button
              onClick={handleClose}
              className="im-close-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Main Image Area */}
          <div
            ref={imageContainerRef}
            className="relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "default",
              minHeight: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="im-spinner w-10 h-10 rounded-full"
                  style={{
                    border: `2.5px solid rgba(255,255,255,0.1)`,
                    borderTopColor: theme?.primary || "#0E9E8E",
                  }}
                />
              </div>
            )}

            <img
              key={currentIndex}
              src={currentImage?.url}
              alt={currentImage?.name || "Image"}
              className="im-img max-w-full max-h-full object-contain select-none pointer-events-none"
              style={{
                ...slideStyle,
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: "4px",
              }}
              onLoad={() => setImageLoaded(true)}
              draggable={false}
            />

            {/* Navigation Arrows */}
            {showNavigation && hasMultipleImages && (
              <>
                <button
                  onClick={navigatePrevious}
                  className="im-nav-btn absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(15,20,30,0.65)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    backdropFilter: "blur(12px)",
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={navigateNext}
                  className="im-nav-btn absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(15,20,30,0.65)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    backdropFilter: "blur(12px)",
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {hasMultipleImages && images.length <= 20 && (
            <div
              ref={thumbnailStripRef}
              className="flex gap-2 mt-2 overflow-x-auto pb-0.5 px-1"
              style={{
                flexShrink: 0,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={img.id ?? idx}
                  className={`im-thumb rounded-lg overflow-hidden ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    if (idx === currentIndex) return;
                    resetZoom();
                    setSlideDirection(idx > currentIndex ? "left" : "right");
                    setIsSliding(true);
                    setImageLoaded(false);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setIsSliding(false);
                      setSlideDirection(null);
                    }, 180);
                  }}
                  style={{
                    width: "clamp(40px, 8vw, 56px)",
                    height: "clamp(30px, 6vw, 42px)",
                    flexShrink: 0,
                    border:
                      idx === currentIndex
                        ? `2px solid ${theme?.primary || "#0E9E8E"}`
                        : "2px solid rgba(255,255,255,0.1)",
                    opacity: idx === currentIndex ? 1 : 0.55,
                    background: "rgba(255,255,255,0.05)",
                    padding: 0,
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.name || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Dot indicators */}
          {hasMultipleImages && images.length > 20 && (
            <div
              className="flex items-center justify-center gap-1.5 mt-2 flex-wrap px-2"
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
                    width: idx === currentIndex ? "20px" : "6px",
                    height: "6px",
                    background:
                      idx === currentIndex
                        ? theme?.primary || "#0E9E8E"
                        : "rgba(255,255,255,0.25)",
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Bottom Controls Bar */}
          <div
            className="im-bar flex items-center justify-between gap-2 mt-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              flexShrink: 0,
            }}
          >
            <div
              className="text-[10px] hidden sm:block"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {allowKeyboardNavigation && hasMultipleImages ? "← → " : ""}
              {showZoom ? "Ctrl+Scroll " : ""}
              ESC
            </div>
            <div className="sm:hidden" />

            <div className="flex items-center gap-1.5">
              {showZoom && (
                <>
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="im-ctrl-btn w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    title="Zoom Out (−)"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={resetZoom}
                    className="im-zoom-pct im-ctrl-btn h-8 sm:h-9 px-2.5 rounded-lg flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: isZoomed
                        ? `rgba(${hexToRgba(theme?.primary || "#0E9E8E", 0.18).slice(5)}`
                        : "rgba(255,255,255,0.07)",
                      border: isZoomed
                        ? `1px solid ${theme?.primary || "#0E9E8E"}44`
                        : "1px solid rgba(255,255,255,0.1)",
                      color: isZoomed
                        ? theme?.primary || "#0E9E8E"
                        : "rgba(255,255,255,0.7)",
                      fontFamily: "'DM Mono', monospace",
                      minWidth: "44px",
                    }}
                    title="Reset Zoom (0)"
                    aria-label={`Current zoom: ${Math.round(scale * 100)}%. Click to reset.`}
                  >
                    {Math.round(scale * 100)}%
                  </button>

                  <button
                    onClick={zoomIn}
                    disabled={scale >= 4}
                    className="im-ctrl-btn w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    title="Zoom In (+)"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <div
                    className="w-px h-5 mx-0.5 hidden sm:block"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                </>
              )}

              {showDownload && (
                <button
                  onClick={handleDownload}
                  className="im-ctrl-btn w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                  title="Download Image"
                  aria-label="Download image"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

// /components/web-management/common/LoadingSkeleton.tsx

import React from "react";

interface LoadingSkeletonProps {
  theme: {
    background: string;
    border: string;
    surface: string;
  };
  columns?: 3 | 4;
  cardHeight?: number;
  cardCount?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  theme,
  columns = 4,
  cardHeight = 200,
  cardCount = columns === 3 ? 6 : 4,
}) => {
  const gridCols = {
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <>
      <style>{`
        @keyframes _wm_skeleton {
          0%   { opacity: 1; }
          50%  { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
      <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
          {/* Skeleton header */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                width: 180,
                height: 14,
                borderRadius: 8,
                backgroundColor: theme.border,
                marginBottom: 12,
                animation: "_wm_skeleton 1.5s ease-in-out infinite",
              }}
            />
            <div
              style={{
                width: 260,
                height: 28,
                borderRadius: 8,
                backgroundColor: theme.border,
                marginBottom: 8,
                animation: "_wm_skeleton 1.5s ease-in-out infinite 0.1s",
              }}
            />
            <div
              style={{
                width: 380,
                height: 14,
                borderRadius: 8,
                backgroundColor: theme.border,
                animation: "_wm_skeleton 1.5s ease-in-out infinite 0.2s",
              }}
            />
          </div>
          <div className={`grid ${gridCols[columns]} gap-5`}>
            {Array.from({ length: cardCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: cardHeight,
                  borderRadius: 16,
                  backgroundColor: theme.surface,
                  border: `1.5px solid ${theme.border}`,
                  animation: `_wm_skeleton 1.5s ease-in-out infinite ${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
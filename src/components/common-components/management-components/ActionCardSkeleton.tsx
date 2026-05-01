// /components/web-management/common/ActionCardSkeleton.tsx

import React from "react";

interface ActionCardSkeletonProps {
  delay?: number;
  theme: {
    border: string;
    surface: string;
  };
  isDarkMode: boolean;
}

export const ActionCardSkeleton: React.FC<ActionCardSkeletonProps> = ({
  delay = 0,
  theme,
  isDarkMode,
}) => {
  return (
    <>
      <style>{`
        @keyframes _ac_skeletonShimmer {
          0%   { background-position: -700px 0; }
          100% { background-position: 700px 0; }
        }
      `}</style>
      <div
        style={{
          pointerEvents: "none",
          animationDelay: `${delay}s`,
        }}
      >
        <div
          style={{
            display: "block",
            background: theme.surface,
            border: `1.5px solid ${theme.border}`,
            borderRadius: 16,
            padding: "1.375rem 1.25rem 1.125rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".875rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: `linear-gradient(90deg, ${theme.border} 25%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f8fafc"} 50%, ${theme.border} 75%)`,
                  backgroundSize: "700px 100%",
                  animation: "_ac_skeletonShimmer 1.5s infinite",
                }}
              />
              <div
                style={{
                  width: 56,
                  height: 22,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${theme.border} 25%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f8fafc"} 50%, ${theme.border} 75%)`,
                  backgroundSize: "700px 100%",
                  animation: "_ac_skeletonShimmer 1.5s infinite",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  width: "70%",
                  height: 14,
                  marginBottom: 8,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${theme.border} 25%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f8fafc"} 50%, ${theme.border} 75%)`,
                  backgroundSize: "700px 100%",
                  animation: "_ac_skeletonShimmer 1.5s infinite",
                }}
              />
              <div
                style={{
                  width: "90%",
                  height: 11,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${theme.border} 25%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f8fafc"} 50%, ${theme.border} 75%)`,
                  backgroundSize: "700px 100%",
                  animation: "_ac_skeletonShimmer 1.5s infinite",
                }}
              />
              <div
                style={{
                  width: "60%",
                  height: 11,
                  marginTop: 5,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${theme.border} 25%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f8fafc"} 50%, ${theme.border} 75%)`,
                  backgroundSize: "700px 100%",
                  animation: "_ac_skeletonShimmer 1.5s infinite",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
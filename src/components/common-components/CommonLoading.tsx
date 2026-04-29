// components/common-components/CommonLoading.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface CommonLoadingProps {
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

const CommonLoading: React.FC<CommonLoadingProps> = ({
  message = "Loading...",
  subMessage,
  size = "md",
  fullScreen = false,
  className = "",
}) => {
  const { theme } = useTheme();

  const sizeConfig = {
    sm: {
      spinner: "w-8 h-8",
      text: "text-base",
      subText: "text-xs",
    },
    md: {
      spinner: "w-12 h-12",
      text: "text-lg",
      subText: "text-sm",
    },
    lg: {
      spinner: "w-16 h-16",
      text: "text-xl",
      subText: "text-base",
    },
  };

  const config = sizeConfig[size];

  const containerClasses = `flex flex-col justify-center items-center rounded-xl shadow-sm border transition-colors duration-300 ${className} ${
    fullScreen ? "fixed inset-0 z-50" : ""
  }`;

  return (
    <div
      className={containerClasses}
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        ...(fullScreen && {
          backdropFilter: "blur(4px)",
          backgroundColor: `${theme.surface}CC`,
        }),
      }}
    >
      <div
        className={`${config.spinner} rounded-full border-4 border-t-transparent animate-spin`}
        style={{
          borderColor: `${theme.primary}20`,
          borderTopColor: theme.primary,
        }}
      />
      <span
        className={`mt-4 font-medium ${config.text}`}
        style={{ color: theme.text }}
      >
        {message}
      </span>
      {subMessage && (
        <p
          className={`mt-1 ${config.subText}`}
          style={{ color: theme.textSecondary }}
        >
          {subMessage}
        </p>
      )}
    </div>
  );
};

export default CommonLoading;
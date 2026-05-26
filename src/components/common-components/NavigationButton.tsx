"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { NavigationButtonProps } from "@/types/common-components-types";

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  className = "",
  size = "md",
  disabled = false,
  ariaLabel,
}) => {
  const { theme } = useTheme();

  const sizeConfig = {
    sm: {
      buttonSize: "w-8 h-8",
      iconSize: 14,
      padding: "p-0",
    },
    md: {
      buttonSize: "w-11 h-11",
      iconSize: 20,
      padding: "p-0",
    },
    lg: {
      buttonSize: "w-14 h-14",
      iconSize: 24,
      padding: "p-0",
    },
  };

  const config = sizeConfig[size];
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const defaultAriaLabel =
    ariaLabel || (direction === "left" ? "Previous" : "Next");

  const getPositionClasses = () => {
    if (direction === "left") return "left-4 -translate-y-1/2";
    return "right-4 -translate-y-1/2";
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`absolute top-1/2 ${getPositionClasses()} ${config.buttonSize} rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      style={{
        backgroundColor: disabled ? `${theme.surface}80` : `${theme.surface}E6`,
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.backgroundColor = theme.surface;
        e.currentTarget.style.transform = `translateY(-50%) scale(1.1)`;
        e.currentTarget.style.boxShadow =
          "0 10px 25px -5px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.backgroundColor = `${theme.surface}E6`;
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      }}
      aria-label={defaultAriaLabel}
    >
      <Icon
        size={config.iconSize}
        className={`transition-transform duration-200 ${direction === "left" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
      />
    </button>
  );
};

export default NavigationButton;

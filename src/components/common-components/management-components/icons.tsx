// /components/web-management/common/icons.tsx

import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
};

const sw = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.75,
};

// Page Icons
export const HomePageIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

export const AboutUsIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

export const DestinationsIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path {...sw} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const ActivitiesIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path {...sw} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const ToursIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

export const PackagesIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export const FAQIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const ContactUsIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const DefaultIcon: React.FC<IconProps> = ({ className = "w-7 h-7", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    {...iconProps}
  >
    <path
      {...sw}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Utility Icons
export const InfoIcon: React.FC<IconProps> = ({ className = "w-4 h-4", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = "w-4 h-4", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export const BackIcon: React.FC<IconProps> = ({ className = "w-4 h-4", style, color }) => (
  <svg 
    className={className} 
    style={style}
    color={color}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

// Icon mapper function
export const getPageIcon = (name: string): React.FC<IconProps> => {
  switch (name.toLowerCase()) {
    case "home page":
      return HomePageIcon;
    case "about us page":
      return AboutUsIcon;
    case "destinations page":
    case "destinations":
      return DestinationsIcon;
    case "destination details page":
      return ToursIcon;
    case "faq page":
      return FAQIcon;
    case "contact us page":
      return ContactUsIcon;
    case "activities":
      return ActivitiesIcon;
    case "tours":
      return ToursIcon;
    case "packages":
      return PackagesIcon;
    default:
      return DefaultIcon;
  }
};
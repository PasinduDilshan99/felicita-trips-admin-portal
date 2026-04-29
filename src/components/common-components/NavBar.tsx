"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Menu as MenuIcon,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import {
  COMPANY_LOGO_IMAGE,
  COMPANY_NAME,
  COMPANY_THEME,
} from "@/utils/constant";
import NotificationBell from "./NotificationBell";

// User type (if not imported from elsewhere)
export type User = {
  id: number;
  username: string;
  roles: string[];
  privileges: string[];
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber1: string;
};

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const navVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.4,
    },
  },
};

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: EASE_IN,
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: EASE_IN,
    },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.15 },
  },
};

const chevronVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const logoVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, rotate: 3, transition: { duration: 0.2 } },
  tap: { scale: 0.95, rotate: 0, transition: { duration: 0.1 } },
};

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSettings = () => {
    router.push("/settings");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    setIsMobileMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const { firstName, lastName } = user;
    return (
      `${firstName?.charAt(0) || ""}${
        lastName?.charAt(0) || ""
      }`.toUpperCase() || "U"
    );
  };

  // Get full name
  const getUserFullName = () => {
    if (!user) return "Guest User";
    return `${user.firstName} ${user.lastName}`.trim() || user.username;
  };

  // Get user role for display
  const getUserRole = () => {
    if (!user || !user.roles || user.roles.length === 0) return "User";
    return user.roles[0]; // Display first role
  };

  // Determine navbar background color based on theme
  const getNavbarBackground = () => {
    if (isDarkMode) {
      return theme.surface; // Use surface color for dark mode
    }
    return theme.primary; // Use primary color for light mode
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="shadow-lg transition-colors duration-300 sticky top-0 z-40"
      style={{
        backgroundColor: getNavbarBackground(),
        color: "#ffffff",
      }}
    >
      <div className="mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Logo and Company Name */}
          <div className="flex items-center">
            {/* Company Logo */}
            <div className="flex-shrink-0 flex items-center">
              <motion.button
                onClick={() => router.push("/")}
                variants={logoVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-white/10"
              >
                <img
                  src={COMPANY_LOGO_IMAGE}
                  alt="Company Logo"
                  className="h-full w-full object-cover"
                />
              </motion.button>
              <div className="ml-2 sm:ml-3">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
                  {COMPANY_NAME}
                </h1>
                <p className="text-xs text-white/80 hidden sm:block">
                  {COMPANY_THEME}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - User Profile and Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications Bell - Desktop */}
            <div className="hidden md:block">
              <NotificationBell />
            </div>

            {/* User Profile Section */}
            <div className="relative" ref={profileRef}>
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                variants={buttonHoverVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                {/* User Avatar */}
                <motion.div
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  {user?.firstName ? (
                    <span className="font-semibold text-xs sm:text-sm text-white">
                      {getUserInitials()}
                    </span>
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                </motion.div>

                {/* User Info - Hidden on small mobile */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">
                    {getUserFullName()}
                  </p>
                  <p className="text-xs text-white/70">{getUserRole()}</p>
                </div>

                {/* Dropdown Chevron */}
                <motion.div
                  variants={chevronVariants}
                  animate={isProfileOpen ? "open" : "closed"}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={16} className="text-white" />
                </motion.div>
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl py-2 z-50 border"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    {/* User Info in Dropdown */}
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: theme.border }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="h-10 w-10 rounded-full flex items-center justify-center border"
                          style={{
                            backgroundColor: hexToRgba(theme.primary, 0.1),
                            borderColor: hexToRgba(theme.primary, 0.2),
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {user?.firstName ? (
                            <span
                              className="font-semibold text-sm"
                              style={{ color: theme.primary }}
                            >
                              {getUserInitials()}
                            </span>
                          ) : (
                            <User size={18} style={{ color: theme.primary }} />
                          )}
                        </motion.div>
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: theme.text }}
                          >
                            {getUserFullName()}
                          </p>
                          <p
                            className="text-xs sm:text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {user?.email || "No email"}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: theme.primary }}
                          >
                            {getUserRole()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Menu Items */}
                    <div className="py-1">
                      <motion.button
                        onClick={handleProfile}
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="flex items-center w-full px-4 py-2.5 text-sm transition-colors cursor-pointer"
                        style={{ color: theme.textSecondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hexToRgba(
                            theme.primary,
                            0.05,
                          );
                          e.currentTarget.style.color = theme.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = theme.textSecondary;
                        }}
                      >
                        <User
                          size={16}
                          className="mr-3"
                          style={{ color: theme.textSecondary }}
                        />
                        Your Profile
                      </motion.button>

                      <motion.button
                        onClick={handleSettings}
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="flex items-center w-full px-4 py-2.5 text-sm transition-colors cursor-pointer"
                        style={{ color: theme.textSecondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hexToRgba(
                            theme.primary,
                            0.05,
                          );
                          e.currentTarget.style.color = theme.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = theme.textSecondary;
                        }}
                      >
                        <Settings
                          size={16}
                          className="mr-3"
                          style={{ color: theme.textSecondary }}
                        />
                        Account Settings
                      </motion.button>

                      {/* Divider */}
                      <div
                        className="border-t my-1"
                        style={{ borderColor: theme.border }}
                      />

                      <motion.button
                        onClick={handleLogout}
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="flex items-center w-full px-4 py-2.5 text-sm transition-colors cursor-pointer"
                        style={{ color: theme.error }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = hexToRgba(
                            theme.error,
                            0.05,
                          );
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign out
                      </motion.button>
                    </div>

                    {/* Footer with version/status */}
                    <div
                      className="px-4 py-2 border-t rounded-b-lg"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: hexToRgba(theme.background, 0.5),
                      }}
                    >
                      <p
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {user?.privileges?.length || 0} privileges • v1.0.0
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors text-white cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="px-4 pt-4 pb-3 space-y-2">
              {/* Mobile User Info */}
              <motion.div
                variants={mobileItemVariants}
                className="flex items-center space-x-3 px-2 pb-3 mb-2 border-b"
                style={{ borderColor: theme.border }}
              >
                <motion.div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.1),
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {user?.firstName ? (
                    <span
                      className="font-semibold text-sm"
                      style={{ color: theme.primary }}
                    >
                      {getUserInitials()}
                    </span>
                  ) : (
                    <User size={18} style={{ color: theme.primary }} />
                  )}
                </motion.div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: theme.text }}>
                    {getUserFullName()}
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    {getUserRole()}
                  </p>
                </div>
              </motion.div>

              {/* Mobile Navigation Links */}
              <motion.button
                variants={mobileItemVariants}
                onClick={handleDashboard}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-colors cursor-pointer"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                <Home
                  size={18}
                  className="mr-3"
                  style={{ color: theme.textSecondary }}
                />
                Dashboard
              </motion.button>

              {/* Mobile Notifications - Integrated with bell */}
              <motion.div
                variants={mobileItemVariants}
                className="w-full"
              >
                <NotificationBell mobile />
              </motion.div>

              <motion.button
                variants={mobileItemVariants}
                onClick={handleProfile}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-colors cursor-pointer"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                <User
                  size={18}
                  className="mr-3"
                  style={{ color: theme.textSecondary }}
                />
                Profile
              </motion.button>

              <motion.button
                variants={mobileItemVariants}
                onClick={handleSettings}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-colors cursor-pointer"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                <Settings
                  size={18}
                  className="mr-3"
                  style={{ color: theme.textSecondary }}
                />
                Settings
              </motion.button>

              {/* Mobile Logout */}
              <motion.button
                variants={mobileItemVariants}
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-colors mt-2 cursor-pointer"
                style={{ color: theme.error }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.error,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <LogOut size={18} className="mr-3" />
                Sign out
              </motion.button>
            </div>

            {/* Mobile Footer */}
            <motion.div
              variants={mobileItemVariants}
              className="px-4 py-3 border-t rounded-b-lg"
              style={{
                backgroundColor: hexToRgba(theme.background, 0.5),
                borderColor: theme.border,
              }}
            >
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Business Manager • Enterprise Management Suite
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
// Updated NavBar component with NotificationBell integration
// Replace the existing NavBar with this updated version

"use client";

import React, { useState, useRef, useEffect } from "react";
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

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsProfileOpen(false);
  };

  const handleSettings = () => {
    router.push("/settings");
    setIsProfileOpen(false);
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
    <nav
      className="shadow-lg transition-colors duration-300"
      style={{
        backgroundColor: getNavbarBackground(),
        color: "#ffffff",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Company Name */}
          <div className="flex items-center">
            {/* Company Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => router.push("/")}
                className="h-10 w-10 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 overflow-hidden"
              >
                <img
                  src={COMPANY_LOGO_IMAGE}
                  alt="Company Logo"
                  className="h-full w-full object-cover"
                />
              </button>
              <div className="ml-3">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {COMPANY_NAME}
                </h1>
                <p className="text-xs text-white/80 hidden sm:block">
                  {COMPANY_THEME}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - User Profile and Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell - Desktop - Using the new component */}
            <div className="hidden md:block">
              <NotificationBell />
            </div>

            {/* User Profile Section */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                {/* User Avatar */}
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                  {user?.firstName ? (
                    <span className="font-semibold text-sm text-white">
                      {getUserInitials()}
                    </span>
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>

                {/* User Info - Hidden on small mobile */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">
                    {getUserFullName()}
                  </p>
                  <p className="text-xs text-white/70">{getUserRole()}</p>
                </div>

                {/* Dropdown Chevron */}
                <ChevronDown
                  size={18}
                  className={`text-white transition-transform duration-300 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
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
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center border"
                        style={{
                          backgroundColor: hexToRgba(theme.primary, 0.1),
                          borderColor: hexToRgba(theme.primary, 0.2),
                        }}
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
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: theme.text }}
                        >
                          {getUserFullName()}
                        </p>
                        <p
                          className="text-sm"
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
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-3 text-sm transition-colors"
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
                    </button>

                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-3 text-sm transition-colors"
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
                    </button>

                    {/* Divider */}
                    <div
                      className="border-t my-1"
                      style={{ borderColor: theme.border }}
                    ></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm transition-colors"
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
                    </button>
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
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden border-t transition-colors duration-300"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Mobile User Info */}
            <div
              className="flex items-center space-x-3 px-2 pb-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                }}
              >
                {user?.firstName ? (
                  <span
                    className="font-semibold"
                    style={{ color: theme.primary }}
                  >
                    {getUserInitials()}
                  </span>
                ) : (
                  <User size={20} style={{ color: theme.primary }} />
                )}
              </div>
              <div>
                <p className="font-semibold" style={{ color: theme.text }}>
                  {getUserFullName()}
                </p>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {getUserRole()}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center w-full px-4 py-3 rounded-lg transition-colors"
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
            </button>

            {/* Mobile Notifications */}
            <button
              className="flex items-center w-full px-4 py-3 rounded-lg transition-colors justify-between"
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
              onClick={() => {
                setIsMobileMenuOpen(false);
                // You can also open the notification panel programmatically here
                // For now, we'll just use the bell component
              }}
            >
              <div className="flex items-center">
                <div className="relative">
                  {/* This would be the NotificationBell for mobile, but for simplicity */}
                  <Bell
                    size={18}
                    className="mr-3"
                    style={{ color: theme.textSecondary }}
                  />
                </div>
                Notifications
              </div>
              {/* You'd need to integrate the notification count here */}
            </button>

            <button
              onClick={handleProfile}
              className="flex items-center w-full px-4 py-3 rounded-lg transition-colors"
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
            </button>

            <button
              onClick={handleSettings}
              className="flex items-center w-full px-4 py-3 rounded-lg transition-colors"
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
            </button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg transition-colors mt-2"
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
            </button>
          </div>

          {/* Mobile Footer */}
          <div
            className="px-4 py-3 border-t rounded-b-lg"
            style={{
              backgroundColor: hexToRgba(theme.background, 0.5),
              borderColor: theme.border,
            }}
          >
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Business Manager • Enterprise Management Suite
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

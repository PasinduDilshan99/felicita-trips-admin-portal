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

const NavBar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
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
    // Navigate to profile page
    console.log("Navigate to profile");
    setIsProfileOpen(false);
  };

  const handleSettings = () => {
    // Navigate to settings page
    console.log("Navigate to settings");
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

  return (
    <nav className="bg-[#5E35B1] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Company Name */}
          <div className="flex items-center">
            {/* Company Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button onClick={()=>{router.push("/")}} className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center cursor-pointer">
                <span className="text-xl font-bold text-white">FT</span>
              </button>
              <div className="ml-3">
                <h1 className="text-xl font-bold tracking-tight">
                  Felicita Travels
                </h1>
                <p className="text-xs text-white/80 hidden sm:block">
                  Make your journey
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links - Optional */}
            {/* <div className="hidden md:ml-10 md:flex md:space-x-6">
              <a 
                href="/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors flex items-center"
              >
                <Home size={16} className="mr-2" />
                Dashboard
              </a>
            </div> */}
          </div>

          {/* Right side - User Profile and Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell - Desktop */}
            <div className="hidden md:block relative">
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
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
                    <span className="font-semibold text-sm">
                      {getUserInitials()}
                    </span>
                  ) : (
                    <User size={18} />
                  )}
                </div>

                {/* User Info - Hidden on small mobile */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{getUserFullName()}</p>
                  <p className="text-xs text-white/70">{getUserRole()}</p>
                </div>

                {/* Dropdown Chevron */}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  {/* User Info in Dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                        {user?.firstName ? (
                          <span className="font-semibold text-purple-600 text-sm">
                            {getUserInitials()}
                          </span>
                        ) : (
                          <User size={18} className="text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getUserFullName()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.email || "No email"}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          {getUserRole()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="mr-3 text-gray-400" />
                      Your Profile
                    </button>

                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} className="mr-3 text-gray-400" />
                      Account Settings
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign out
                    </button>
                  </div>

                  {/* Footer with version/status */}
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    <p className="text-xs text-gray-500">
                      {user?.privileges?.length || 0} privileges • v1.0.0
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 px-2 pb-3 border-b border-gray-100">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                {user?.firstName ? (
                  <span className="font-semibold text-purple-600">
                    {getUserInitials()}
                  </span>
                ) : (
                  <User size={20} className="text-purple-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {getUserFullName()}
                </p>
                <p className="text-sm text-gray-500">{getUserRole()}</p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <a
              href="/dashboard"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Home size={18} className="mr-3 text-gray-400" />
              Dashboard
            </a>

            {/* Mobile Notifications */}
            <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Bell size={18} className="mr-3 text-gray-400" />
              Notifications
              <span className="ml-auto h-6 w-6 bg-amber-500 text-xs text-white rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <a
              href="/profile"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <User size={18} className="mr-3 text-gray-400" />
              Profile
            </a>

            <a
              href="/settings"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Settings size={18} className="mr-3 text-gray-400" />
              Settings
            </a>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2"
            >
              <LogOut size={18} className="mr-3" />
              Sign out
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Business Manager • Enterprise Management Suite
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

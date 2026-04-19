// components/Sidebar.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Home,
  Menu,
  X,
  Building,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export interface SideBarDataType {
  id: number;
  name: string;
  description: string;
  color: string;
  url: string;
  privilege: string;
  subData: {
    id: number;
    name: string;
    description: string;
    url: string;
    privilege: string;
  }[];
}

interface SidebarProps {
  data: SideBarDataType[];
  title?: string;
  logo?: string;
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const Sidebar: React.FC<SidebarProps> = ({
  data,
  title = "Management System",
  logo,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const { hasPrivilege } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const pathname = usePathname() || "";
  const router = useRouter();

  // Filter data based on privileges
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const hasMainPrivilege = hasPrivilege(item.privilege);
        const filteredSubData = item.subData.filter((subItem) =>
          hasPrivilege(subItem.privilege)
        );

        return (
          hasMainPrivilege ||
          (item.subData.length > 0 && filteredSubData.length > 0)
        );
      })
      .map((item) => ({
        ...item,
        subData: item.subData.filter((subItem) =>
          hasPrivilege(subItem.privilege)
        ),
      }));
  }, [data, hasPrivilege]);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set expanded items based on current path - FIXED VERSION
  useEffect(() => {
    const expanded: number[] = [];
    
    filteredData.forEach((item) => {
      let shouldExpand = false;
      
      // 1. Exact match for parent URL
      if (pathname === item.url) {
        shouldExpand = true;
      }
      
      // 2. Check if we're on any subitem URL (exact match or deeper path)
      const hasMatchingSubItem = item.subData.some((sub) => 
        pathname === sub.url || 
        pathname.startsWith(sub.url + '/')
      );
      
      if (hasMatchingSubItem) {
        shouldExpand = true;
      }
      
      // 3. Check if we're in parent's directory but NOT matching a sibling
      if (pathname.startsWith(item.url + '/')) {
        // Check if there's a sibling item that also matches this path
        const siblingMatch = filteredData.some(otherItem => 
          otherItem.id !== item.id && 
          pathname.startsWith(otherItem.url + '/')
        );
        
        // Only expand if no sibling matches better
        if (!siblingMatch) {
          shouldExpand = true;
        }
      }
      
      if (shouldExpand && !expanded.includes(item.id)) {
        expanded.push(item.id);
      }
    });
    
    setExpandedItems(expanded);
  }, [pathname, filteredData]);

  const handleParentClick = (item: SideBarDataType) => {
    const hasSubItems = item.subData && item.subData.length > 0;
    const hasMainItemAccess = hasPrivilege(item.privilege);
    
    if (!hasMainItemAccess && !hasSubItems) {
      return; // Do nothing if no access
    }

    // Toggle expansion for parent item
    if (hasSubItems) {
      setExpandedItems((prev) =>
        prev.includes(item.id)
          ? prev.filter((itemId) => itemId !== item.id)
          : [...prev, item.id]
      );
    }

    // Navigate to parent URL (if user has access to parent)
    if (hasMainItemAccess) {
      router.push(item.url);
      
      // Close sidebar on mobile after navigation
      if (isMobileView) {
        setTimeout(() => {
          setIsSidebarOpen(false);
        }, 300);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mobile overlay
  const MobileOverlay = () =>
    isSidebarOpen && isMobileView ? (
      <div
        className="fixed inset-0 backdrop-blur-md z-40 transition-all duration-500 ease-out"
        style={{ backgroundColor: hexToRgba(theme.background, 0.3) }}
        onClick={() => setIsSidebarOpen(false)}
      />
    ) : null;

  // If no accessible items, show minimal sidebar
  if (filteredData.length === 0) {
    return (
      <aside 
        className="fixed lg:sticky top-0 left-0 h-screen border-r shadow-lg w-20 flex flex-col items-center justify-center transition-colors duration-300"
        style={{ 
          backgroundColor: theme.surface,
          borderColor: theme.border
        }}
      >
        <div className="text-center p-4">
          <div 
            className="h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
            <Building className="text-white" size={20} />
          </div>
          <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>No Access</p>
        </div>
      </aside>
    );
  }

  if (!isSidebarOpen && !isMobileView)
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 lg:flex hidden h-12 w-6 rounded-r-lg items-center justify-center shadow-lg transition-all duration-300 hover:w-8 hover:shadow-xl"
        style={{ backgroundColor: theme.primary }}
      >
        <ChevronRight size={20} className="text-white transition-transform duration-300" />
      </button>
    );

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .smooth-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .smooth-hover:hover {
          transform: translateX(4px);
        }
      `}</style>

      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 lg:hidden z-50 h-10 w-10 text-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        style={{ backgroundColor: theme.primary }}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        <div className="transition-transform duration-300 ease-in-out">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen border-r shadow-lg transition-all duration-500 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full z-50"
        } ${isSidebarOpen ? "w-80" : "w-80"} lg:translate-x-0 lg:z-auto ${
          !isSidebarOpen && !isMobileView ? "lg:w-20" : "lg:w-80"
        }`}
        style={{ 
          backgroundColor: theme.surface,
          borderColor: theme.border
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b transition-colors duration-500 ease-in-out" style={{ borderColor: theme.border }}>
          {isSidebarOpen ? (
            <div className="flex items-center space-x-3 animate-fadeIn">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-10 rounded-lg transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                >
                  <Building className="text-white" size={20} />
                </div>
              )}
              <div className="transition-opacity duration-500">
                <h1 className="text-xl font-bold" style={{ color: theme.text }}>{title}</h1>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {filteredData.length} accessible modules
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center animate-fadeIn">
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              >
                <Building className="text-white" size={20} />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto py-4 scroll-smooth">
          <nav className="space-y-1 px-3">
            {filteredData.map((item) => {
              const isExpanded = expandedItems.includes(item.id);
              const hasSubItems = item.subData && item.subData.length > 0;
              const isActive =
                pathname === item.url ||
                item.subData.some((sub) => 
                  pathname === sub.url || pathname.startsWith(sub.url + '/')
                );

              const hasMainItemAccess = hasPrivilege(item.privilege);

              return (
                <div key={item.id} className="mb-2">
                  {/* Main Item */}
                  <button
                    onClick={() => handleParentClick(item)}
                    className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300 ease-in-out smooth-hover ${
                      isActive
                        ? "border-l-4 shadow-sm"
                        : "border-l-4 border-transparent hover:shadow-sm"
                    } ${
                      !hasMainItemAccess && !hasSubItems
                        ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                        : ""
                    } ${hasMainItemAccess ? "cursor-pointer" : ""}`}
                    style={{
                      borderLeftColor: isActive ? item.color : "transparent",
                      backgroundColor: isActive ? hexToRgba(theme.primary, 0.1) : "transparent",
                    }}
                    disabled={!hasMainItemAccess && !hasSubItems}
                    onMouseEnter={(e) => {
                      if (!isActive && !(!hasMainItemAccess && !hasSubItems)) {
                        e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive && !(!hasMainItemAccess && !hasSubItems)) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {/* Color Indicator */}
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-125"
                      style={{ backgroundColor: item.color }}
                    />

                    {isSidebarOpen && (
                      <>
                        <div className="ml-3 text-left flex-1 transition-all duration-300">
                          <span
                            className={`font-medium block transition-colors duration-200 ${
                              isActive ? "font-semibold" : ""
                            } ${!hasMainItemAccess ? "opacity-60" : ""}`}
                            style={{ color: isActive ? theme.primary : theme.text }}
                          >
                            {item.name}
                            {!hasMainItemAccess && hasSubItems && (
                              <span className="text-xs ml-2" style={{ color: theme.textSecondary }}>
                                (Sub items only)
                              </span>
                            )}
                          </span>
                          <span className="text-xs block mt-0.5 transition-opacity duration-200" style={{ color: theme.textSecondary }}>
                            {item.description}
                          </span>
                        </div>

                        {hasSubItems && (
                          <ChevronDown
                            size={16}
                            className={`transition-all duration-300 ease-in-out ${
                              isExpanded ? "rotate-180" : "rotate-0"
                            }`}
                            style={{ color: theme.textSecondary }}
                          />
                        )}
                      </>
                    )}

                    {!isSidebarOpen && (
                      <div className="ml-2 transition-all duration-300">
                        <div className="text-xs font-medium truncate" style={{ color: theme.textSecondary }}>
                          {item.name.charAt(0)}
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Sub Items - Only show when expanded and sidebar is open */}
                  {isSidebarOpen && hasSubItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1 pl-3 border-l animate-slideDown overflow-hidden" style={{ borderColor: theme.border }}>
                      {item.subData.map((subItem, index) => {
                        const isSubActive = 
                          pathname === subItem.url || 
                          pathname.startsWith(subItem.url + '/');
                        const hasSubItemAccess = hasPrivilege(
                          subItem.privilege
                        );

                        return (
                          <Link
                            key={subItem.id}
                            href={hasSubItemAccess ? subItem.url : "#"}
                            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out smooth-hover ${
                              isSubActive
                                ? "font-medium shadow-sm"
                                : ""
                            } ${
                              !hasSubItemAccess
                                ? "opacity-50 cursor-not-allowed pointer-events-none"
                                : ""
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                              backgroundColor: isSubActive ? hexToRgba(theme.primary, 0.15) : "transparent",
                              color: isSubActive ? theme.primary : theme.textSecondary,
                            }}
                            onClick={() =>
                              isMobileView && setIsSidebarOpen(false)
                            }
                            onMouseEnter={(e) => {
                              if (!isSubActive && hasSubItemAccess) {
                                e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                                e.currentTarget.style.color = theme.text;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubActive && hasSubItemAccess) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = theme.textSecondary;
                              }
                            }}
                          >
                            <div
                              className="h-2 w-2 rounded-full mr-3 flex-shrink-0 transition-all duration-300 hover:scale-125"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="text-left flex-1">
                              <span className="transition-all duration-200">
                                {subItem.name}
                                {!hasSubItemAccess && (
                                  <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                                    (no access)
                                  </span>
                                )}
                              </span>
                              {isSidebarOpen && subItem.description && (
                                <span className="text-xs block mt-0.5 truncate transition-opacity duration-200" style={{ color: theme.textSecondary }}>
                                  {subItem.description}
                                </span>
                              )}
                            </div>
                            {isSubActive && (
                              <div className="ml-2 animate-fadeIn">
                                <div className="h-2 w-2 rounded-full transition-all duration-300 hover:scale-125" style={{ backgroundColor: theme.primary }}></div>
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer with user info */}
        {isSidebarOpen && (
          <div className="p-4 border-t mt-auto transition-colors duration-300" style={{ borderColor: theme.border }}>
            <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
              <p>
                Showing {filteredData.length} of {data.length} modules
              </p>
              <p className="mt-1">Access restricted by privileges</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
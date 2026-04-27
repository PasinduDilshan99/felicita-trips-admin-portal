// components/Sidebar.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  Home,
  Menu,
  X,
  Building,
  GripVertical,
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
    color?: string;
    privilege: string;
    grandSubData?: {
      id: number;
      name: string;
      description: string;
      url: string;
      color?: string;
      privilege: string;
    }[];
  }[];
}

interface SidebarProps {
  data: SideBarDataType[];
  title?: string;
  logo?: string;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
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
  minWidth = 240,
  maxWidth = 480,
  defaultWidth = 320,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  
  const { hasPrivilege } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const pathname = usePathname() || "";
  const router = useRouter();

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebar-width');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (!isNaN(width) && width >= minWidth && width <= maxWidth) {
        setSidebarWidth(width);
      }
    }
  }, [minWidth, maxWidth]);

  // Save width to localStorage when changed
  useEffect(() => {
    localStorage.setItem('sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  // Filter data based on privileges
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const hasMainPrivilege = hasPrivilege(item.privilege);
        const filteredSubData = item.subData
          .filter((subItem) => {
            const hasSubPrivilege = hasPrivilege(subItem.privilege);
            const filteredGrandSubData = subItem.grandSubData?.filter((grandSubItem) =>
              hasPrivilege(grandSubItem.privilege)
            ) || [];
            
            return hasSubPrivilege || filteredGrandSubData.length > 0;
          })
          .map((subItem) => ({
            ...subItem,
            grandSubData: subItem.grandSubData?.filter((grandSubItem) =>
              hasPrivilege(grandSubItem.privilege)
            ) || [],
          }));

        return (
          hasMainPrivilege ||
          (item.subData.length > 0 && filteredSubData.length > 0)
        );
      })
      .map((item) => ({
        ...item,
        subData: item.subData
          .filter((subItem) => {
            const hasSubPrivilege = hasPrivilege(subItem.privilege);
            const filteredGrandSubData = subItem.grandSubData?.filter((grandSubItem) =>
              hasPrivilege(grandSubItem.privilege)
            ) || [];
            
            return hasSubPrivilege || filteredGrandSubData.length > 0;
          })
          .map((subItem) => ({
            ...subItem,
            grandSubData: subItem.grandSubData?.filter((grandSubItem) =>
              hasPrivilege(grandSubItem.privilege)
            ) || [],
          })),
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

  // Set expanded items based on current path
  useEffect(() => {
    const expanded: number[] = [];
    const expandedSubKeys = new Set<string>();
    
    filteredData.forEach((item) => {
      let shouldExpand = false;
      
      // Check parent URL
      if (pathname === item.url) {
        shouldExpand = true;
      }
      
      // Check subitems and grandSubData
      item.subData.forEach((sub) => {
        // Check subitem URL
        if (pathname === sub.url || pathname.startsWith(sub.url + '/')) {
          shouldExpand = true;
          expandedSubKeys.add(`${item.id}-${sub.id}`);
        }
        
        // Check grandSubData
        sub.grandSubData?.forEach((grand) => {
          if (pathname === grand.url || pathname.startsWith(grand.url + '/')) {
            shouldExpand = true;
            expandedSubKeys.add(`${item.id}-${sub.id}`);
          }
        });
      });
      
      // Check directory paths
      if (pathname.startsWith(item.url + '/')) {
        const siblingMatch = filteredData.some(otherItem => 
          otherItem.id !== item.id && 
          pathname.startsWith(otherItem.url + '/')
        );
        
        if (!siblingMatch) {
          shouldExpand = true;
        }
      }
      
      if (shouldExpand && !expanded.includes(item.id)) {
        expanded.push(item.id);
      }
    });
    
    setExpandedItems(expanded);
    setExpandedSubItems(expandedSubKeys);
  }, [pathname, filteredData]);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const delta = e.clientX - startXRef.current;
    let newWidth = startWidthRef.current + delta;
    
    // Apply constraints
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    
    if (newWidth !== sidebarWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing, minWidth, maxWidth, sidebarWidth]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add/remove resize event listeners
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const handleParentClick = (item: SideBarDataType) => {
    const hasSubItems = item.subData && item.subData.length > 0;
    const hasMainItemAccess = hasPrivilege(item.privilege);
    
    if (!hasMainItemAccess && !hasSubItems) {
      return;
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

  const handleSubItemClick = (item: SideBarDataType, subItem: any) => {
    const hasGrandSubData = subItem.grandSubData && subItem.grandSubData.length > 0;
    
    if (hasGrandSubData) {
      // Toggle expansion for grandSubData
      setExpandedSubItems((prev) => {
        const newSet = new Set(prev);
        const key = `${item.id}-${subItem.id}`;
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    }
    
    // Navigate if user has access
    if (hasPrivilege(subItem.privilege)) {
      router.push(subItem.url);
      
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

  // Resize handle component
  const ResizeHandle = () => (
    <div
      className={`absolute right-0 top-0 h-full w-1 cursor-ew-resize transition-all duration-200 group z-50 ${
        isResizing ? 'bg-opacity-100' : 'bg-opacity-0'
      }`}
      style={{
        backgroundColor: isResizing ? theme.primary : 'transparent',
      }}
      onMouseDown={handleResizeStart}
    >
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{ backgroundColor: theme.primary }}
      />
    </div>
  );

  // If no accessible items, show minimal sidebar
  if (filteredData.length === 0) {
    return (
      <aside 
        ref={sidebarRef}
        className="fixed lg:sticky top-0 left-0 h-screen border-r shadow-lg flex flex-col items-center justify-center transition-all duration-300"
        style={{ 
          width: isSidebarOpen ? sidebarWidth : 80,
          backgroundColor: theme.surface,
          borderColor: theme.border
        }}
      >
        <div className="text-center p-4">
          <div 
            className="h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2 mx-auto"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
            <Building className="text-white" size={20} />
          </div>
          <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>No Access</p>
        </div>
        {!isMobileView && <ResizeHandle />}
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

        @keyframes slideDownGrand {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 800px;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-slideDownGrand {
          animation: slideDownGrand 0.4s ease-out;
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
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 left-0 h-screen border-r shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full z-50"
        } lg:translate-x-0 lg:z-auto`}
        style={{ 
          width: isSidebarOpen ? sidebarWidth : 80,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          transition: isResizing ? 'none' : 'all 0.3s ease-in-out'
        }}
      >
        {/* Resize Handle - Only show on desktop when sidebar is open */}
        {!isMobileView && isSidebarOpen && <ResizeHandle />}

        {/* Sidebar Header */}
        <div className="p-6 border-b transition-colors duration-500 ease-in-out flex-shrink-0" style={{ borderColor: theme.border }}>
          {isSidebarOpen ? (
            <div className="flex items-center space-x-3 animate-fadeIn">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-10 rounded-lg transition-transform duration-300 hover:scale-110 flex-shrink-0"
                />
              ) : (
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3 flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                >
                  <Building className="text-white" size={20} />
                </div>
              )}
              <div className="transition-opacity duration-500 overflow-hidden">
                <h1 className="text-xl font-bold truncate" style={{ color: theme.text }}>{title}</h1>
                <p className="text-sm truncate" style={{ color: theme.textSecondary }}>
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
                  pathname === sub.url || 
                  pathname.startsWith(sub.url + '/') ||
                  sub.grandSubData?.some((grand) => 
                    pathname === grand.url || pathname.startsWith(grand.url + '/')
                  )
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
                        <div className="ml-3 text-left flex-1 transition-all duration-300 overflow-hidden">
                          <span
                            className={`font-medium block transition-colors duration-200 truncate ${
                              isActive ? "font-semibold" : ""
                            } ${!hasMainItemAccess ? "opacity-60" : ""}`}
                            style={{ color: isActive ? theme.primary : theme.text }}
                          >
                            {item.name}
                            {!hasMainItemAccess && hasSubItems && (
                              <span className="text-xs ml-2" style={{ color: theme.textSecondary }}>
                                (Sub only)
                              </span>
                            )}
                          </span>
                          <span className="text-xs block mt-0.5 transition-opacity duration-200 truncate" style={{ color: theme.textSecondary }}>
                            {item.description}
                          </span>
                        </div>

                        {hasSubItems && (
                          <ChevronDown
                            size={16}
                            className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
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
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Sub Items - Only show when expanded and sidebar is open */}
                  {isSidebarOpen && hasSubItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1 pl-3 border-l animate-slideDown overflow-hidden" style={{ borderColor: theme.border }}>
                      {item.subData.map((subItem, subIndex) => {
                        const isSubActive = 
                          pathname === subItem.url || 
                          pathname.startsWith(subItem.url + '/') ||
                          subItem.grandSubData?.some((grand) => 
                            pathname === grand.url || pathname.startsWith(grand.url + '/')
                          );
                        const hasSubItemAccess = hasPrivilege(subItem.privilege);
                        const hasGrandSubData = subItem.grandSubData && subItem.grandSubData.length > 0;
                        const isGrandExpanded = expandedSubItems.has(`${item.id}-${subItem.id}`);
                        const grandSubItems = subItem.grandSubData || [];

                        return (
                          <div key={subItem.id}>
                            {/* Sub Item */}
                            <button
                              onClick={() => handleSubItemClick(item, subItem)}
                              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out smooth-hover ${
                                isSubActive
                                  ? "font-medium shadow-sm"
                                  : ""
                              } ${
                                !hasSubItemAccess && !hasGrandSubData
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              style={{
                                animationDelay: `${subIndex * 50}ms`,
                                backgroundColor: isSubActive ? hexToRgba(theme.primary, 0.15) : "transparent",
                                color: isSubActive ? theme.primary : theme.textSecondary,
                              }}
                              disabled={!hasSubItemAccess && !hasGrandSubData}
                              onMouseEnter={(e) => {
                                if (!isSubActive && (hasSubItemAccess || hasGrandSubData)) {
                                  e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                                  e.currentTarget.style.color = theme.text;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive && (hasSubItemAccess || hasGrandSubData)) {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.color = theme.textSecondary;
                                }
                              }}
                            >
                              <div
                                className="h-2 w-2 rounded-full mr-3 flex-shrink-0 transition-all duration-300 hover:scale-125"
                                style={{ backgroundColor: subItem.color || item.color }}
                              />
                              <div className="text-left flex-1 overflow-hidden">
                                <span className="transition-all duration-200 truncate block">
                                  {subItem.name}
                                  {!hasSubItemAccess && hasGrandSubData && (
                                    <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                                      (Group)
                                    </span>
                                  )}
                                  {!hasSubItemAccess && !hasGrandSubData && (
                                    <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                                      (No access)
                                    </span>
                                  )}
                                </span>
                                {isSidebarOpen && subItem.description && (
                                  <span className="text-xs block mt-0.5 truncate transition-opacity duration-200" style={{ color: theme.textSecondary }}>
                                    {subItem.description}
                                  </span>
                                )}
                              </div>
                              {hasGrandSubData && (
                                <ChevronDown
                                  size={14}
                                  className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
                                    isGrandExpanded ? "rotate-180" : "rotate-0"
                                  }`}
                                  style={{ color: theme.textSecondary }}
                                />
                              )}
                              {isSubActive && !hasGrandSubData && (
                                <div className="ml-2 animate-fadeIn">
                                  <div className="h-2 w-2 rounded-full transition-all duration-300 hover:scale-125" style={{ backgroundColor: theme.primary }}></div>
                                </div>
                              )}
                            </button>

                            {/* Grand Sub Items */}
                            {hasGrandSubData && isGrandExpanded && (
                              <div className="ml-6 mt-1 space-y-1 pl-3 border-l animate-slideDownGrand overflow-hidden" style={{ borderColor: theme.border }}>
                                {grandSubItems.map((grandItem, grandIndex) => {
                                  const isGrandActive = 
                                    pathname === grandItem.url || 
                                    pathname.startsWith(grandItem.url + '/');
                                  const hasGrandAccess = hasPrivilege(grandItem.privilege);

                                  return (
                                    <Link
                                      key={grandItem.id}
                                      href={hasGrandAccess ? grandItem.url : "#"}
                                      className={`flex items-center w-full px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ease-in-out smooth-hover ${
                                        isGrandActive
                                          ? "font-medium shadow-sm"
                                          : ""
                                      } ${
                                        !hasGrandAccess
                                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                                          : ""
                                      }`}
                                      style={{
                                        animationDelay: `${grandIndex * 30}ms`,
                                        backgroundColor: isGrandActive ? hexToRgba(theme.primary, 0.12) : "transparent",
                                        color: isGrandActive ? theme.primary : theme.textSecondary,
                                      }}
                                      onClick={() =>
                                        isMobileView && setIsSidebarOpen(false)
                                      }
                                      onMouseEnter={(e) => {
                                        if (!isGrandActive && hasGrandAccess) {
                                          e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                                          e.currentTarget.style.color = theme.text;
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isGrandActive && hasGrandAccess) {
                                          e.currentTarget.style.backgroundColor = "transparent";
                                          e.currentTarget.style.color = theme.textSecondary;
                                        }
                                      }}
                                    >
                                      <div
                                        className="h-1.5 w-1.5 rounded-full mr-3 flex-shrink-0 transition-all duration-300 hover:scale-125"
                                        style={{ backgroundColor: grandItem.color || subItem.color || item.color }}
                                      />
                                      <div className="text-left flex-1 overflow-hidden">
                                        <span className="transition-all duration-200 truncate block">
                                          {grandItem.name}
                                          {!hasGrandAccess && (
                                            <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                                              (No access)
                                            </span>
                                          )}
                                        </span>
                                        {isSidebarOpen && grandItem.description && (
                                          <span className="text-xs block mt-0.5 truncate transition-opacity duration-200 opacity-75" style={{ color: theme.textSecondary }}>
                                            {grandItem.description}
                                          </span>
                                        )}
                                      </div>
                                      {isGrandActive && (
                                        <div className="ml-2 animate-fadeIn">
                                          <div className="h-1.5 w-1.5 rounded-full transition-all duration-300 hover:scale-125" style={{ backgroundColor: theme.primary }}></div>
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
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer with user info */}
        {isSidebarOpen && (
          <div className="p-4 border-t mt-auto transition-colors duration-300 flex-shrink-0" style={{ borderColor: theme.border }}>
            <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
              <p className="truncate">
                Showing {filteredData.length} of {data.length} modules
              </p>
              <p className="mt-1 truncate">Drag right edge to resize</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE_IN },
  },
};

const sidebarVariants: Variants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      duration: 0.3,
    },
  },
  closed: {
    x: "-100%",
    transition: {
      duration: 0.28,
      ease: EASE_IN,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.03,
      duration: 0.25,
      ease: EASE_OUT,
    },
  }),
};

const subItemVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 8,
    transition: {
      duration: 0.28,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.22,
      ease: EASE_IN,
    },
  },
};

const grandSubItemVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 8,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

const chevronVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

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
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 backdrop-blur-md z-40 cursor-pointer"
        style={{ backgroundColor: hexToRgba(theme.background, 0.3) }}
        onClick={() => setIsSidebarOpen(false)}
      />
    ) : null;

  // Resize handle component
  const ResizeHandle = () => (
    <motion.div
      className={`absolute right-0 top-0 h-full w-1 cursor-ew-resize transition-all duration-200 group z-50 ${
        isResizing ? 'bg-opacity-100' : 'bg-opacity-0'
      }`}
      style={{
        backgroundColor: isResizing ? theme.primary : 'transparent',
      }}
      onMouseDown={handleResizeStart}
      whileHover={{ opacity: 1 }}
    >
      <motion.div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{ backgroundColor: theme.primary }}
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1.2 }}
      />
    </motion.div>
  );

  // If no accessible items, show minimal sidebar
  if (filteredData.length === 0) {
    return (
      <motion.aside 
        ref={sidebarRef}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed lg:sticky top-0 left-0 h-screen border-r shadow-lg flex flex-col items-center justify-center"
        style={{ 
          width: isSidebarOpen ? sidebarWidth : 80,
          backgroundColor: theme.surface,
          borderColor: theme.border
        }}
      >
        <div className="text-center p-4">
          <motion.div 
            className="h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2 mx-auto"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Building className="text-white" size={20} />
          </motion.div>
          <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>No Access</p>
        </div>
        {!isMobileView && <ResizeHandle />}
      </motion.aside>
    );
  }

  if (!isSidebarOpen && !isMobileView)
    return (
      <motion.button
        onClick={toggleSidebar}
        variants={buttonHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 lg:flex hidden h-12 w-6 rounded-r-lg items-center justify-center shadow-lg cursor-pointer"
        style={{ backgroundColor: theme.primary }}
      >
        <ChevronRight size={20} className="text-white" />
      </motion.button>
    );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        <MobileOverlay />
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <motion.button
        onClick={toggleSidebar}
        variants={buttonHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="fixed top-4 left-4 lg:hidden z-50 h-10 w-10 text-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer"
        style={{ backgroundColor: theme.primary }}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isSidebarOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      {/* Sidebar Container */}
      <motion.aside
        ref={sidebarRef}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed lg:sticky top-0 left-0 h-screen border-r shadow-lg flex flex-col ${
          isSidebarOpen ? "z-50" : "z-50"
        } lg:z-auto`}
        style={{ 
          width: isSidebarOpen ? sidebarWidth : 80,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          transition: isResizing ? 'none' : 'width 0.3s ease-in-out'
        }}
      >
        {/* Resize Handle */}
        {!isMobileView && isSidebarOpen && <ResizeHandle />}

        {/* Sidebar Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 border-b flex-shrink-0"
          style={{ borderColor: theme.border }}
        >
          {isSidebarOpen ? (
            <div className="flex items-center space-x-3">
              {logo ? (
                <motion.img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex-shrink-0 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.div 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Building className="text-white" size={18} />
                </motion.div>
              )}
              <div className="overflow-hidden">
                <h1 className="text-base sm:text-xl font-bold truncate" style={{ color: theme.text }}>{title}</h1>
                <p className="text-xs sm:text-sm truncate" style={{ color: theme.textSecondary }}>
                  {filteredData.length} accessible modules
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <motion.div 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ duration: 0.2 }}
              >
                <Building className="text-white" size={18} />
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto py-4 scroll-smooth custom-scrollbar">
          <nav className="space-y-1 px-2 sm:px-3">
            {filteredData.map((item, idx) => {
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
                <motion.div
                  key={item.id}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                  className="mb-2"
                >
                  {/* Main Item */}
                  <motion.button
                    onClick={() => handleParentClick(item)}
                    variants={buttonHoverVariants}
                    initial="rest"
                    whileHover={(!hasMainItemAccess && !hasSubItems) ? undefined : "hover"}
                    whileTap={(!hasMainItemAccess && !hasSubItems) ? undefined : "tap"}
                    className={`flex items-center w-full px-3 py-2 sm:py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "border-l-4 shadow-sm"
                        : "border-l-4 border-transparent"
                    } ${
                      !hasMainItemAccess && !hasSubItems
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    style={{
                      borderLeftColor: isActive ? item.color : "transparent",
                      backgroundColor: isActive ? hexToRgba(theme.primary, 0.1) : "transparent",
                    }}
                    disabled={!hasMainItemAccess && !hasSubItems}
                  >
                    {/* Color Indicator */}
                    <motion.div
                      className="h-2 w-2 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                      whileHover={{ scale: 1.25 }}
                      transition={{ duration: 0.15 }}
                    />

                    {isSidebarOpen && (
                      <>
                        <div className="ml-3 text-left flex-1 overflow-hidden">
                          <span
                            className={`text-sm sm:text-base font-medium block truncate ${
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
                          <span className="text-xs block mt-0.5 truncate" style={{ color: theme.textSecondary }}>
                            {item.description}
                          </span>
                        </div>

                        {hasSubItems && (
                          <motion.div
                            variants={chevronVariants}
                            animate={isExpanded ? "open" : "closed"}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown
                              size={16}
                              style={{ color: theme.textSecondary }}
                            />
                          </motion.div>
                        )}
                      </>
                    )}

                    {!isSidebarOpen && (
                      <div className="ml-2">
                        <div className="text-xs font-medium truncate" style={{ color: theme.textSecondary }}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </motion.button>

                  {/* Sub Items */}
                  <AnimatePresence>
                    {isSidebarOpen && hasSubItems && isExpanded && (
                      <motion.div
                        variants={subItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="ml-6 sm:ml-8 mt-1 pl-2 sm:pl-3 border-l"
                        style={{ borderColor: theme.border }}
                      >
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
                              <motion.button
                                onClick={() => handleSubItemClick(item, subItem)}
                                variants={buttonHoverVariants}
                                initial="rest"
                                whileHover={(!hasSubItemAccess && !hasGrandSubData) ? undefined : "hover"}
                                whileTap={(!hasSubItemAccess && !hasGrandSubData) ? undefined : "tap"}
                                className={`flex items-center w-full px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 ${
                                  isSubActive
                                    ? "font-medium shadow-sm"
                                    : ""
                                } ${
                                  !hasSubItemAccess && !hasGrandSubData
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                style={{
                                  backgroundColor: isSubActive ? hexToRgba(theme.primary, 0.15) : "transparent",
                                  color: isSubActive ? theme.primary : theme.textSecondary,
                                }}
                                disabled={!hasSubItemAccess && !hasGrandSubData}
                              >
                                <motion.div
                                  className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                                  style={{ backgroundColor: subItem.color || item.color }}
                                  whileHover={{ scale: 1.25 }}
                                />
                                <div className="text-left flex-1 overflow-hidden">
                                  <span className="truncate block">
                                    {subItem.name}
                                    {!hasSubItemAccess && hasGrandSubData && (
                                      <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                                        (Group)
                                      </span>
                                    )}
                                  </span>
                                  {isSidebarOpen && subItem.description && (
                                    <span className="text-xs block mt-0.5 truncate" style={{ color: theme.textSecondary }}>
                                      {subItem.description}
                                    </span>
                                  )}
                                </div>
                                {hasGrandSubData && (
                                  <motion.div
                                    variants={chevronVariants}
                                    animate={isGrandExpanded ? "open" : "closed"}
                                    transition={{ duration: 0.25 }}
                                    className="flex-shrink-0"
                                  >
                                    <ChevronDown
                                      size={14}
                                      style={{ color: theme.textSecondary }}
                                    />
                                  </motion.div>
                                )}
                                {isSubActive && !hasGrandSubData && (
                                  <motion.div
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="ml-2"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                                  </motion.div>
                                )}
                              </motion.button>

                              {/* Grand Sub Items */}
                              <AnimatePresence>
                                {hasGrandSubData && isGrandExpanded && (
                                  <motion.div
                                    variants={grandSubItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="ml-4 sm:ml-6 mt-1 pl-2 sm:pl-3 border-l"
                                    style={{ borderColor: theme.border }}
                                  >
                                    {grandSubItems.map((grandItem, grandIndex) => {
                                      const isGrandActive = 
                                        pathname === grandItem.url || 
                                        pathname.startsWith(grandItem.url + '/');
                                      const hasGrandAccess = hasPrivilege(grandItem.privilege);

                                      return (
                                        <motion.div
                                          key={grandItem.id}
                                          variants={fadeInVariants}
                                          initial="hidden"
                                          animate="visible"
                                          custom={grandIndex}
                                        >
                                          <Link
                                            href={hasGrandAccess ? grandItem.url : "#"}
                                            className={`flex items-center w-full px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                                              isGrandActive
                                                ? "font-medium shadow-sm"
                                                : ""
                                            } ${
                                              !hasGrandAccess
                                                ? "opacity-50 cursor-not-allowed pointer-events-none"
                                                : "cursor-pointer"
                                            }`}
                                            style={{
                                              backgroundColor: isGrandActive ? hexToRgba(theme.primary, 0.12) : "transparent",
                                              color: isGrandActive ? theme.primary : theme.textSecondary,
                                            }}
                                            onClick={() =>
                                              isMobileView && setIsSidebarOpen(false)
                                            }
                                          >
                                            <motion.div
                                              className="h-1 w-1 rounded-full mr-2 flex-shrink-0"
                                              style={{ backgroundColor: grandItem.color || subItem.color || item.color }}
                                              whileHover={{ scale: 1.5 }}
                                            />
                                            <div className="text-left flex-1 overflow-hidden">
                                              <span className="truncate block">
                                                {grandItem.name}
                                              </span>
                                              {isSidebarOpen && grandItem.description && (
                                                <span className="text-xs block mt-0.5 truncate opacity-75" style={{ color: theme.textSecondary }}>
                                                  {grandItem.description}
                                                </span>
                                              )}
                                            </div>
                                            {isGrandActive && (
                                              <motion.div
                                                variants={fadeInVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="ml-2"
                                              >
                                                <div className="h-1 w-1 rounded-full" style={{ backgroundColor: theme.primary }} />
                                              </motion.div>
                                            )}
                                          </Link>
                                        </motion.div>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        {isSidebarOpen && (
          <motion.div 
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="p-3 sm:p-4 border-t mt-auto flex-shrink-0"
            style={{ borderColor: theme.border }}
          >
            <div className="text-xs text-center" style={{ color: theme.textSecondary }}>
              <p className="truncate">
                Showing {filteredData.length} of {data.length} modules
              </p>
              <p className="mt-1 truncate hidden sm:block">Drag right edge to resize</p>
            </div>
          </motion.div>
        )}
      </motion.aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 99px;
          background: rgba(128, 128, 128, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.4);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
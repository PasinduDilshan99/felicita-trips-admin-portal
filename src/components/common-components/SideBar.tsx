// components/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  Home,
  Menu,
  X,
  Building
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export interface SideBarDataType {
  id: number;
  name: string;
  description: string;
  color: string;
  url: string;
  subData: {
    id: number;
    name: string;
    description: string;
    url: string;
  }[];
}

interface SidebarProps {
  data: SideBarDataType[];
  title?: string;
  logo?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  data, 
  title = "Management System",
  logo
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set expanded items based on current path
  useEffect(() => {
    const expanded: number[] = [];
    data.forEach(item => {
      if (pathname.startsWith(item.url) || 
          item.subData.some(sub => pathname.startsWith(sub.url))) {
        expanded.push(item.id);
      }
    });
    setExpandedItems(expanded);
  }, [pathname, data]);

  const toggleItem = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mobile overlay
  const MobileOverlay = () => 
    isSidebarOpen && isMobileView ? (
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-all duration-500 ease-out"
        onClick={() => setIsSidebarOpen(false)}
      />
    ) : null;

  if (!isSidebarOpen && !isMobileView) return (
    <button
      onClick={toggleSidebar}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-30 lg:flex hidden h-12 w-6 bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg items-center justify-center shadow-lg transition-all duration-300 hover:w-8 hover:shadow-xl"
    >
      <ChevronRight size={20} className="transition-transform duration-300" />
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
        className="fixed top-4 left-4 lg:hidden z-50 h-10 w-10 bg-purple-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-purple-700 active:scale-95"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        <div className="transition-transform duration-300 ease-in-out">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-500 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0 z-50' : '-translate-x-full z-50'
        } ${isSidebarOpen ? 'w-80' : 'w-80'} lg:translate-x-0 lg:z-auto ${!isSidebarOpen && !isMobileView ? 'lg:w-20' : 'lg:w-80'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 transition-all duration-500 ease-in-out">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-3 animate-fadeIn">
              {logo ? (
                <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg transition-transform duration-300 hover:scale-110" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <Building className="text-white" size={20} />
                </div>
              )}
              <div className="transition-opacity duration-500">
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{data.length} modules</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center animate-fadeIn">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <Building className="text-white" size={20} />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto py-4 scroll-smooth">
          <nav className="space-y-1 px-3">
            {data.map((item) => {
              const isExpanded = expandedItems.includes(item.id);
              const hasSubItems = item.subData && item.subData.length > 0;
              const isActive = pathname.startsWith(item.url) || 
                               item.subData.some(sub => pathname.startsWith(sub.url));

              return (
                <div key={item.id} className="mb-2">
                  {/* Main Item */}
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleItem(item.id);
                      } else {
                        router.push(item.url);
                      }
                    }}
                    className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300 ease-in-out smooth-hover ${
                      isActive 
                        ? 'bg-purple-50 border-l-4 shadow-sm' 
                        : 'hover:bg-gray-50 border-l-4 border-transparent hover:shadow-sm'
                    }`}
                    style={{ borderLeftColor: isActive ? item.color : 'transparent' }}
                  >
                    {/* Color Indicator */}
                    <div 
                      className="h-3 w-3 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-125"
                      style={{ backgroundColor: item.color }}
                    />

                    {isSidebarOpen && (
                      <>
                        <div className="ml-3 text-left flex-1 transition-all duration-300">
                          <span className={`font-medium block transition-colors duration-200 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 block mt-0.5 transition-opacity duration-200">
                            {item.description}
                          </span>
                        </div>
                        
                        {hasSubItems && (
                          <ChevronDown 
                            size={16} 
                            className={`text-gray-400 transition-all duration-300 ease-in-out ${
                              isExpanded ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        )}
                      </>
                    )}

                    {!isSidebarOpen && (
                      <div className="ml-2 transition-all duration-300">
                        <div className="text-xs font-medium text-gray-700 truncate">
                          {item.name.charAt(0)}
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Sub Items - Only show when expanded and sidebar is open */}
                  {isSidebarOpen && hasSubItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1 pl-3 border-l border-gray-200 animate-slideDown overflow-hidden">
                      {item.subData.map((subItem, index) => {
                        const isSubActive = pathname === subItem.url;
                        
                        return (
                          <Link
                            key={subItem.id}
                            href={subItem.url}
                            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out smooth-hover ${
                              isSubActive 
                                ? 'bg-purple-100 text-purple-700 font-medium shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`
                            }}
                            onClick={() => isMobileView && setIsSidebarOpen(false)}
                          >
                            <div 
                              className="h-2 w-2 rounded-full mr-3 flex-shrink-0 transition-all duration-300 hover:scale-125"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="text-left flex-1">
                              <span className="transition-all duration-200">{subItem.name}</span>
                              {isSidebarOpen && subItem.description && (
                                <span className="text-xs text-gray-500 block mt-0.5 truncate transition-opacity duration-200">
                                  {subItem.description}
                                </span>
                              )}
                            </div>
                            {isSubActive && (
                              <div className="ml-2 animate-fadeIn">
                                <div className="h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 hover:scale-125"></div>
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
      </aside>
    </>
  );
};

export default Sidebar;
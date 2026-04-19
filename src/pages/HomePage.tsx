"use client";

import { useAuth } from "@/contexts/AuthContext";
import { homeCardData } from "@/data/home-page-data";
import { useRouter } from "next/navigation";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const HomePage = () => {
  const router = useRouter();
  const { hasPrivilege } = useAuth();
  const { theme, isDarkMode } = useTheme();

  const filteredCards = homeCardData.filter((card) => hasPrivilege(card.privilege));

  if (filteredCards.length === 0) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 transition-colors duration-300" style={{ color: theme.text }}>
            Access Restricted
          </h1>
          <p className="text-lg mb-6 transition-colors duration-300" style={{ color: theme.textSecondary }}>
            You don't have access to any management modules. Please contact your administrator.
          </p>
          <div 
            className="p-8 border-2 border-dashed rounded-xl transition-colors duration-300"
            style={{ 
              borderColor: theme.border,
              backgroundColor: theme.surface
            }}
          >
            <p className="transition-colors duration-300" style={{ color: theme.textSecondary }}>
              No accessible modules found for your user role.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getGridColumnsClass = () => {
    const count = filteredCards.length; 
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
  };

  return (
    <div 
      className="p-6 py-24 transition-colors duration-300 min-h-screen"
      style={{ backgroundColor: theme.background }}
    >
      <div className="mx-auto mb-12 text-center">
        <h1 
          className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-bold mb-4 text-center transition-colors duration-300"
          style={{ color: theme.text }}
        >
          Business Management Dashboard
        </h1>
        <p 
          className="text-lg text-center transition-colors duration-300"
          style={{ color: theme.textSecondary }}
        >
          Centralized platform to manage all your business operations including
          travel, employees, hotels, vehicles, and enterprise resource planning
          systems.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className={`grid ${getGridColumnsClass()} gap-6`}>
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="group cursor-pointer"
              onClick={() => {
                router.push(card.linkTo);
              }}
            >
              <div
                className="h-full border-2 rounded-xl p-6 transition-all duration-300 group-hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  borderColor: hexToRgba(card.color, 0.4),
                  backgroundColor: theme.surface,
                  boxShadow: isDarkMode ? `0 4px 12px ${hexToRgba(card.color, 0.1)}` : undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.color;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${hexToRgba(card.color, 0.15)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = hexToRgba(card.color, 0.4);
                  e.currentTarget.style.boxShadow = isDarkMode ? `0 4px 12px ${hexToRgba(card.color, 0.1)}` : "none";
                }}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="p-4 rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: hexToRgba(card.color, 0.15),
                      border: `2px solid ${hexToRgba(card.color, 0.3)}`,
                    }}
                  >
                    <img
                      src={card.iconUrl}
                      alt={card.name}
                      className="w-12 h-12 object-contain"
                      style={{
                        filter: `drop-shadow(0 2px 4px ${hexToRgba(card.color, 0.3)})`,
                      }}
                    />
                  </div>
                </div>

                <h3
                  className="text-center text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{ color: card.color }}
                >
                  {card.name}
                </h3>
                
                {card.description && (
                  <p 
                    className="text-center text-sm transition-colors duration-300"
                    style={{ color: theme.textSecondary }}
                  >
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
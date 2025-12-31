"use client";
import { useAuth } from "@/contexts/AuthContext";
import { homeCardData } from "@/data/home-page-data";
import { useRouter } from "next/navigation";
import React from "react";

const HomePage = () => {
  const router = useRouter();
  const { hasPrivilege } = useAuth();

    const filteredCards = homeCardData.filter((card) => hasPrivilege(card.privilege));

  if (filteredCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You don't have access to any management modules. Please contact your administrator.
          </p>
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <p className="text-gray-500">
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
    <div className="bg-gray-50 p-6 py-24 ">
      <div className="mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-bold text-gray-900 mb-4 text-center">
          Business Management Dashboard
        </h1>
        <p className="text-lg text-gray-600 text-center ">
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
                className="h-full border-2 border-gray-200 rounded-xl p-6 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-lg bg-white"
                style={{ border: `2px solid ${card.color}70` }}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="p-4 rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${card.color}15`,
                      border: `2px solid ${card.color}40`,
                    }}
                  >
                    <img
                      src={card.iconUrl}
                      alt={card.name}
                      className="w-12 h-12 object-contain"
                      style={{
                        filter: `drop-shadow(0 2px 4px ${card.color}40)`,
                      }}
                    />
                  </div>
                </div>

                <h3
                  className="text-center text-lg font-semibold text-gray-800 mb-2"
                  style={{ color: `${card.color}` }}
                >
                  {card.name}
                </h3>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
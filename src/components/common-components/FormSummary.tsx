"use client";

import React from "react";
import { Eye, Shield, MapPin, Tag, DollarSign, Image, Clock, Users, Calendar, ClipboardList, LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface SummarySection {
  label: string;
  value: string | React.ReactNode;
  icon: string;
  color?: string;
}

interface FormSummaryProps {
  title: string;
  sections: SummarySection[];
  tips?: string[];
}

const iconMap: Record<string, LucideIcon> = {
  eye: Eye,
  shield: Shield,
  map: MapPin,
  tag: Tag,
  dollar: DollarSign,
  image: Image,
  clock: Clock,
  users: Users,
  calendar: Calendar,
  clipboard: ClipboardList,
  activity: Eye,
};

export const FormSummary: React.FC<FormSummaryProps> = ({
  title,
  sections,
  tips = [],
}) => {
  const { theme } = useTheme();

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .summary-card { animation: fadeSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <div className="space-y-6">
        {/* Summary Card */}
        <div
          className="summary-card rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.warning}18`,
                color: theme.warning,
              }}
            >
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
                {title}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Review your information
              </p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-3">
            {sections.map((section, index) => {
              const Icon = iconMap[section.icon] || Eye;
              const sectionColor = section.color || theme.primary;
              const colors = [
                theme.primary,
                theme.success,
                theme.warning,
                theme.error,
                theme.accent,
              ];
              const colorIndex = index % colors.length;
              const bgColor = section.color ? `${section.color}08` : `${colors[colorIndex]}08`;
              
              return (
                <div
                  key={section.label}
                  className="flex justify-between items-start p-3 rounded-xl"
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: sectionColor }} />
                    <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                      {section.label}
                    </span>
                  </div>
                  <div className="text-right max-w-[60%]">
                    {typeof section.value === "string" ? (
                      <span
                        className="text-sm"
                        style={{
                          color: section.value === "Not set" ? theme.textSecondary : theme.text,
                        }}
                      >
                        {section.value}
                      </span>
                    ) : (
                      section.value
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips & Guidelines */}
        {tips.length > 0 && (
          <div
            className="summary-card rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}08, ${theme.accent}08)`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{ borderBottom: `1px solid ${theme.primary}20` }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: `${theme.success}18`,
                  color: theme.success,
                }}
              >
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
                  Tips & Guidelines
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  Best practices for creation
                </p>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group"
                    style={{
                      animation: `fadeSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s both`,
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-all duration-200 group-hover:scale-125"
                      style={{ backgroundColor: theme.success }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
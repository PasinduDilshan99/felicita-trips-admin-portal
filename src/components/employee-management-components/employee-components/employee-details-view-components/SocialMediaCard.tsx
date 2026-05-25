// components/employee-details/SocialMediaCard.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { EmployeeSocialMedia } from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { InfoCard } from "./InfoCard";

interface SocialMediaCardProps {
  socialMedia?: EmployeeSocialMedia[];
  animationDelay?: number;
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ socialMedia, animationDelay = 0 }) => {
  const { theme } = useTheme();

  return (
    <InfoCard title="Social Media" icon="🌐" animationDelay={animationDelay}>
      {!socialMedia?.length ? (
        <EmptyState message="No social media linked" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialMedia.map((social, idx) => (
            <a
              key={idx}
              href={social.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.04),
                border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                textDecoration: "none",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                }}
              >
                {getPlatformIcon(social.platformName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {social.platformName}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: theme.primary }}
                >
                  @{social.username}
                </div>
                <div className="text-xs mt-1 flex items-center gap-2" style={{ color: theme.textSecondary }}>
                  <span>👥 {social.followerCount?.toLocaleString()}</span>
                  {social.primary && <span>⭐ Primary</span>}
                  {social.verified && <span>✓ Verified</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </InfoCard>
  );
};


// components/employee-details/SkillsCard.tsx
import { EmployeeSkill } from "@/types/employee-types";
import { formatDate, getPlatformIcon, getProficiencyStyle } from "@/utils/utils";

interface SkillsCardProps {
  skills?: EmployeeSkill[];
  animationDelay?: number;
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skills, animationDelay = 0 }) => {
  const { theme } = useTheme();

  return (
    <InfoCard title="Skills" icon="⚡" animationDelay={animationDelay}>
      {!skills?.length ? (
        <EmptyState message="No skills recorded" />
      ) : (
        <div className="space-y-3">
          {skills.map((skill, idx) => {
            const proficiency = getProficiencyStyle(skill.proficiencyLevel);
            return (
              <div
                key={idx}
                className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.04),
                  border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                  boxShadow: `0 1px 4px ${hexToRgba(theme.text, 0.04)}`,
                }}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: theme.text }}>
                      {skill.skillName}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                      {skill.skillCategory}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${proficiency.className}`}>
                      {proficiency.label}
                    </span>
                    {skill.verified && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
                {skill.certification && (
                  <div
                    className="mt-3 text-xs rounded-lg px-3 py-2 flex items-center gap-1.5"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.06),
                      color: theme.textSecondary,
                    }}
                  >
                    <span>📜</span>
                    <span>
                      {skill.certification}
                      {skill.certifiedDate && ` · Issued ${formatDate(skill.certifiedDate)}`}
                      {skill.expiryDate && ` · Expires ${formatDate(skill.expiryDate)}`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </InfoCard>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col items-center justify-center py-8 rounded-xl"
      style={{
        backgroundColor: hexToRgba(theme.textSecondary, 0.04),
        border: `1px dashed ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      <span className="text-2xl mb-2 opacity-40">📭</span>
      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {message}
      </p>
    </div>
  );
};
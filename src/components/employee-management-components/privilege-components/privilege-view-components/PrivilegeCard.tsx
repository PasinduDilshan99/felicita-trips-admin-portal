"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import {
  PRIVILEGES_TERMINATE_PAGE_URL,
  PRIVILEGES_UPDATE_PAGE_URL,
  PRIVILEGES_VIEW_PAGE_URL,
} from "@/utils/urls";
import { PrivilegeCardProps } from "@/types/privilege-types";
import {
  buttonVariants,
  cardVariants,
  EASE_OUT,
  iconVariants,
  statusBadgeVariants,
  titleVariants,
} from "@/app/animations/variants";

const PrivilegeCard: React.FC<PrivilegeCardProps> = ({ privilege }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleEdit = () => {
    router.push(
      `${PRIVILEGES_UPDATE_PAGE_URL}?privilegeId=${privilege.privilegeId}&name=${encodeURIComponent(privilege.privilegeName)}`,
    );
  };

  const handleView = () => {
    router.push(
      `${PRIVILEGES_VIEW_PAGE_URL}/${privilege.privilegeId}?name=${encodeURIComponent(privilege.privilegeName)}`,
    );
  };

  const handleTerminateClick = () => {
    router.push(
      `${PRIVILEGES_TERMINATE_PAGE_URL}?privilegeId=${privilege.privilegeId}&name=${encodeURIComponent(privilege.privilegeName)}`,
    );
  };

  const isActive = privilege.privilegeStatus === "ACTIVE";

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.border;
        }}
      >
        {/* Color accent bar */}
        <motion.div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />

        <div className="p-5 flex-grow flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.12)}, ${hexToRgba(theme.accent, 0.08)})`,
                }}
              >
                <span className="text-xl">🔑</span>
              </motion.div>
              <div className="min-w-0">
                <motion.h3
                  variants={titleVariants}
                  initial="rest"
                  whileHover="hover"
                  className="text-base sm:text-lg font-bold line-clamp-1 cursor-pointer transition-colors duration-200"
                  style={{ color: theme.text }}
                  onClick={handleEdit}
                >
                  {privilege.privilegeName}
                </motion.h3>
                <div
                  className="text-xs mt-0.5 font-mono"
                  style={{ color: theme.textSecondary }}
                >
                  ID: {privilege.privilegeId}
                </div>
              </div>
            </div>

            <motion.span
              variants={statusBadgeVariants}
              initial="hidden"
              animate="visible"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                isActive ? "shadow-sm" : ""
              }`}
              style={{
                backgroundColor: isActive
                  ? hexToRgba(theme.success, 0.12)
                  : hexToRgba(theme.error, 0.12),
                color: isActive ? theme.success : theme.error,
                border: `1px solid ${
                  isActive
                    ? hexToRgba(theme.success, 0.25)
                    : hexToRgba(theme.error, 0.25)
                }`,
              }}
            >
              <motion.span
                className={`w-1.5 h-1.5 rounded-full`}
                style={{
                  backgroundColor: isActive ? theme.success : theme.error,
                }}
                animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {isActive ? "Active" : "Inactive"}
            </motion.span>
          </div>

          {/* Description */}
          <motion.p
            className="text-sm mb-4 line-clamp-3 flex-grow leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            {privilege.privilegeDescription || "No description provided."}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-2 mt-auto pt-4 border-t"
            style={{ borderColor: theme.border }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="flex-1"
            >
              <CommonButton
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleEdit}
              >
                Edit
              </CommonButton>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="flex-1"
            >
              <CommonButton
                variant="success"
                size="sm"
                fullWidth
                onClick={handleView}
              >
                View
              </CommonButton>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="flex-1"
            >
              <CommonButton
                variant="error"
                size="sm"
                fullWidth
                onClick={handleTerminateClick}
              >
                Delete
              </CommonButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PrivilegeCard;

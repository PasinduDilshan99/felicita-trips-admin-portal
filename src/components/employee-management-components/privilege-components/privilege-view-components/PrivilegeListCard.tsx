"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { PrivilegeListCardProps } from "@/types/privilege-types";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import {
  PRIVILEGES_TERMINATE_PAGE_URL,
  PRIVILEGES_UPDATE_PAGE_URL,
  PRIVILEGES_VIEW_PAGE_URL,
} from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  descriptionVariants,
  EASE_OUT,
  iconVariants,
  statusBadgeVariants,
  titleVariants,
} from "@/app/animations/variants";

const PrivilegeListCard: React.FC<PrivilegeListCardProps> = ({ privilege }) => {
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
        className="rounded-xl overflow-hidden cursor-pointer"
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
        {/* Color accent line on hover */}
        <motion.div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />

        <div className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.12)}, ${hexToRgba(theme.accent, 0.08)})`,
                  }}
                >
                  <span className="text-lg">🔑</span>
                </motion.div>

                <div className="min-w-0">
                  <motion.h3
                    variants={titleVariants}
                    initial="rest"
                    whileHover="hover"
                    className="text-base sm:text-lg font-bold cursor-pointer transition-colors duration-200 line-clamp-1"
                    style={{ color: theme.text }}
                    onClick={handleEdit}
                  >
                    {privilege.privilegeName}
                  </motion.h3>

                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span
                      className="text-xs font-mono"
                      style={{ color: theme.textSecondary }}
                    >
                      ID: {privilege.privilegeId}
                    </span>

                    <motion.span
                      variants={statusBadgeVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
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
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: isActive
                            ? theme.success
                            : theme.error,
                        }}
                        animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <motion.p
                variants={descriptionVariants}
                initial="hidden"
                animate="visible"
                className="text-sm mt-3 leading-relaxed"
                style={{ color: theme.textSecondary }}
              >
                {privilege.privilegeDescription || "No description provided."}
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-2 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <CommonButton variant="outline" size="sm" onClick={handleEdit}>
                  Edit
                </CommonButton>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <CommonButton variant="primary" size="sm" onClick={handleView}>
                  View
                </CommonButton>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <CommonButton
                  variant="error"
                  size="sm"
                  onClick={handleTerminateClick}
                >
                  Delete
                </CommonButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PrivilegeListCard;

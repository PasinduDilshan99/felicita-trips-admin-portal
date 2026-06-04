"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Globe, MapPin, Tag, DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SingleDestinationResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  cardVariants,
  categoryVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";
import { DESTINATION_CATEGORY_VIEW_PAGE_URL } from "@/utils/urls";
import PrivilegedTag from "@/components/common-components/secure/PrivilegedTag";
import { DESTINATION_CATEGORY_VIEW_PRIVILEGE } from "@/utils/privileges";

interface BasicInfoPanelProps {
  destinationDetails: SingleDestinationResponse;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  destinationDetails,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.primary, 0.04),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <Globe className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Basic Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {destinationDetails.destinationName}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Description
          </p>
          <motion.div
            variants={valueVariants}
            className="text-xs leading-relaxed break-words"
            style={{ color: theme.textSecondary }}
          >
            {destinationDetails.destinationDescription}
          </motion.div>
        </motion.div>

        {/* Location */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Location
          </p>
          <motion.div
            variants={valueVariants}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: theme.text }}
          >
            <MapPin size={12} style={{ color: theme.primary }} />
            {destinationDetails.location}
          </motion.div>
        </motion.div>

        {/* Coordinates Grid */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Coordinates
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs font-mono"
              style={{ color: theme.text }}
            >
              {destinationDetails.latitude?.toFixed(6)}°,{" "}
              {destinationDetails.longitude?.toFixed(6)}°
            </motion.div>
          </div>

          {/* Categories - Clickable (Same Tab Navigation) */}
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {destinationDetails.destinationCategoryDetailsDtos?.length > 0 ? (
                destinationDetails.destinationCategoryDetailsDtos.map(
                  (cat, index) => (
                    <PrivilegedTag
                      key={cat.id || cat.name}
                      id={cat.id}
                      name={cat.name}
                      requiredPrivilege={DESTINATION_CATEGORY_VIEW_PRIVILEGE}
                      navigateTo={DESTINATION_CATEGORY_VIEW_PAGE_URL}
                      showTooltip={true}
                      tooltipText="You need permission to view this category"
                      asDiv={true}
                      className="inline-block"
                    >
                      <motion.span
                        variants={categoryVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                        custom={index}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer group"
                        style={{
                          background: hexToRgba(theme.primary, 0.12),
                          color: theme.primary,
                          border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
                        }}
                      >
                        <Tag size={10} className="flex-shrink-0" />
                        <span>{cat.name}</span>
                        <ChevronRight
                          size={10}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </motion.span>
                    </PrivilegedTag>
                  ),
                )
              ) : (
                <motion.span
                  variants={valueVariants}
                  className="text-xs italic"
                  style={{ color: theme.textSecondary }}
                >
                  No categories
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {destinationDetails.extraPrice && destinationDetails.extraPrice > 0 && (
          <motion.div variants={infoRowVariants}>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Extra Price
            </p>
            <motion.div
              variants={valueVariants}
              className="flex flex-wrap items-center gap-1 text-xs"
              style={{ color: theme.text }}
            >
              <DollarSign size={12} style={{ color: theme.primary }} />
              <span className="font-medium">
                {formatPrice(destinationDetails.extraPrice)}
              </span>
              {destinationDetails.extraPriceNote && (
                <>
                  <span
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    ·
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    {destinationDetails.extraPriceNote}
                  </span>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

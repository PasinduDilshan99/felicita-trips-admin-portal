"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Shield,
  ChevronDown,
  ChevronUp,
  IdCard,
  Car,
  Globe,
  Heart,
  Clock,
  Wallet,
  BadgeCheck,
  Home,
  Map,
  Flag,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { UserBasicDetails } from "@/types/user-types";

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.4, ease: EASE_OUT },
  },
};

const avatarVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
      duration: 0.5,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.35,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

const infoRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper to format full address
const getFullAddress = (details: UserBasicDetails): string | null => {
  const parts = [];
  if (details.addressNumber) parts.push(details.addressNumber);
  if (details.addressLane1) parts.push(details.addressLane1);
  if (details.addressLane2) parts.push(details.addressLane2);
  if (details.addressCity) parts.push(details.addressCity);
  if (details.addressDistrict) parts.push(details.addressDistrict);
  if (details.addressPostalCode) parts.push(details.addressPostalCode);
  if (details.addressCountry) parts.push(details.addressCountry);

  return parts.length > 0 ? parts.join(", ") : null;
};

// Helper to safely get string value
const getSafeValue = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return value;
};

/* ─── Section Header Button ───────────────────────────────────────────────── */
interface SectionButtonProps {
  icon: React.ReactNode;
  title: string;
  isExpanded: boolean;
  onClick: () => void;
  theme: any;
}

const SectionButton: React.FC<SectionButtonProps> = ({
  icon,
  title,
  isExpanded,
  onClick,
  theme,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between p-4 transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: isExpanded
          ? hexToRgba(theme.primary, 0.05)
          : hovered
          ? hexToRgba(theme.textSecondary, 0.03)
          : "transparent",
        borderLeft: isExpanded
          ? `3px solid ${theme.primary}`
          : "3px solid transparent",
      }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          animate={hovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {icon}
        </motion.div>
        <span className="font-semibold text-sm" style={{ color: theme.text }}>
          {title}
        </span>
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />
      </motion.div>
    </motion.button>
  );
};

/* ─── Info Row Component ──────────────────────────────────────────────────── */
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  theme: any;
  highlight?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  theme,
  highlight,
}) => {
  const displayValue = value === null || value === undefined ? "N/A" : String(value);
  
  return (
    <motion.div variants={infoRowVariants} className="flex items-center gap-2.5 group">
      <div
        className="flex-shrink-0 w-4 h-4 transition-transform duration-200 group-hover:scale-110"
        style={{ color: theme.textSecondary }}
      >
        {icon}
      </div>
      <span
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: theme.textSecondary }}
      >
        {label}:
      </span>
      <span
        className="text-sm transition-colors duration-200"
        style={{
          color: highlight ? theme.primary : theme.text,
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {displayValue}
      </span>
    </motion.div>
  );
};

/* ─── Status Badge Component ─────────────────────────────────────────────── */
interface StatusBadgeProps {
  status: string;
  theme: any;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, theme }) => {
  const getStatusConfig = () => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "active":
        return { icon: CheckCircle, color: theme.success, label: "Active" };
      case "inactive":
        return { icon: XCircle, color: theme.error, label: "Inactive" };
      case "suspended":
        return { icon: AlertCircle, color: theme.warning, label: "Suspended" };
      case "banned":
        return { icon: XCircle, color: theme.error, label: "Banned" };
      default:
        return { icon: AlertCircle, color: theme.textSecondary, label: status };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.span
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: hexToRgba(config.color, 0.12),
        color: config.color,
      }}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </motion.span>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */

// Add the missing interface definition here
interface UserDetailsCardProps {
  userDetails: UserBasicDetails;
}

export const UserDetailsCard: React.FC<UserDetailsCardProps> = ({
  userDetails,
}) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal"]),
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isSectionExpanded = (section: string) => expandedSections.has(section);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        backgroundColor: theme.surface,
        border: `1.5px solid ${theme.border}`,
        boxShadow: `0 4px 20px ${hexToRgba(theme.text, 0.06)}`,
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

      {/* Header with User Info */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="p-5"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.04)}, ${hexToRgba(theme.primary, 0.01)})`,
          borderBottom: `1.5px solid ${theme.border}`,
        }}
      >
        <div className="flex flex-wrap gap-5 items-start">
          {/* Avatar */}
          <motion.div variants={avatarVariants} className="flex-shrink-0 group">
            {userDetails.imageUrl ? (
              <img
                src={userDetails.imageUrl}
                alt={userDetails.username}
                className="w-20 h-20 rounded-2xl object-cover border-4 transition-all duration-300 group-hover:scale-105"
                style={{ borderColor: theme.primary }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}11)`,
                  color: theme.primary,
                  border: `1.5px solid ${theme.primary}33`,
                }}
              >
                <User className="w-10 h-10" />
              </div>
            )}
          </motion.div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                {userDetails.firstName} {userDetails.middleName || ""}{" "}
                {userDetails.lastName}
              </h2>
              <StatusBadge status={userDetails.userStatus} theme={theme} />
              <motion.span
                variants={badgeVariants}
                className="px-2.5 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                  color: theme.textSecondary,
                }}
              >
                ID: {userDetails.userId}
              </motion.span>
            </div>
            <motion.p
              variants={infoRowVariants}
              className="text-sm mb-2"
              style={{ color: theme.textSecondary }}
            >
              @{userDetails.username}
            </motion.p>
            <motion.div variants={infoRowVariants} className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                <span style={{ color: theme.textSecondary }}>
                  {userDetails.email}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                <span style={{ color: theme.textSecondary }}>
                  {userDetails.mobileNumber1}
                </span>
              </div>
            </motion.div>
          </div>

          {/* User Type Badge */}
          <motion.div
            variants={badgeVariants}
            className="text-center px-4 py-2.5 rounded-xl min-w-[100px]"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.08),
              border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-sm font-semibold" style={{ color: theme.primary }}>
                {userDetails.userType}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
              User Type
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Expandable Sections */}
      <div className="divide-y" style={{ borderColor: theme.border }}>
        {/* Personal Information */}
        <div>
          <SectionButton
            icon={<User className="w-4 h-4" style={{ color: theme.primary }} />}
            title="Personal Information"
            isExpanded={isSectionExpanded("personal")}
            onClick={() => toggleSection("personal")}
            theme={theme}
          />
          <AnimatePresence>
            {isSectionExpanded("personal") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <InfoRow
                  icon={<IdCard className="w-3.5 h-3.5" />}
                  label="NIC"
                  value={userDetails.nic}
                  theme={theme}
                />
                <InfoRow
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Date of Birth"
                  value={formatDate(userDetails.dateOfBirth)}
                  theme={theme}
                />
                <InfoRow
                  icon={<Car className="w-3.5 h-3.5" />}
                  label="Driving License"
                  value={userDetails.drivingLicenseNumber}
                  theme={theme}
                />
                <InfoRow
                  icon={<Globe className="w-3.5 h-3.5" />}
                  label="Passport"
                  value={userDetails.passportNumber}
                  theme={theme}
                />
                <InfoRow
                  icon={<Heart className="w-3.5 h-3.5" />}
                  label="Gender"
                  value={userDetails.gender}
                  theme={theme}
                />
                <InfoRow
                  icon={<Flag className="w-3.5 h-3.5" />}
                  label="Nationality"
                  value={userDetails.nationality}
                  theme={theme}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Information */}
        <div>
          <SectionButton
            icon={<Phone className="w-4 h-4" style={{ color: theme.primary }} />}
            title="Contact Information"
            isExpanded={isSectionExpanded("contact")}
            onClick={() => toggleSection("contact")}
            theme={theme}
          />
          <AnimatePresence>
            {isSectionExpanded("contact") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <InfoRow
                  icon={<Mail className="w-3.5 h-3.5" />}
                  label="Secondary Email"
                  value={userDetails.email2}
                  theme={theme}
                />
                <InfoRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Mobile 2"
                  value={userDetails.mobileNumber2}
                  theme={theme}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Address Information */}
        <div>
          <SectionButton
            icon={<Home className="w-4 h-4" style={{ color: theme.primary }} />}
            title="Address Information"
            isExpanded={isSectionExpanded("address")}
            onClick={() => toggleSection("address")}
            theme={theme}
          />
          <AnimatePresence>
            {isSectionExpanded("address") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 pt-2"
              >
                {getFullAddress(userDetails) ? (
                  <div className="space-y-4">
                    <motion.div
                      variants={infoRowVariants}
                      className="flex items-start gap-2.5 p-3 rounded-xl"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.03),
                      }}
                    >
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text }}>
                          {getFullAddress(userDetails)}
                        </p>
                      </div>
                    </motion.div>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2"
                      style={{ borderTop: `1px solid ${theme.border}` }}
                    >
                      {userDetails.addressNumber && (
                        <InfoRow
                          icon={<span className="text-xs">#</span>}
                          label="Street No"
                          value={userDetails.addressNumber}
                          theme={theme}
                        />
                      )}
                      {userDetails.addressLane1 && (
                        <InfoRow
                          icon={<Map className="w-3.5 h-3.5" />}
                          label="Line 1"
                          value={userDetails.addressLane1}
                          theme={theme}
                        />
                      )}
                      {userDetails.addressLane2 && (
                        <InfoRow
                          icon={<Map className="w-3.5 h-3.5" />}
                          label="Line 2"
                          value={userDetails.addressLane2}
                          theme={theme}
                        />
                      )}
                      {userDetails.addressCity && (
                        <InfoRow
                          icon={<Navigation className="w-3.5 h-3.5" />}
                          label="City"
                          value={userDetails.addressCity}
                          theme={theme}
                        />
                      )}
                      {userDetails.addressDistrict && (
                        <InfoRow
                          icon={<Flag className="w-3.5 h-3.5" />}
                          label="District"
                          value={userDetails.addressDistrict}
                          theme={theme}
                        />
                      )}
                      {userDetails.addressPostalCode && (
                        <InfoRow
                          icon={<span className="text-xs">📮</span>}
                          label="Postal Code"
                          value={userDetails.addressPostalCode}
                          theme={theme}
                        />
                      )}
                      {userDetails.addressCountry && (
                        <InfoRow
                          icon={<Globe className="w-3.5 h-3.5" />}
                          label="Country"
                          value={userDetails.addressCountry}
                          theme={theme}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    variants={infoRowVariants}
                    className="flex items-center justify-center py-8"
                  >
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      No address information available
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Information */}
        <div>
          <SectionButton
            icon={<Clock className="w-4 h-4" style={{ color: theme.primary }} />}
            title="Account Information"
            isExpanded={isSectionExpanded("account")}
            onClick={() => toggleSection("account")}
            theme={theme}
          />
          <AnimatePresence>
            {isSectionExpanded("account") && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <InfoRow
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Member Since"
                  value={formatDateTime(userDetails.createdAt)}
                  theme={theme}
                  highlight
                />
                <InfoRow
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Last Updated"
                  value={formatDateTime(userDetails.updatedAt)}
                  theme={theme}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
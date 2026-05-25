"use client";

import React from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield,
  ArrowLeft,
  Home,
  Phone,
  Mail,
  AlertTriangle,
  Lock,
  FileText,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

/* ─── Easing Curves ─────────────────────────────────────────────────────── */

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BACK_OUT: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
const SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

/* ─── Shared Spring Config ───────────────────────────────────────────────── */

const SPRING_SOFT = { type: "spring", damping: 28, stiffness: 180 } as const;
const SPRING_SNAPPY = { type: "spring", damping: 22, stiffness: 300 } as const;
const SPRING_BOUNCY = { type: "spring", damping: 16, stiffness: 400 } as const;

/* ─── Variants ───────────────────────────────────────────────────────────── */

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1, duration: 0.4 },
  },
};

const navVariants: Variants = {
  hidden: { opacity: 0, y: -56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EXPO_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EXPO_OUT },
  },
};

const headerBandVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EXPO_OUT },
  },
};

const fadeSlideLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EXPO_OUT },
  },
};

const bodyStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.55 },
  },
};

const logoVariants: Variants = {
  hidden: { scale: 0, rotate: -90, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { ...SPRING_BOUNCY, delay: 0.15 },
  },
};

const alertIconVariants: Variants = {
  hidden: { scale: 0.4, rotate: -30, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { ...SPRING_BOUNCY, delay: 0.4 },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, x: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { ...SPRING_SNAPPY, delay: 0.5 },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: EXPO_OUT },
  },
};

const actionButtonVariants: Variants = {
  rest: { scale: 1, x: 0, backgroundColor: "transparent" },
  hover: {
    scale: 1.015,
    x: 4,
    transition: { duration: 0.22, ease: SMOOTH },
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },
};

const ctaButtonVariants: Variants = {
  rest: { scale: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  hover: {
    scale: 1.04,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    transition: { duration: 0.22, ease: SMOOTH },
  },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

const chevronVariants: Variants = {
  rest: { opacity: 0, x: -4 },
  hover: { opacity: 1, x: 0, transition: { duration: 0.2, ease: SMOOTH } },
};

const iconTileVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.12, transition: SPRING_BOUNCY },
};

/* ─── Pulse ring for alert icon ─────────────────────────────────────────── */

const PulseRing = ({ color }: { color: string }) => (
  <motion.span
    aria-hidden
    className="absolute inset-0 rounded-xl"
    style={{ border: `2px solid ${color}` }}
    animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ─── Shimmer bar ────────────────────────────────────────────────────────── */

const ShimmerBar = ({ color }: { color: string }) => (
  <motion.div
    className="absolute bottom-0 left-0 h-0.5 rounded-full"
    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
    initial={{ width: "0%", x: "-100%" }}
    animate={{ width: "100%", x: "100%" }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
  />
);

/* ─── Component ─────────────────────────────────────────────────────────── */

const UnauthorizedPage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const [referenceId] = React.useState(
    () => `SEC-${Date.now().toString().slice(-12).toUpperCase()}`
  );
  const [errorCode] = React.useState(
    () => `SEC-${Date.now().toString().slice(-8)}`
  );

  const handleGoHome = () => router.push("/");
  const handleGoBack = () => router.back();
  const handleContactSupport = () => {
    window.location.href =
      "mailto:security@company.com?subject=Unauthorized%20Access%20Request";
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{
        background: `linear-gradient(145deg, ${theme.background} 0%, ${theme.surface} 60%, ${hexToRgba(theme.primary, 0.04)} 100%)`,
      }}
    >
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <motion.nav
        variants={navVariants}
        className="sticky top-0 z-50 backdrop-blur-xl border-b relative overflow-hidden"
        style={{
          backgroundColor: hexToRgba(theme.surface, 0.92),
          borderColor: theme.border,
        }}
      >
        <ShimmerBar color={hexToRgba(theme.primary, 0.4)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                variants={logoVariants}
                whileHover={{ scale: 1.08, rotate: 8, transition: SPRING_BOUNCY }}
                className="w-9 h-9 rounded-xl flex items-center justify-center mr-3 relative"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  boxShadow: `0 4px 14px ${hexToRgba(theme.primary, 0.35)}`,
                }}
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div variants={fadeSlideUp}>
                <span className="text-xl font-bold tracking-tight" style={{ color: theme.text }}>
                  SecurePortal
                </span>
                <motion.span
                  className="text-xs ml-2 px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: hexToRgba(theme.error, 0.1),
                    color: theme.error,
                  }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Enterprise
                </motion.span>
              </motion.div>
            </div>

            {/* Nav action */}
            <motion.a
              href="tel:+1-800-123-4567"
              variants={fadeSlideLeft}
              whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200"
              style={{
                color: theme.textSecondary,
                backgroundColor: hexToRgba(theme.border, 0.3),
              }}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">Support: 1-800-123-4567</span>
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          variants={cardVariants}
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 24px 48px -16px ${hexToRgba(theme.text, 0.12)}, 0 0 0 1px ${hexToRgba(theme.border, 0.5)}`,
          }}
        >
          {/* ── Error Header Band ──────────────────────────────────────── */}
          <motion.div
            variants={headerBandVariants}
            className="px-6 sm:px-8 py-6 sm:py-8 border-b relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.07)} 0%, ${hexToRgba(theme.warning, 0.04)} 100%)`,
              borderColor: theme.border,
            }}
          >
            {/* Subtle noise/texture layer */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top right, ${hexToRgba(theme.error, 0.06)}, transparent 65%)`,
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Alert Icon with pulse ring */}
                <motion.div
                  variants={alertIconVariants}
                  className="relative w-12 h-12 flex-shrink-0"
                >
                  <PulseRing color={hexToRgba(theme.error, 0.5)} />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.error}, ${hexToRgba(theme.error, 0.7)})`,
                      boxShadow: `0 0 24px ${hexToRgba(theme.error, 0.35)}`,
                    }}
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                <motion.div variants={fadeSlideUp}>
                  <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.text }}>
                    Access Denied
                  </h1>
                  <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>
                    Security violation detected
                  </p>
                </motion.div>
              </div>

              {/* Badge */}
              <motion.span
                variants={badgeVariants}
                className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: hexToRgba(theme.error, 0.12),
                  color: theme.error,
                  border: `1px solid ${hexToRgba(theme.error, 0.28)}`,
                }}
              >
                <motion.span
                  className="mr-1.5"
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Lock className="w-3 h-3 inline" />
                </motion.span>
                SECURITY ALERT
              </motion.span>
            </div>
          </motion.div>

          {/* ── Body ──────────────────────────────────────────────────── */}
          <motion.div
            variants={bodyStagger}
            className="p-6 sm:p-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left — Details + Actions */}
              <div className="lg:col-span-2 space-y-6">

                {/* Description */}
                <motion.div variants={fadeSlideUp}>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
                    Unauthorized Access Attempt
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    Your account does not have the necessary permissions to access the
                    requested resource. This attempt has been logged for security review.
                  </p>
                </motion.div>

                {/* Meta grid */}
                <motion.div
                  variants={fadeSlideUp}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: hexToRgba(theme.border, 0.18),
                    border: `1px solid ${hexToRgba(theme.border, 0.45)}`,
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: theme.textSecondary }}>
                        Error Code
                      </p>
                      <motion.p
                        className="text-sm font-mono font-semibold"
                        style={{ color: theme.error }}
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        403 — Forbidden
                      </motion.p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: theme.textSecondary }}>
                        Timestamp
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" style={{ color: theme.textSecondary }} />
                        <p className="text-sm font-medium" style={{ color: theme.text }}>
                          {formattedTime}
                        </p>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Recommended Actions */}
                <motion.div variants={fadeSlideUp}>
                  <h3 className="text-base font-semibold mb-3" style={{ color: theme.text }}>
                    Recommended Actions
                  </h3>
                  <motion.div
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="space-y-3"
                  >
                    {[
                      {
                        label: "Return to Previous Page",
                        sub: "Navigate back to your last location",
                        icon: ArrowLeft,
                        onClick: handleGoBack,
                        accent: theme.primary,
                        bg: hexToRgba(theme.border, 0.1),
                        border: hexToRgba(theme.border, 0.45),
                      },
                      {
                        label: "Go to Home Dashboard",
                        sub: "Access your authorized workspace",
                        icon: Home,
                        onClick: handleGoHome,
                        accent: theme.primary,
                        bg: hexToRgba(theme.primary, 0.05),
                        border: hexToRgba(theme.primary, 0.18),
                      },
                    ].map(({ label, sub, icon: Icon, onClick, accent, bg, border }) => (
                      <motion.button
                        key={label}
                        variants={listItemVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={onClick}
                        className="w-full text-left p-4 rounded-xl group relative overflow-hidden"
                        style={{ backgroundColor: bg, border: `1px solid ${border}` }}
                        custom={accent}
                      >
                        {/* hover shimmer */}
                        <motion.div
                          aria-hidden
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `linear-gradient(120deg, ${hexToRgba(accent, 0.04)}, transparent)`,
                          }}
                        />
                        <div className="relative flex items-center">
                          <motion.div
                            variants={iconTileVariants}
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                            style={{ backgroundColor: hexToRgba(accent, 0.12) }}
                          >
                            <Icon className="w-5 h-5" style={{ color: accent }} />
                          </motion.div>
                          <div className="flex-1">
                            <p className="font-medium text-sm" style={{ color: theme.text }}>
                              {label}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                              {sub}
                            </p>
                          </div>
                          <motion.div variants={chevronVariants}>
                            <ChevronRight className="w-4 h-4" style={{ color: theme.textSecondary }} />
                          </motion.div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              {/* Right — Contact + Notice */}
              <motion.div variants={fadeSlideLeft} className="space-y-4">

                {/* Contact card */}
                <motion.div
                  className="rounded-xl p-6"
                  style={{
                    background: `linear-gradient(145deg, ${hexToRgba(theme.primary, 0.06)}, ${hexToRgba(theme.accent, 0.03)})`,
                    border: `1px solid ${hexToRgba(theme.primary, 0.18)}`,
                  }}
                  whileHover={{
                    boxShadow: `0 8px 32px -8px ${hexToRgba(theme.primary, 0.15)}`,
                    transition: { duration: 0.3 },
                  }}
                >
                  <h3 className="text-base font-semibold mb-5" style={{ color: theme.text }}>
                    Need Assistance?
                  </h3>

                  <div className="space-y-5">
                    {[
                      {
                        icon: Mail,
                        label: "Email Support",
                        href: "mailto:security@company.com",
                        text: "security@company.com",
                        sub: null,
                      },
                      {
                        icon: Phone,
                        label: "Phone Support",
                        href: "tel:+1-800-123-4567",
                        text: "1-800-123-4567",
                        sub: "Available 24/7",
                      },
                    ].map(({ icon: Icon, label, href, text, sub }) => (
                      <motion.div
                        key={label}
                        className="flex items-start"
                        whileHover={{ x: 2, transition: { duration: 0.18 } }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                          style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
                          whileHover={{ scale: 1.1, transition: SPRING_BOUNCY }}
                        >
                          <Icon className="w-4 h-4" style={{ color: theme.primary }} />
                        </motion.div>
                        <div>
                          <p className="font-medium text-sm mb-0.5" style={{ color: theme.text }}>
                            {label}
                          </p>
                          <a
                            href={href}
                            className="text-sm transition-colors duration-200 hover:underline underline-offset-2"
                            style={{ color: theme.primary }}
                          >
                            {text}
                          </a>
                          {sub && (
                            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                              {sub}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t" style={{ borderColor: hexToRgba(theme.primary, 0.12) }}>
                    <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                      All access requests are logged and monitored for security purposes.
                      Unauthorized attempts may be reported to your supervisor.
                    </p>
                  </div>
                </motion.div>

                {/* Security notice */}
                <motion.div
                  className="flex items-start p-4 rounded-xl"
                  style={{
                    backgroundColor: hexToRgba(theme.border, 0.1),
                    border: `1px solid ${hexToRgba(theme.border, 0.4)}`,
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4, ease: EXPO_OUT }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="mr-3 flex-shrink-0 mt-0.5"
                  >
                    <Shield className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  </motion.div>
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: theme.text }}>
                      Security Protocol
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      Incident recorded under reference{" "}
                      <motion.code
                        className="px-1.5 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: hexToRgba(theme.border, 0.5),
                          color: theme.text,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.4 }}
                      >
                        {errorCode}
                      </motion.code>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <motion.div
            variants={fadeSlideUp}
            className="px-6 sm:px-8 py-5 border-t flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden"
            style={{
              borderColor: theme.border,
              backgroundColor: hexToRgba(theme.border, 0.08),
            }}
          >
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.4, ease: EXPO_OUT }}
            >
              <FileText className="w-4 h-4" style={{ color: theme.textSecondary }} />
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Reference ID:{" "}
                <motion.span
                  className="font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  {referenceId}
                </motion.span>
              </p>
            </motion.div>

            <motion.button
              variants={ctaButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleContactSupport}
              className="px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                color: "#fff",
                boxShadow: `0 4px 14px ${hexToRgba(theme.primary, 0.32)}`,
              }}
            >
              {/* Shine sweep */}
              <motion.span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
              />
              <span className="relative">Request Access</span>
              <ExternalLink className="w-3.5 h-3.5 relative" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Legal */}
        <motion.div
          variants={fadeSlideUp}
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            © {new Date().getFullYear()} SecurePortal. All rights reserved. |{" "}
            {["Privacy Policy", "Terms of Service", "Security Policy"].map((label, i) => (
              <React.Fragment key={label}>
                <a
                  href={`/${label.toLowerCase().replace(/ /g, "-")}`}
                  className="hover:underline underline-offset-2 transition-all duration-150"
                  style={{ color: theme.textSecondary }}
                >
                  {label}
                </a>
                {i < 2 && " | "}
              </React.Fragment>
            ))}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UnauthorizedPage;
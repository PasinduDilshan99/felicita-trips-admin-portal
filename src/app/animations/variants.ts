import { type Variants } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE_IN },
  },
};

export const sidebarVariants: Variants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      duration: 0.3,
    },
  },
  closed: {
    x: "-100%",
    transition: {
      duration: 0.28,
      ease: EASE_IN,
    },
  },
};

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

export const navVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.4,
    },
  },
};

export const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.03,
      duration: 0.25,
      ease: EASE_OUT,
    },
  }),
};

export const subItemVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 8,
    transition: {
      duration: 0.28,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.22,
      ease: EASE_IN,
    },
  },
};

export const grandSubItemVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 8,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

export const chevronVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

export const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

export const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: EASE_IN,
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: EASE_IN,
    },
  },
};

export const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.15 },
  },
};

export const logoVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, rotate: 3, transition: { duration: 0.2 } },
  tap: { scale: 0.95, rotate: 0, transition: { duration: 0.1 } },
};

export const breadcrumbVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export const separatorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};


export const titleVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.35, ease: EASE_OUT },
  },
};

export const descriptionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3, ease: EASE_OUT },
  },
};

export const actionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.15, duration: 0.3, ease: EASE_OUT },
  },
};

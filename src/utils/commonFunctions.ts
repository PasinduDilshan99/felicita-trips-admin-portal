export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const truncateDescription = (
  description: string,
  maxLength: number = 120,
): string => {
  if (!description) return "";
  if (typeof description !== "string") return String(description);
  if (description.length <= maxLength) return description;

  let truncated = description.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength - 20) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + "...";
};

export const getSafeString = (value: any, fallback: string = ""): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "object") {
    if (value.name) return getSafeString(value.name, fallback);
    if (value.label) return getSafeString(value.label, fallback);
    try {
      const stringified = JSON.stringify(value);
      if (stringified.length > 50) return fallback;
      return stringified;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

"use client";

import React, { useId, useRef } from "react";
import { Edit, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface BasicInfoFormProps {
  destination: any;
  hasChanged: (field: string) => boolean;
  onFieldChange: (field: string, value: any) => void;
}

const NAME_MAX = 100;
const DESCRIPTION_MAX = 1000;

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Visible to customers",
    color: "#16a34a",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Hidden from customers",
    color: "#6b7280",
  },
];

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  destination,
  hasChanged,
  onFieldChange,
}) => {
  const { theme } = useTheme();
  const uid = useId();
  const statusRef = useRef<HTMLSelectElement>(null);

  const descLength = (destination.destinationDescription ?? "").length;
  const descPct = (descLength / DESCRIPTION_MAX) * 100;
  const descColor =
    descPct > 90 ? theme.error : descPct > 70 ? "#f59e0b" : theme.primary;

  const handleStatusClick = (value: string) => {
    if (!statusRef.current) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(statusRef.current, value);
    statusRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    onFieldChange("statusName", value);
  };

  const focusHandlers = (isChanged: boolean) => ({
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      if (!isChanged) {
        e.currentTarget.style.borderColor = theme.border;
      } else {
        e.currentTarget.style.borderColor = theme.primary;
      }
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  return (
    <>
      <style>{`
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        .field-error { animation: errorShake 0.35s ease; }

        .status-pill {
          transition: background 0.18s ease, border-color 0.18s ease,
                      box-shadow 0.18s ease, transform 0.15s ease;
        }
        .status-pill:hover { transform: translateY(-1px); }

        .desc-bar-fill {
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.primary}18`,
              color: theme.primary,
            }}
          >
            <Edit className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Basic Information
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Core details about the destination
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${uid}-name`}
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Destination Name
                  <span style={{ color: theme.error }}> *</span>
                </label>
                <span
                  className="text-xs tabular-nums"
                  style={{
                    color:
                      (destination.destinationName ?? "").length > NAME_MAX * 0.9
                        ? theme.error
                        : theme.textSecondary,
                  }}
                >
                  {(destination.destinationName ?? "").length}/{NAME_MAX}
                </span>
              </div>
              <input
                id={`${uid}-name`}
                type="text"
                value={destination.destinationName}
                onChange={(e) =>
                  onFieldChange("destinationName", e.target.value)
                }
                placeholder="e.g. Sigiriya Rock Fortress"
                maxLength={NAME_MAX}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("destinationName")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("destinationName")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                {...focusHandlers(hasChanged("destinationName"))}
              />
              {hasChanged("destinationName") && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.primary }}
                >
                  This field has been modified
                </p>
              )}
            </div>

            {/* Status - Custom Pill Buttons */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textSecondary }}
              >
                Status
              </label>

              {/* Hidden select keeps onFieldChange contract intact */}
              <select
                ref={statusRef}
                name="statusName"
                value={destination.statusName}
                onChange={(e) => onFieldChange("statusName", e.target.value)}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = destination.statusName === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleStatusClick(opt.value)}
                      className="status-pill flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left"
                      style={{
                        backgroundColor: isSelected
                          ? `${opt.color}10`
                          : theme.background,
                        borderColor: isSelected ? opt.color : theme.border,
                        boxShadow: isSelected
                          ? `0 0 0 3px ${opt.color}18`
                          : "none",
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? `${opt.color}20`
                            : `${theme.border}60`,
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: isSelected
                              ? opt.color
                              : theme.textSecondary,
                          }}
                        />
                      </span>
                      <span className="min-w-0">
                        <span
                          className="block text-sm font-semibold leading-tight"
                          style={{
                            color: isSelected ? opt.color : theme.text,
                          }}
                        >
                          {opt.label}
                        </span>
                        <span
                          className="block text-xs mt-0.5"
                          style={{ color: theme.textSecondary }}
                        >
                          {opt.description}
                        </span>
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          className="w-4 h-4 ml-auto flex-shrink-0"
                          style={{ color: opt.color }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${uid}-description`}
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Description
                  <span style={{ color: theme.error }}> *</span>
                </label>
              </div>
              <textarea
                id={`${uid}-description`}
                value={destination.destinationDescription}
                onChange={(e) =>
                  onFieldChange("destinationDescription", e.target.value)
                }
                rows={5}
                placeholder="Describe what makes this destination special…"
                maxLength={DESCRIPTION_MAX}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("destinationDescription")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("destinationDescription")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                {...focusHandlers(hasChanged("destinationDescription"))}
              />

              {/* Progress bar + counter */}
              <div className="mt-2 space-y-1">
                <div
                  className="w-full h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: theme.border }}
                >
                  <div
                    className="desc-bar-fill h-full rounded-full"
                    style={{
                      width: `${Math.min(descPct, 100)}%`,
                      backgroundColor: descColor,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  {hasChanged("destinationDescription") && (
                    <p
                      className="text-xs flex items-center gap-1"
                      style={{ color: theme.primary }}
                    >
                      This field has been modified
                    </p>
                  )}
                  <span
                    className="text-xs tabular-nums ml-auto"
                    style={{ color: descColor }}
                  >
                    {descLength}/{DESCRIPTION_MAX}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Location
                <span style={{ color: theme.error }}> *</span>
              </label>
              <input
                type="text"
                value={destination.location}
                onChange={(e) => onFieldChange("location", e.target.value)}
                placeholder="e.g. Matale District, Sri Lanka"
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("location")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("location")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                {...focusHandlers(hasChanged("location"))}
              />
              {hasChanged("location") && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.primary }}
                >
                  This field has been modified
                </p>
              )}
            </div>

            {/* Extra Price */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Extra Price (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={destination.extraPrice || ""}
                onChange={(e) =>
                  onFieldChange("extraPrice", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: theme.border,
                }}
                placeholder="0.00"
                {...focusHandlers(false)}
              />
            </div>

            {/* Extra Price Note */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Extra Price Note
              </label>
              <input
                type="text"
                value={destination.extraPriceNote || ""}
                onChange={(e) =>
                  onFieldChange("extraPriceNote", e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: theme.border,
                }}
                placeholder="e.g., Entrance fee, Tax, etc."
                {...focusHandlers(false)}
              />
            </div>

            {/* Latitude */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={destination.latitude}
                onChange={(e) =>
                  onFieldChange("latitude", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("latitude")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("latitude")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                placeholder="e.g. 7.9567"
                {...focusHandlers(hasChanged("latitude"))}
              />
              {hasChanged("latitude") && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.primary }}
                >
                  This field has been modified
                </p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={destination.longitude}
                onChange={(e) =>
                  onFieldChange("longitude", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("longitude")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("longitude")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                placeholder="e.g. 80.7417"
                {...focusHandlers(hasChanged("longitude"))}
              />
              {hasChanged("longitude") && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.primary }}
                >
                  This field has been modified
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
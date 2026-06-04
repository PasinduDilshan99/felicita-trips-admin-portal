"use client";

import React, { useId, useRef } from "react";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DESTINATION_STATUS_OPTIONS } from "@/data/status-options-data";
import { DestinationInfoFormProps } from "@/types/destination-types";
import {
  DESTINATION_DESCRIPTION_MAX,
  DESTINATION_NAME_MAX,
} from "@/validations/destinationValidations";

export const DestinationInfoForm: React.FC<DestinationInfoFormProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const { theme } = useTheme();
  const uid = useId();
  const statusRef = useRef<HTMLSelectElement>(null);

  const descLength = (formData.description ?? "").length;
  const descPct = (descLength / DESTINATION_DESCRIPTION_MAX) * 100;
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
  };

  const focusHandlers = (hasError: boolean) => ({
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = hasError
        ? theme.error
        : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${
        hasError ? theme.error : theme.primary
      }18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.border;
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
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Destination Information
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Core details shown to customers
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
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
                    (formData.name ?? "").length > DESTINATION_NAME_MAX * 0.9
                      ? theme.error
                      : theme.textSecondary,
                }}
              >
                {(formData.name ?? "").length}/{DESTINATION_NAME_MAX}
              </span>
            </div>
            <input
              id={`${uid}-name`}
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="e.g. Sigiriya Rock Fortress"
              maxLength={DESTINATION_NAME_MAX}
              className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                errors.name ? " field-error" : ""
              }`}
              style={{
                ...fieldBase,
                borderColor: errors.name ? theme.error : theme.border,
              }}
              {...focusHandlers(!!errors.name)}
            />
            {errors.name && (
              <p
                className="mt-1.5 text-xs flex items-center gap-1"
                style={{ color: theme.error }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
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
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows={5}
              placeholder="Describe what makes this destination special…"
              maxLength={DESTINATION_DESCRIPTION_MAX}
              className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none${
                errors.description ? " field-error" : ""
              }`}
              style={{
                ...fieldBase,
                borderColor: errors.description ? theme.error : theme.border,
              }}
              {...focusHandlers(!!errors.description)}
            />

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
                {errors.description ? (
                  <p
                    className="text-xs flex items-center gap-1"
                    style={{ color: theme.error }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <span
                  className="text-xs tabular-nums ml-auto"
                  style={{ color: descColor }}
                >
                  {descLength}/{DESTINATION_DESCRIPTION_MAX}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.textSecondary }}
            >
              Status
            </label>

            <select
              ref={statusRef}
              name="status"
              value={formData.status}
              onChange={onInputChange}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            >
              {DESTINATION_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              {DESTINATION_STATUS_OPTIONS.map((opt) => {
                const isSelected = formData.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStatusClick(opt.value)}
                    className="cursor-pointer status-pill flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left"
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
                        style={{ color: isSelected ? opt.color : theme.text }}
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
        </div>
      </div>
    </>
  );
};

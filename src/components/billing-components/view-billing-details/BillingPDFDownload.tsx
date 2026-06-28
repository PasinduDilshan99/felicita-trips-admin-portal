"use client";

import React, { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingBillingDetails } from "@/types/billing-types";
import {
  COMPANY_ADDRESS,
  COMPANY_CONTACT_NUMBER,
  COMPANY_INFO_EMAIL,
  COMPANY_LOCATION,
  COMPANY_LOGO_IMAGE,
  COMPANY_NAME,
  COMPANY_OWNER,
  COMPANY_THEME,
} from "@/utils/constant";

interface BillingPDFDownloadProps {
  billingData: BookingBillingDetails;
  buttonText?: string;
  buttonVariant?:
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "default";
  className?: string;
}

export const BillingPDFDownload: React.FC<BillingPDFDownloadProps> = ({
  billingData,
  buttonText = "Download Invoice",
  buttonVariant = "primary",
  className = "",
}) => {
  const { theme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getPaymentStatus = (dueAmount: number, finalAmount: number) => {
    if (dueAmount <= 0)
      return {
        bg: "#d1fae5",
        color: "#065f46",
        label: "PAID IN FULL",
        dot: "#10b981",
      };
    if (dueAmount < finalAmount)
      return {
        bg: "#fef3c7",
        color: "#92400e",
        label: "PARTIALLY PAID",
        dot: "#f59e0b",
      };
    return {
      bg: "#fee2e2",
      color: "#991b1b",
      label: "PAYMENT DUE",
      dot: "#ef4444",
    };
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    const container = document.createElement("div");

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const status = getPaymentStatus(
        billingData.billingSummary.dueAmount,
        billingData.billingSummary.finalAmount,
      );

      // ── Derived flags ── hide entire sections when empty ──────────────
      const hasParticipants = billingData.participants.length > 0;
      const hasPriceBreakdown = billingData.priceBreakdown.length > 0;
      const hasPackage =
        !!billingData.packageDetails.packageName ||
        !!billingData.packageDetails.scheduleName ||
        !!billingData.packageDetails.packageId;
      const hasDiscount = billingData.billingSummary.discountAmount > 0;
      const hasTax = billingData.billingSummary.taxAmount > 0;
      const hasInsurance = billingData.billingSummary.insuranceAmount > 0;

      container.style.cssText = `
        font-family: Arial, Helvetica, sans-serif;
        width: 794px;
        background: #ffffff;
        color: #1a2e28;
        font-size: 13px;
        line-height: 1.6;
      `;

      // ── helper: section wrapper that keeps itself on one page ─────────
      const section = (html: string) => `
        <div style="page-break-inside: avoid; break-inside: avoid;">
          ${html}
        </div>
      `;

      // ── helper: table row that never breaks mid-row ────────────────────
      const noBreakRow = (html: string, bg: string) => `
        <tr style="background:${bg}; page-break-inside:avoid; break-inside:avoid;">
          ${html}
        </tr>
      `;

      container.innerHTML = `

        <!-- ══ GLOBAL page-break rules ══ -->
        <style>
          * { box-sizing: border-box; }
          table { border-collapse: collapse; width: 100%; }
          tr { page-break-inside: avoid; break-inside: avoid; }
          .section-block { page-break-inside: avoid; break-inside: avoid; margin-bottom: 24px; }
          .avoid-break { page-break-inside: avoid; break-inside: avoid; }
        </style>

        <!-- ▌HEADER ▐ (always page 1, never orphaned) -->
        <div class="avoid-break" style="
          background: linear-gradient(135deg, #0a2a3a 0%, #0c3d30 45%, #0f7a6e 100%);
          padding: 36px 44px 32px;
        ">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="
                width:60px; height:60px; border-radius:14px;
                background:rgba(255,255,255,0.10);
                border:1.5px solid rgba(94,234,212,0.3);
                display:flex; align-items:center; justify-content:center;
                overflow:hidden;
              ">
                <img src="${COMPANY_LOGO_IMAGE}" alt="Felicita Trips" crossorigin="anonymous"
                  style="width:52px; height:52px; object-fit:contain;" />
              </div>
              <div>
                <div style="color:#ffffff; font-size:24px; font-weight:800; letter-spacing:-0.5px; line-height:1.1;">${COMPANY_NAME}</div>
                <div style="color:#5eead4; font-size:9.5px; letter-spacing:2.8px; text-transform:uppercase; margin-top:4px; font-weight:600;">${COMPANY_THEME}</div>
                <div style="color:rgba(255,255,255,0.45); font-size:10px; margin-top:3px;">${COMPANY_LOCATION}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="color:#5eead4; font-size:10px; letter-spacing:3px; text-transform:uppercase; font-weight:700; margin-bottom:4px;">Tax Invoice</div>
              <div style="color:#ffffff; font-size:26px; font-weight:800; letter-spacing:-0.5px; line-height:1;">#${billingData.bookingReference}</div>
              <div style="color:rgba(255,255,255,0.45); font-size:10.5px; margin-top:5px;">Booking ID: ${billingData.bookingId}</div>
              <div style="color:rgba(255,255,255,0.45); font-size:10.5px; margin-top:2px;">Issued: ${formatDate(billingData.bookingDate)}</div>
              <div style="
                display:inline-flex; align-items:center; gap:6px;
                margin-top:10px; padding:5px 14px; border-radius:20px;
                background:${status.bg}; color:${status.color};
                font-size:9.5px; font-weight:800; letter-spacing:1.5px;
              ">
                <span style="width:6px; height:6px; border-radius:50%; background:${status.dot}; display:inline-block;"></span>
                ${status.label}
              </div>
            </div>
          </div>
        </div>

        <!-- Teal accent bar -->
        <div style="height:4px; background:linear-gradient(90deg,#5eead4,#0f7a6e,#0a2a3a);"></div>

        <!-- ▌BODY ▐ -->
        <div style="padding:32px 44px;">

          <!-- Bill To / From -->
          ${section(`
            <div style="display:flex; gap:20px; margin-bottom:24px;">
              <!-- Bill To -->
              <div style="flex:1; border-radius:12px; border:1px solid #d0ede8; overflow:hidden;">
                <div style="background:#0f7a6e; padding:9px 16px;">
                  <span style="color:#fff; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Bill To</span>
                </div>
                <div style="padding:16px; background:#f9fffe;">
                  <div style="font-size:15px; font-weight:800; color:#0a2a3a; margin-bottom:7px;">${billingData.customer.fullName}</div>
                  <div style="font-size:11.5px; color:#4b7b6f; margin-bottom:3px;">
                    <span style="color:#9bb8b2; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; margin-right:6px;">Email</span>${billingData.customer.email}
                  </div>
                  <div style="font-size:11.5px; color:#4b7b6f; margin-bottom:3px;">
                    <span style="color:#9bb8b2; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; margin-right:6px;">Mobile</span>${billingData.customer.mobileNumber}
                  </div>
                  <div style="font-size:11.5px; color:#4b7b6f;">
                    <span style="color:#9bb8b2; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; margin-right:6px;">User ID</span>#${billingData.customer.userId}
                  </div>
                </div>
              </div>
              <!-- Issued By -->
              <div style="flex:1; border-radius:12px; border:1px solid #d0ede8; overflow:hidden;">
                <div style="background:#0a2a3a; padding:9px 16px;">
                  <span style="color:#5eead4; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Issued By</span>
                </div>
                <div style="padding:16px; background:#f9fffe;">
                  <div style="font-size:15px; font-weight:800; color:#0a2a3a; margin-bottom:7px;">${COMPANY_NAME}</div>
                  <div style="font-size:11.5px; color:#4b7b6f; margin-bottom:3px;">
                    <span style="color:#9bb8b2; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; margin-right:6px;">Email</span>${COMPANY_INFO_EMAIL}
                  </div>
                  <div style="font-size:11.5px; color:#4b7b6f; margin-bottom:3px;">
                    <span style="color:#9bb8b2; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; margin-right:6px;">Phone</span>${COMPANY_CONTACT_NUMBER}
                  </div>
                  <div style="font-size:11.5px; color:#4b7b6f;">
                    <span style="color:#9bb8b2; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; margin-right:6px;">Address</span>${COMPANY_ADDRESS}
                  </div>
                </div>
              </div>
            </div>
          `)}

          <!-- Tour Details -->
          ${section(`
            <div style="border-radius:12px; border:1px solid #d0ede8; overflow:hidden; margin-bottom:24px;">
              <div style="background:linear-gradient(90deg,#0a2a3a,#0f4d3c); padding:10px 18px; display:flex; align-items:center; justify-content:space-between;">
                <span style="color:#5eead4; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Tour Details</span>
                <span style="color:rgba(255,255,255,0.5); font-size:10px;">ID: ${billingData.tour.tourId}</span>
              </div>
              <div style="padding:18px 20px; background:#f9fffe;">
                <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px dashed #d0ede8;">
                  <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Tour Name</div>
                  <div style="font-size:16px; font-weight:800; color:#0a2a3a;">${billingData.tour.tourName}</div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:16px 0;">
                  <div style="width:25%;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Duration</div>
                    <div style="font-weight:700; color:#0a2a3a; font-size:13px;">${billingData.tour.duration} <span style="font-weight:400; color:#6b9e95; font-size:11px;">days</span></div>
                  </div>
                  <div style="width:25%;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Total Persons</div>
                    <div style="font-weight:700; color:#0a2a3a; font-size:13px;">${billingData.tour.totalPersons} <span style="font-weight:400; color:#6b9e95; font-size:11px;">pax</span></div>
                  </div>
                  <div style="width:50%;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Route</div>
                    <div style="font-weight:700; color:#0a2a3a; font-size:13px;">
                      ${billingData.tour.startLocation}
                      <span style="color:#5eead4; margin:0 6px;">→</span>
                      ${billingData.tour.endLocation}
                    </div>
                  </div>
                  <div style="width:50%; padding-top:12px;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Travel Start Date</div>
                    <div style="font-weight:600; color:#0a2a3a; font-size:12.5px;">${formatDate(billingData.tour.travelStartDate)}</div>
                  </div>
                  <div style="width:50%; padding-top:12px;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Travel End Date</div>
                    <div style="font-weight:600; color:#0a2a3a; font-size:12.5px;">${formatDate(billingData.tour.travelEndDate)}</div>
                  </div>
                </div>
                ${
                  hasPackage
                    ? `
                <div style="margin-top:14px; padding-top:14px; border-top:1px dashed #d0ede8; display:flex; flex-wrap:wrap; gap:16px 0;">
                  ${
                    billingData.packageDetails.packageId
                      ? `
                  <div style="width:33%;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Package ID</div>
                    <div style="font-weight:600; color:#0a2a3a; font-size:12.5px;">#${billingData.packageDetails.packageId}</div>
                  </div>`
                      : ""
                  }
                  ${
                    billingData.packageDetails.packageName
                      ? `
                  <div style="width:33%;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Package Name</div>
                    <div style="font-weight:600; color:#0a2a3a; font-size:12.5px;">${billingData.packageDetails.packageName}</div>
                  </div>`
                      : ""
                  }
                  ${
                    billingData.packageDetails.scheduleName
                      ? `
                  <div style="width:33%;">
                    <div style="color:#9bb8b2; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:3px;">Schedule</div>
                    <div style="font-weight:600; color:#0a2a3a; font-size:12.5px;">${billingData.packageDetails.scheduleName}</div>
                  </div>`
                      : ""
                  }
                </div>`
                    : ""
                }
              </div>
            </div>
          `)}

          <!-- Participants — hidden entirely when empty -->
          ${
            hasParticipants
              ? section(`
            <div style="border-radius:12px; border:1px solid #d0ede8; overflow:hidden; margin-bottom:24px;">
              <div style="background:linear-gradient(90deg,#0f4d3c,#0f7a6e); padding:10px 18px; display:flex; align-items:center; justify-content:space-between;">
                <span style="color:#fff; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Participants</span>
                <span style="background:rgba(255,255,255,0.15); color:#fff; font-size:9px; font-weight:700; padding:2px 10px; border-radius:10px;">
                  ${billingData.participants.length} Traveller${billingData.participants.length > 1 ? "s" : ""}
                </span>
              </div>
              <table>
                <thead>
                  <tr style="background:#f0fafa; border-bottom:1px solid #d0ede8; page-break-inside:avoid; break-inside:avoid;">
                    <th style="padding:9px 18px; text-align:left; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; width:40px;">#</th>
                    <th style="padding:9px 18px; text-align:left; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Full Name</th>
                    <th style="padding:9px 18px; text-align:left; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Passport Number</th>
                  </tr>
                </thead>
                <tbody>
                  ${billingData.participants
                    .map((p, i) =>
                      noBreakRow(
                        `
                    <td style="padding:10px 18px; color:#9bb8b2; font-size:11px; font-weight:700; border-bottom:1px solid #e8f4f1;">${String(i + 1).padStart(2, "0")}</td>
                    <td style="padding:10px 18px; font-weight:600; color:#0a2a3a; border-bottom:1px solid #e8f4f1;">${p.firstName} ${p.lastName}</td>
                    <td style="padding:10px 18px; font-family:monospace; color:#4b7b6f; font-size:12px; letter-spacing:0.5px; border-bottom:1px solid #e8f4f1;">${p.passportNumber || "—"}</td>
                  `,
                        i % 2 === 0 ? "#ffffff" : "#f7fcfb",
                      ),
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `)
              : ""
          }

          <!-- Price Breakdown — hidden entirely when empty -->
          ${
            hasPriceBreakdown
              ? section(`
            <div style="border-radius:12px; border:1px solid #d0ede8; overflow:hidden; margin-bottom:24px;">
              <div style="background:linear-gradient(90deg,#0a2a3a,#0c3d30); padding:10px 18px;">
                <span style="color:#5eead4; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">Price Breakdown</span>
              </div>
              <table>
                <thead>
                  <tr style="background:#f0fafa; border-bottom:2px solid #d0ede8; page-break-inside:avoid; break-inside:avoid;">
                    <th style="padding:10px 18px; text-align:left; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Item</th>
                    <th style="padding:10px 18px; text-align:center; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Type</th>
                    <th style="padding:10px 18px; text-align:center; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Qty</th>
                    <th style="padding:10px 18px; text-align:right; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Unit Price</th>
                    <th style="padding:10px 18px; text-align:right; color:#6b9e95; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${billingData.priceBreakdown
                    .map((item, i) =>
                      noBreakRow(
                        `
                    <td style="padding:11px 18px; font-weight:700; color:#0a2a3a; border-bottom:1px solid #e8f4f1;">${item.itemName}</td>
                    <td style="padding:11px 18px; text-align:center; border-bottom:1px solid #e8f4f1;">
                      <span style="background:#e8f5f2; color:#0f7a6e; font-size:9.5px; font-weight:700; padding:3px 10px; border-radius:20px;">${item.itemType}</span>
                    </td>
                    <td style="padding:11px 18px; text-align:center; color:#4b7b6f; border-bottom:1px solid #e8f4f1;">${item.quantity}</td>
                    <td style="padding:11px 18px; text-align:right; color:#4b7b6f; border-bottom:1px solid #e8f4f1;">${formatPrice(item.unitPrice)}</td>
                    <td style="padding:11px 18px; text-align:right; font-weight:800; color:#0a2a3a; border-bottom:1px solid #e8f4f1;">${formatPrice(item.totalPrice)}</td>
                  `,
                        i % 2 === 0 ? "#ffffff" : "#f7fcfb",
                      ),
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `)
              : ""
          }

          <!-- Billing Summary -->
          ${section(`
            <div style="display:flex; justify-content:flex-end; margin-bottom:32px;">
              <div style="width:340px; border-radius:12px; border:1px solid #d0ede8; overflow:hidden;">
                <div style="padding:16px 20px; background:#f9fffe; display:flex; flex-direction:column; gap:8px;">
                  <div style="display:flex; justify-content:space-between; font-size:12.5px;">
                    <span style="color:#6b9e95;">Subtotal</span>
                    <span style="color:#0a2a3a; font-weight:600;">${formatPrice(billingData.billingSummary.subtotal)}</span>
                  </div>
                  ${
                    hasDiscount
                      ? `
                  <div style="display:flex; justify-content:space-between; font-size:12.5px;">
                    <span style="color:#6b9e95;">Discount</span>
                    <span style="color:#059669; font-weight:700;">− ${formatPrice(billingData.billingSummary.discountAmount)}</span>
                  </div>`
                      : ""
                  }
                  ${
                    hasTax
                      ? `
                  <div style="display:flex; justify-content:space-between; font-size:12.5px;">
                    <span style="color:#6b9e95;">Tax</span>
                    <span style="color:#0a2a3a; font-weight:600;">${formatPrice(billingData.billingSummary.taxAmount)}</span>
                  </div>`
                      : ""
                  }
                  ${
                    hasInsurance
                      ? `
                  <div style="display:flex; justify-content:space-between; font-size:12.5px;">
                    <span style="color:#6b9e95;">Insurance</span>
                    <span style="color:#0a2a3a; font-weight:600;">${formatPrice(billingData.billingSummary.insuranceAmount)}</span>
                  </div>`
                      : ""
                  }
                </div>
                <div style="
                  background:linear-gradient(135deg,#0a2a3a,#0f7a6e);
                  padding:16px 20px;
                  display:flex; justify-content:space-between; align-items:center;
                ">
                  <span style="color:#5eead4; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">Total Amount</span>
                  <span style="color:#ffffff; font-size:20px; font-weight:800;">${formatPrice(billingData.billingSummary.finalAmount)}</span>
                </div>
                <div style="padding:14px 20px; background:#f9fffe; display:flex; flex-direction:column; gap:8px; border-top:2px solid #d0ede8;">
                  <div style="display:flex; justify-content:space-between; font-size:12.5px;">
                    <span style="color:#6b9e95;">Amount Paid</span>
                    <span style="color:#059669; font-weight:700;">${formatPrice(billingData.billingSummary.paidAmount)}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:13px; border-top:1px dashed #d0ede8; padding-top:8px; margin-top:2px;">
                    <span style="color:#6b9e95; font-weight:600;">Balance Due</span>
                    <span style="color:${billingData.billingSummary.dueAmount <= 0 ? "#059669" : "#dc2626"}; font-weight:800; font-size:15px;">
                      ${formatPrice(billingData.billingSummary.dueAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          `)}

          <!-- Footer -->
          ${section(`
            <div style="height:1px; background:linear-gradient(90deg,#5eead4,#d0ede8,transparent); margin-bottom:24px;"></div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px;">
              <div>
                <div style="font-size:10.5px; color:#9bb8b2; margin-bottom:5px;">Need help with your booking?</div>
                <div style="font-size:11.5px; color:#0f7a6e; font-weight:700; margin-bottom:2px;">${COMPANY_INFO_EMAIL}</div>
                <div style="font-size:11.5px; color:#0f7a6e; font-weight:700; margin-bottom:6px;">${COMPANY_CONTACT_NUMBER}</div>
                <div style="font-size:10px; color:#b0cbc6;">${COMPANY_ADDRESS}</div>
                <div style="font-size:10px; color:#b0cbc6;">${COMPANY_LOCATION}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:20px; font-weight:800; color:#0a2a3a; letter-spacing:-0.5px;">${COMPANY_NAME}</div>
                <div style="font-size:8.5px; color:#5eead4; letter-spacing:2.5px; text-transform:uppercase; margin-top:2px;">${COMPANY_THEME}</div>
                <div style="margin-top:20px; padding-top:10px; border-top:1.5px solid #d0ede8;">
                  <div style="font-size:10px; color:#9bb8b2; font-style:italic; margin-bottom:3px;">Authorised Signature</div>
                  <div style="font-size:12px; font-weight:700; color:#0a2a3a;">${COMPANY_OWNER}</div>
                  <div style="font-size:10px; color:#6b9e95;">Director, ${COMPANY_NAME}</div>
                </div>
              </div>
            </div>
            <div style="
              background:linear-gradient(90deg,#0a2a3a,#0f7a6e);
              border-radius:8px; padding:10px 20px;
              display:flex; justify-content:space-between; align-items:center;
            ">
              <div style="color:rgba(255,255,255,0.5); font-size:9.5px;">
                This is a computer-generated invoice and does not require a physical signature.
              </div>
              <div style="color:#5eead4; font-size:9.5px; font-weight:700; letter-spacing:1px;">${COMPANY_NAME} © ${new Date().getFullYear()}</div>
            </div>
          `)}

        </div>
      `;

      document.body.appendChild(container);

      const opt = {
        margin: 0,
        filename: `Felicita_Invoice_${billingData.bookingReference}.pdf`,
        image: {
          type: "jpeg" as const, // 👈 This narrows the type
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: 794,
        },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] as const },
      };

      await html2pdf().set(opt).from(container).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      setIsGenerating(false);
    }
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "primary":
        return { bg: theme.primary, text: "#fff" };
      case "success":
        return { bg: theme.success, text: "#fff" };
      case "error":
        return { bg: theme.error, text: "#fff" };
      case "warning":
        return { bg: theme.warning, text: "#fff" };
      case "info":
        return { bg: theme.accent || theme.primary, text: "#fff" };
      default:
        return { bg: theme.textSecondary, text: "#fff" };
    }
  };

  const vs = getVariantStyles(buttonVariant);

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
        transition-all duration-300 cursor-pointer
        hover:scale-105 active:scale-95
        disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
        ${className}
      `}
      style={{ backgroundColor: vs.bg, color: vs.text }}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          {buttonText}
        </>
      )}
    </button>
  );
};

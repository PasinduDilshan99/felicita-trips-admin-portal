// app/billing/view/[bookingId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { BookingService } from "@/services/bookingService";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import { Download, Search, X } from "lucide-react";
import { BookingBillingDetails } from "@/types/billing-types";
import { BookingIdAndReference } from "@/types/booking-types";
import { BILLING_VIEW_PAGE_URL } from "@/utils/urls";
import { BILLING_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { BillingService } from "@/services/billService";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { BillingPDFDownload } from "@/components/billing-components/view-billing-details/BillingPDFDownload";
import { BillingCustomerInfo } from "@/components/billing-components/view-billing-details/BillingCustomerInfo";
import { BillingTourInfo } from "@/components/billing-components/view-billing-details/BillingTourInfo";
import { BillingParticipants } from "@/components/billing-components/view-billing-details/BillingParticipants";
import { BillingSummary } from "@/components/billing-components/view-billing-details/BillingSummary";
import { BillingPriceBreakdown } from "@/components/billing-components/view-billing-details/BillingPriceBreakdown";
import { hexToRgba } from "@/utils/functions";

const ViewBillingDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const bookingIdFromParams = parseInt(params?.bookingId as string);

  const [bookingId, setBookingId] = useState<number | null>(
    isNaN(bookingIdFromParams) ? null : bookingIdFromParams,
  );
  const [billingData, setBillingData] = useState<BookingBillingDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingOptions, setBookingOptions] = useState<BookingIdAndReference[]>(
    [],
  );
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [showSearch, setShowSearch] = useState(!bookingId);
  const [selectedOption, setSelectedOption] =
    useState<BookingIdAndReference | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const breadcrumbItems = [
    ...BILLING_VIEW_BREADCRUMB_DATA,
    {
      label: billingData?.bookingReference || "Details",
      href: `${BILLING_VIEW_PAGE_URL}/${bookingId}`,
    },
  ];

  useEffect(() => {
    if (bookingId) {
      fetchBillingDetails(bookingId);
    } else {
      fetchBookingOptions();
    }
  }, [bookingId]);

  const fetchBookingOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await BookingService.getBookingIdAndReferences();
      setBookingOptions(response.data || []);
    } catch (err: any) {
      console.error("Error fetching booking options:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchBillingDetails = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BillingService.getBookingBillingDetails(id);
      setBillingData(response.data);
      setShowSearch(false);
    } catch (err: any) {
      setError(
        err.message || "Failed to load billing details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedOption) {
      setBookingId(selectedOption.bookingId);
      router.push(`${BILLING_VIEW_PAGE_URL}/${selectedOption.bookingId}`);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedOption(null);
    setShowDropdown(false);
  };

  const handleBack = () => router.push(BILLING_VIEW_PAGE_URL);

  const handleRetry = () => {
    if (bookingId) {
      fetchBillingDetails(bookingId);
    }
  };

  const filteredOptions = bookingOptions.filter(
    (option) =>
      option.bookingReference
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      option.bookingId.toString().includes(searchTerm),
  );

  if (loading)
    return (
      <CommonLoading
        message="Loading billing details..."
        subMessage="Fetching booking information"
        size="lg"
      />
    );

  if (error || !billingData) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Billing Details"
        message="The billing details couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={handleRetry}
        backButtonText="Back to Billing"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={`Billing Details`}
            description={`Booking: ${billingData.bookingReference}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text }}>
              Invoice #{billingData.bookingReference}
            </h2>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Booking Date:{" "}
              {new Date(billingData.bookingDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <BillingPDFDownload
              billingData={billingData}
              buttonText="Download PDF"
              buttonVariant="primary"
            />
            <ActionButtons
              title=""
              showEdit={false}
              showDelete={false}
              showShare={false}
              buttons={[
                {
                  id: "print",
                  label: "Print",
                  icon: Download,
                  variant: "default",
                  onClick: () => window.print(),
                },
              ]}
            />
          </div>
        </div>

        {/* Search Section - Shown when no booking ID is provided */}
        {!bookingId && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: theme.text }}
            >
              Search for a Booking
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                  <input
                    type="text"
                    placeholder="Search by Booking ID or Reference..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                      setSelectedOption(null);
                    }}
                    onFocus={(e) => {
                      setShowDropdown(true);
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(theme.primary, 0.14)}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      border: `1.5px solid ${theme.border}`,
                      color: theme.text,
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-opacity-20 transition-colors"
                      style={{ color: theme.textSecondary }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && searchTerm && (
                  <div
                    className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: theme.surface,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {loadingOptions ? (
                      <div
                        className="p-4 text-center text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Loading...
                      </div>
                    ) : filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <button
                          key={option.bookingId}
                          onClick={() => {
                            setSelectedOption(option);
                            setSearchTerm(option.bookingReference);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-opacity-10"
                          style={{
                            color: theme.text,
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hexToRgba(
                              theme.primary,
                              0.08,
                            );
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <span className="font-medium">
                            {option.bookingReference}
                          </span>
                          <span
                            className="text-xs ml-2"
                            style={{ color: theme.textSecondary }}
                          >
                            (ID: {option.bookingId})
                          </span>
                        </button>
                      ))
                    ) : (
                      <div
                        className="p-4 text-center text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        No bookings found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.primary,
                  color: "#fff",
                }}
              >
                View Billing
              </button>
            </div>
          </div>
        )}

        {/* Billing Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Customer & Tour Info */}
          <div className="lg:col-span-2 space-y-5">
            <BillingCustomerInfo customer={billingData.customer} />
            <BillingTourInfo
              tour={billingData.tour}
              packageDetails={billingData.packageDetails}
            />
            <BillingParticipants participants={billingData.participants} />
          </div>

          {/* Right Column - Summary & Breakdown */}
          <div className="space-y-5">
            <BillingSummary summary={billingData.billingSummary} />
            <BillingPriceBreakdown items={billingData.priceBreakdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBillingDetailsPage;

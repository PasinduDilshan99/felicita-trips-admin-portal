"use client";

import React from "react";

export const CustomBarTooltip = ({
  active,
  payload,
  label,
  unit = "items",
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value} {unit}
      </p>
    </div>
  );
};

export const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{payload[0].name}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dp-tooltip">
      <p className="dp-tooltip__label">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p
          key={index}
          className="dp-tooltip__value"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value} privileges
        </p>
      ))}
    </div>
  );
};

// Tour Category-specific tooltips
export const TourCategoryPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{payload[0].name}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} tours
      </p>
    </div>
  );
};

export const TourCategoryBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} bookings
      </p>
    </div>
  );
};

export const TourCategoryComboTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="stats-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

export const TourCategoryStackedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const primaryValue = payload[0]?.value || 0;
  const secondaryValue = payload[1]?.value || 0;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">Primary Usage: {primaryValue}</p>
      <p className="stats-tooltip__value">Secondary Usage: {secondaryValue}</p>
      <p className="stats-tooltip__total">
        Total: {primaryValue + secondaryValue}
      </p>
    </div>
  );
};

export const TourCategoryBubbleTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{data.categoryName}</p>
      <p className="stats-tooltip__value">
        Participants: {data.totalParticipants.toLocaleString()}
      </p>
      <p className="stats-tooltip__sub">Tours: {data.totalTours}</p>
      <p className="stats-tooltip__sub">
        Rating: {data.averageRating.toFixed(1)} / 5.0
      </p>
    </div>
  );
};

// Tour Type tooltips
export const TourTypePieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{payload[0].name}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} tours
      </p>
    </div>
  );
};

export const TourTypeBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} bookings
      </p>
    </div>
  );
};

export const TourTypeComboTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="stats-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

export const TourTypeStackedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const primaryValue = payload[0]?.value || 0;
  const secondaryValue = payload[1]?.value || 0;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">Primary Usage: {primaryValue}</p>
      <p className="stats-tooltip__value">Secondary Usage: {secondaryValue}</p>
      <p className="stats-tooltip__total">
        Total: {primaryValue + secondaryValue}
      </p>
    </div>
  );
};

export const TourTypeBubbleTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{data.typeName}</p>
      <p className="stats-tooltip__value">
        Participants: {data.totalParticipants.toLocaleString()}
      </p>
      <p className="stats-tooltip__sub">Tours: {data.totalTours}</p>
      <p className="stats-tooltip__sub">
        Rating: {data.averageRating.toFixed(1)} / 5.0
      </p>
    </div>
  );
};

// Package Type tooltips
export const PackageTypeRevenueTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Revenue: ${payload[0].value?.toLocaleString()}
      </p>
      {data?.averagePackagePrice && (
        <p className="stats-tooltip__sub">
          Avg Price: ${data.averagePackagePrice.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export const PackageTypeBookingTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value?.toLocaleString() || 0} participants
      </p>
    </div>
  );
};

export const PackageTypeRatingTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="stats-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

export const PackageTypeLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value?.toLocaleString()} participants
      </p>
      {data?.typeName && (
        <p className="stats-tooltip__sub">Type: {data.typeName}</p>
      )}
    </div>
  );
};

export const PackageTypeStackedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const primaryValue = payload[0]?.value || 0;
  const secondaryValue = payload[1]?.value || 0;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">Primary: {primaryValue}</p>
      <p className="stats-tooltip__value">Secondary: {secondaryValue}</p>
      <p className="stats-tooltip__total">
        Total: {primaryValue + secondaryValue}
      </p>
    </div>
  );
};

// Activity Category tooltips
export const ActivityCategoryBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">{payload[0].value} activities</p>
    </div>
  );
};

export const ActivityCategoryRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{data.categoryName}</p>
      <p className="stats-tooltip__value">
        Rating: {data.averageRating.toFixed(1)} / 5.0
      </p>
      <p className="stats-tooltip__sub">
        Reviews: {data.totalReviews.toLocaleString()}
      </p>
    </div>
  );
};

export const ActivityCategoryStackedTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  const primaryValue = payload[0]?.value || 0;
  const secondaryValue = payload[1]?.value || 0;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">Primary: {primaryValue}</p>
      <p className="stats-tooltip__value">Secondary: {secondaryValue}</p>
      <p className="stats-tooltip__total">
        Total: {primaryValue + secondaryValue}
      </p>
    </div>
  );
};

export const ActivityCategoryParticipationTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  if (value === undefined) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {value.toLocaleString()} participants
      </p>
    </div>
  );
};

// Destination Category tooltips
export const DestCategoryBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">{payload[0].value} destinations</p>
      {data.color && (
        <div
          className="stats-tooltip__color"
          style={{
            background: data.color,
            width: 20,
            height: 4,
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      )}
    </div>
  );
};

export const DestCategoryLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">{payload[0].value} images</p>
      {data.color && (
        <div
          className="stats-tooltip__color"
          style={{
            background: data.color,
            width: 20,
            height: 4,
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      )}
    </div>
  );
};

// Tour Schedule-specific tooltips
export const TourScheduleLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} schedules
      </p>
    </div>
  );
};

export const TourScheduleDurationTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">Duration Range</p>
      <p className="stats-tooltip__value">
        {data.durationStart} - {data.durationEnd} hours
      </p>
      <p className="stats-tooltip__sub">
        Schedules: {data.totalSchedules.toLocaleString()}
      </p>
    </div>
  );
};

export const TourScheduleExecutionTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} completed instances
      </p>
    </div>
  );
};

export const TourScheduleRatingTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="stats-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

export const TourScheduleParticipationTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  const barValue = payload[0]?.value || 0;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Participants: {barValue.toLocaleString()}
      </p>
    </div>
  );
};

// Package-specific tooltips
export const PackageBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} participants
      </p>
      {data?.totalSchedules && (
        <p className="stats-tooltip__sub">Schedules: {data.totalSchedules}</p>
      )}
    </div>
  );
};

export const PackageComboTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="stats-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

export const PackagePriceTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Total Price: ${data.totalPrice?.toLocaleString()}
      </p>
      <p className="stats-tooltip__sub">
        Price/Person: ${data.pricePerPerson?.toLocaleString()}
      </p>
      <p className="stats-tooltip__sub">
        Participants: {data.totalParticipants?.toLocaleString()}
      </p>
    </div>
  );
};

// Tour-specific tooltips
export const TourBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} bookings
      </p>
    </div>
  );
};

export const TourCategoryTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} tours
      </p>
    </div>
  );
};

// Activity Schedule-specific tooltips
export const ActivityScheduleLineTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} participants
      </p>
    </div>
  );
};

export const ActivityScheduleBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} participants
      </p>
    </div>
  );
};

export const ActivityScheduleRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{data.activityName}</p>
      <p className="stats-tooltip__value">
        Rating: {data.averageRating.toFixed(1)} / 5.0
      </p>
      <p className="stats-tooltip__sub">
        Reviews: {data.totalReviews.toLocaleString()}
      </p>
    </div>
  );
};

// Package Schedule-specific tooltips
export const PackageScheduleLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} schedules
      </p>
    </div>
  );
};

export const PackageSchedulePieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const statusName = payload[0].name === "1" ? "Active" : "Inactive";
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{statusName}</p>
      <p className="stats-tooltip__value">
        {payload[0].value.toLocaleString()} schedules
      </p>
    </div>
  );
};

export const PackageScheduleDurationTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{data.scheduleName}</p>
      <p className="stats-tooltip__value">
        Duration: {data.durationStart} - {data.durationEnd} days
      </p>
      <p className="stats-tooltip__sub">
        Average: {data.averageDuration.toFixed(1)} days
      </p>
    </div>
  );
};

export const PackageScheduleParticipationTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Total: {payload[0].value?.toLocaleString()} participants
      </p>
      {data?.averageParticipants && (
        <p className="stats-tooltip__sub">
          Average: {data.averageParticipants.toLocaleString()} per schedule
        </p>
      )}
    </div>
  );
};

export const PackageScheduleRatingTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="stats-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

export const SeasonBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="sn-tooltip">
      <p className="sn-tooltip__label">{label}</p>
      <p className="sn-tooltip__value">
        {payload[0].value.toLocaleString()} activities
      </p>
      {data?.totalTours && (
        <p className="sn-tooltip__sub">
          Tours: {data.totalTours.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export const SeasonTourTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="sn-tooltip">
      <p className="sn-tooltip__label">{label}</p>
      <p className="sn-tooltip__value">
        {payload[0].value.toLocaleString()} tours
      </p>
    </div>
  );
};

export const SeasonPopularityTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="sn-tooltip">
      <p className="sn-tooltip__label">{label}</p>
      <p className="sn-tooltip__value">
        Total Usage: {data.totalUsage.toLocaleString()}
      </p>
      <p className="sn-tooltip__sub">
        Activities: {data.totalActivities.toLocaleString()}
      </p>
      <p className="sn-tooltip__sub">
        Tours: {data.totalTours.toLocaleString()}
      </p>
    </div>
  );
};

export const SeasonWeatherTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="sn-tooltip sn-tooltip--weather">
      <p className="sn-tooltip__label">{label}</p>
      <p className="sn-tooltip__value">
        Temperature: {data.temperatureMin}° - {data.temperatureMax}°
      </p>
      <p className="sn-tooltip__sub">Rainfall: {data.rainfallPattern}</p>
      <p className="sn-tooltip__sub">{data.weatherSummary}</p>
    </div>
  );
};

export const PeakSeasonTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="sn-tooltip">
      <p className="sn-tooltip__label">{data.seasonName}</p>
      <p className="sn-tooltip__value">
        Activities: {data.activityCount.toLocaleString()}
      </p>
      <p className="sn-tooltip__sub">
        Tours: {data.tourCount.toLocaleString()}
      </p>
      <p className="sn-tooltip__sub">
        {data.isPeak ? "🔥 Peak Season" : "Off-Peak Season"}
      </p>
    </div>
  );
};

export const CustomSalaryTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dp-tooltip">
      <p className="dp-tooltip__label">{label}</p>
      <p className="dp-tooltip__value">
        Avg Salary: ${payload[0]?.value?.toLocaleString()}
      </p>
    </div>
  );
};

export const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dp-tooltip">
      <p className="dp-tooltip__label">{label}</p>
      <p className="dp-tooltip__value">{payload[0].value} employees hired</p>
    </div>
  );
};

import { hexToRgba } from "@/utils/functions";

export const getStatisticsStyles = (
  prefix: string,
  p: string,
  acc: string,
  surf: string,
  bg: string,
  border: string,
  textPrimary: string,
  textSecondary: string,
  errColor: string,
  successColor: string,
  isDarkMode: boolean,
) => `
  /* ── Base tokens ── */
  .${prefix}-root {
    --p:    ${p};
    --acc:  ${acc};
    --surf: ${surf};
    --bg:   ${bg};
    --border: ${border};
    --text: ${textPrimary};
    --muted: ${textSecondary};
    --err:  ${errColor};
    --ok:   ${successColor};

    --blue-bg: #dbeafe;  --blue-fg: #1d4ed8;  --blue-mid: #3b82f6;  --blue-border: #93c5fd;
    --em-bg:   #d1fae5;  --em-fg:   #065f46;  --em-mid:   #10b981;  --em-border:   #6ee7b7;
    --am-bg:   #fef3c7;  --am-fg:   #92400e;  --am-mid:   #f59e0b;  --am-border:   #fcd34d;
    --ro-bg:   #ffe4e6;  --ro-fg:   #9f1239;  --ro-mid:   #f43f5e;  --ro-border:   #fda4af;
    --vi-bg:   #ede9fe;  --vi-fg:   #5b21b6;  --vi-mid:   #8b5cf6;  --vi-border:   #c4b5fd;
    --tl-bg:   #ccfbf1;  --tl-fg:   #134e4a;  --tl-mid:   #14b8a6;  --tl-border:   #5eead4;

    background: var(--bg);
    min-height: 100vh;
    padding-bottom: 5rem;
    transition: background 0.3s ease;
  }

  /* ── Keyframes ── */
  @keyframes ${prefix}-shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  @keyframes ${prefix}-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes ${prefix}-pulse-ring {
    0%   { box-shadow: 0 0 0 0   ${hexToRgba(p, 0.4)}; }
    70%  { box-shadow: 0 0 0 10px ${hexToRgba(p, 0)}; }
    100% { box-shadow: 0 0 0 0   ${hexToRgba(p, 0)}; }
  }
  @keyframes ${prefix}-live-blink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.25; }
  }

  /* ── Loading ── */
  .${prefix}-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 55vh;
    gap: 1.5rem;
  }
  .${prefix}-spinner-wrap {
    position: relative;
    width: 56px;
    height: 56px;
  }
  .${prefix}-spinner {
    width: 56px; height: 56px;
    border: 3px solid var(--border);
    border-top-color: var(--p);
    border-radius: 50%;
    animation: ${prefix}-spin .7s linear infinite;
  }
  .${prefix}-spinner-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .${prefix}-spinner-center::after {
    content: '';
    width: 9px; height: 9px;
    background: var(--p);
    border-radius: 50%;
    animation: ${prefix}-pulse-ring 1.5s ease-out infinite;
  }
  .${prefix}-loading-text {
    font-size: .875rem;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: .025em;
  }
  .${prefix}-loading-sub {
    font-size: .75rem;
    color: var(--muted);
    opacity: .6;
    margin-top: -.75rem;
  }

  /* ── Section header ── */
  .${prefix}-section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.125rem;
  }
  .${prefix}-section-header__left {
    display: flex;
    align-items: flex-start;
    gap: .875rem;
  }
  .${prefix}-section-header__bar {
    width: 4px;
    min-height: 40px;
    border-radius: 2px;
    background: linear-gradient(180deg, var(--p) 0%, var(--acc) 100%);
    flex-shrink: 0;
    align-self: stretch;
  }
  .${prefix}-section-header__title-row {
    display: flex;
    align-items: center;
    gap: .625rem;
    flex-wrap: wrap;
  }
  .${prefix}-section-header__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    letter-spacing: -.018em;
  }
  .${prefix}-section-header__subtitle {
    font-size: .8125rem;
    color: var(--muted);
    margin: .2rem 0 0;
    font-weight: 400;
    line-height: 1.5;
  }
  .${prefix}-section-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .675rem;
    font-weight: 700;
    letter-spacing: .065em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 999px;
    background: ${hexToRgba(p, 0.09)};
    color: var(--p);
    border: 1px solid ${hexToRgba(p, 0.18)};
  }
  .${prefix}-section-badge--live {
    background: ${hexToRgba(successColor, 0.09)};
    color: ${successColor};
    border-color: ${hexToRgba(successColor, 0.25)};
  }
  .${prefix}-live-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${successColor};
    animation: ${prefix}-live-blink 1.4s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* ── Action cards grid ── */
  .${prefix}-actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.125rem;
  }
  @media (max-width: 1100px) { .${prefix}-actions-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px)  { .${prefix}-actions-grid { grid-template-columns: 1fr; } }

  /* ── Stat cards ── */
  .${prefix}-stats-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
  }
  @media (max-width: 1200px) { .${prefix}-stats-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  { .${prefix}-stats-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 460px)  { .${prefix}-stats-grid { grid-template-columns: 1fr; } }

  .${prefix}-stat-card {
    background: var(--surf);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: .625rem;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition:
      transform .24s cubic-bezier(0.22,1,0.36,1),
      box-shadow .24s ease,
      border-color .22s ease;
    box-shadow: 0 1px 3px rgba(15,23,42,.04);
  }
  .${prefix}-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(15,23,42,.1), 0 2px 6px rgba(15,23,42,.04);
  }
  .${prefix}-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 14px 14px 0 0;
    opacity: 0;
    transition: opacity .24s ease;
  }
  .${prefix}-stat-card:hover::before { opacity: 1; }
  .${prefix}-stat-card--blue::before    { background: var(--blue-mid); }
  .${prefix}-stat-card--emerald::before { background: var(--em-mid); }
  .${prefix}-stat-card--rose::before    { background: var(--ro-mid); }
  .${prefix}-stat-card--violet::before  { background: var(--vi-mid); }
  .${prefix}-stat-card--amber::before   { background: var(--am-mid); }
  .${prefix}-stat-card--teal::before    { background: var(--tl-mid); }
  .${prefix}-stat-card--blue:hover    { border-color: var(--blue-border); }
  .${prefix}-stat-card--emerald:hover { border-color: var(--em-border); }
  .${prefix}-stat-card--rose:hover    { border-color: var(--ro-border); }
  .${prefix}-stat-card--violet:hover  { border-color: var(--vi-border); }
  .${prefix}-stat-card--amber:hover   { border-color: var(--am-border); }
  .${prefix}-stat-card--teal:hover    { border-color: var(--tl-border); }
  .${prefix}-stat-card::after {
    content: '';
    position: absolute;
    top: -20px; right: -20px;
    width: 80px; height: 80px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity .28s ease;
    pointer-events: none;
  }
  .${prefix}-stat-card:hover::after { opacity: 1; }
  .${prefix}-stat-card--blue::after    { background: radial-gradient(circle, ${hexToRgba("#3b82f6", 0.12)}, transparent 70%); }
  .${prefix}-stat-card--emerald::after { background: radial-gradient(circle, ${hexToRgba("#10b981", 0.12)}, transparent 70%); }
  .${prefix}-stat-card--rose::after    { background: radial-gradient(circle, ${hexToRgba("#f43f5e", 0.12)}, transparent 70%); }
  .${prefix}-stat-card--violet::after  { background: radial-gradient(circle, ${hexToRgba("#8b5cf6", 0.12)}, transparent 70%); }
  .${prefix}-stat-card--amber::after   { background: radial-gradient(circle, ${hexToRgba("#f59e0b", 0.12)}, transparent 70%); }
  .${prefix}-stat-card--teal::after    { background: radial-gradient(circle, ${hexToRgba("#14b8a6", 0.12)}, transparent 70%); }

  .${prefix}-stat-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform .22s cubic-bezier(0.22,1,0.36,1);
  }
  .${prefix}-stat-card:hover .${prefix}-stat-icon { transform: scale(1.1); }
  .${prefix}-stat-icon svg { width: 20px; height: 20px; }
  .${prefix}-stat-icon--blue    { background: var(--blue-bg); color: var(--blue-fg); }
  .${prefix}-stat-icon--emerald { background: var(--em-bg);   color: var(--em-fg); }
  .${prefix}-stat-icon--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
  .${prefix}-stat-icon--violet  { background: var(--vi-bg);   color: var(--vi-fg); }
  .${prefix}-stat-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
  .${prefix}-stat-icon--teal    { background: var(--tl-bg);   color: var(--tl-fg); }

  .${prefix}-stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text);
    line-height: 1;
    letter-spacing: -.04em;
    position: relative;
    z-index: 1;
  }
  .${prefix}-stat-label {
    font-size: .7rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .065em;
    position: relative;
    z-index: 1;
  }

  /* ── Skeleton ── */
  .${prefix}-skeleton-card { pointer-events: none !important; }
  .${prefix}-skel {
    border-radius: 6px;
    background: linear-gradient(
      90deg,
      var(--border) 25%,
      ${isDarkMode ? hexToRgba(surf, 0.6) : "#f8fafc"} 50%,
      var(--border) 75%
    );
    background-size: 700px 100%;
    animation: ${prefix}-shimmer 1.5s infinite;
  }
  .${prefix}-skel--icon   { width: 40px; height: 40px; border-radius: 10px; }
  .${prefix}-skel--val    { width: 55%; height: 28px; margin-top: .625rem; border-radius: 7px; }
  .${prefix}-skel--label  { width: 80%; height: 10px; border-radius: 5px; }

  /* ── Charts ── */
  .${prefix}-charts-row {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 1.25rem;
  }
  @media (max-width: 860px) { .${prefix}-charts-row { grid-template-columns: 1fr; } }

  .${prefix}-chart-card {
    background: var(--surf);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 1.625rem;
    box-shadow: 0 1px 3px rgba(15,23,42,.04);
    transition: box-shadow .22s ease;
  }
  .${prefix}-chart-card:hover { box-shadow: 0 6px 18px rgba(15,23,42,.07); }

  .${prefix}-chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.375rem;
  }
  .${prefix}-chart-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: .9375rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -.012em;
  }
  .${prefix}-chart-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .${prefix}-chart-dot--p  { background: var(--p); }
  .${prefix}-chart-dot--ok { background: var(--ok); }
  .${prefix}-chart-sub {
    font-size: .75rem;
    color: var(--muted);
    font-weight: 600;
    background: var(--bg);
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
  }

  .${prefix}-pie-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1.125rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
  .${prefix}-pie-legend-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: .8125rem;
    color: var(--muted);
    font-weight: 500;
  }
  .${prefix}-pie-legend-dot {
    width: 10px; height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .${prefix}-pie-legend-count {
    font-weight: 700;
    color: var(--text);
    margin-left: 2px;
  }

  /* ── Tooltip ── */
  .stats-tooltip {
    background: #0f172a;
    border-radius: 10px;
    padding: 9px 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,.28);
    border: 1px solid rgba(255,255,255,.07);
  }
  .stats-tooltip__label {
    font-size: .7rem;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .055em;
    margin-bottom: 4px;
  }
  .stats-tooltip__value {
    font-size: .9375rem;
    color: #f8fafc;
    font-weight: 700;
  }

  /* ── Error banner ── */
  .${prefix}-error-banner {
    background: ${hexToRgba(errColor, 0.05)};
    border: 1.5px solid ${hexToRgba(errColor, 0.22)};
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .${prefix}-error-banner__left {
    display: flex;
    align-items: center;
    gap: .75rem;
    color: var(--err);
    font-size: .875rem;
    font-weight: 600;
  }
  .${prefix}-error-banner__left svg { width: 20px; height: 20px; flex-shrink: 0; }
  .${prefix}-retry-btn {
    background: var(--err);
    color: #fff;
    border: none;
    border-radius: 9px;
    padding: .5rem 1.125rem;
    font-size: .8125rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    letter-spacing: .01em;
    transition: opacity .15s, transform .12s;
  }
  .${prefix}-retry-btn:hover   { opacity: .88; }
  .${prefix}-retry-btn:active  { transform: scale(.97); }

  /* ── Info banner ── */
  .${prefix}-info-banner {
    background: linear-gradient(135deg,
      ${hexToRgba(p, 0.04)} 0%,
      ${hexToRgba(acc, 0.06)} 100%);
    border: 1.5px solid ${hexToRgba(p, 0.14)};
    border-radius: 16px;
    padding: 1.375rem 1.625rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  .${prefix}-info-icon {
    width: 40px; height: 40px;
    background: ${hexToRgba(p, 0.09)};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p);
    flex-shrink: 0;
    transition: transform .22s ease;
  }
  .${prefix}-info-banner:hover .${prefix}-info-icon { transform: scale(1.08) rotate(-4deg); }
  .${prefix}-info-icon svg { width: 18px; height: 18px; }
  .${prefix}-info-title {
    font-size: .875rem;
    font-weight: 700;
    color: var(--p);
    margin-bottom: .25rem;
    letter-spacing: -.01em;
  }
  .${prefix}-info-text {
    font-size: .8125rem;
    color: var(--muted);
    line-height: 1.65;
    margin: 0;
  }

  /* ── Spacing utils ── */
  .${prefix}-mt-6 { margin-top: 1.5rem; }
  .${prefix}-mt-7 { margin-top: 1.875rem; }
  .${prefix}-mt-8 { margin-top: 2.5rem; }
`;

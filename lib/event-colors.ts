// ─────────────────────────────────────────────────────────
//  Event Type Color System
//  Centralized palette for calendar chips, modals, search
// ─────────────────────────────────────────────────────────

export interface EventColorConfig {
  label: string;
  value: string;
  color: string;       // Primary text/border color
  bg: string;          // Background at low opacity (for chips)
  border: string;      // Border color at medium opacity
  dot: string;         // Full-opacity dot for selects/badges
}

export const EVENT_TYPES: EventColorConfig[] = [
  {
    label: "Wedding",
    value: "Wedding",
    color: "#e05c6c",
    bg: "rgba(224, 92, 108, 0.10)",
    border: "rgba(224, 92, 108, 0.25)",
    dot: "#e05c6c",
  },
  {
    label: "Pre-Wedding",
    value: "Pre-Wedding",
    color: "#e891b2",
    bg: "rgba(232, 145, 178, 0.10)",
    border: "rgba(232, 145, 178, 0.25)",
    dot: "#e891b2",
  },
  {
    label: "Events",
    value: "Events",
    color: "#5b9cf5",
    bg: "rgba(91, 156, 245, 0.10)",
    border: "rgba(91, 156, 245, 0.25)",
    dot: "#5b9cf5",
  },
  {
    label: "Commercial",
    value: "Commercial",
    color: "#3ecfb4",
    bg: "rgba(62, 207, 180, 0.10)",
    border: "rgba(62, 207, 180, 0.25)",
    dot: "#3ecfb4",
  },
  {
    label: "Portrait",
    value: "Portrait",
    color: "#e8a838",
    bg: "rgba(232, 168, 56, 0.10)",
    border: "rgba(232, 168, 56, 0.25)",
    dot: "#e8a838",
  },
  {
    label: "Other",
    value: "Other",
    color: "#8b8fa3",
    bg: "rgba(139, 143, 163, 0.10)",
    border: "rgba(139, 143, 163, 0.25)",
    dot: "#8b8fa3",
  },
];

/**
 * Get the color config for a given event type.
 * Falls back to "Other" if the type is unknown.
 */
export function getEventColor(eventType?: string): EventColorConfig {
  if (!eventType) return EVENT_TYPES[EVENT_TYPES.length - 1]; // Other
  const found = EVENT_TYPES.find(
    (t) => t.value.toLowerCase() === eventType.toLowerCase()
  );
  return found ?? EVENT_TYPES[EVENT_TYPES.length - 1];
}

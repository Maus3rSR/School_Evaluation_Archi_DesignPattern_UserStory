export const DeliveryMethod = {
  DINE_IN: "DINE_IN",
  TAKEAWAY: "TAKEAWAY",
  DRONE: "DRONE",
  HOVERBIKE: "HOVERBIKE",
  SUPEERC0NDUCT0R: "SUPEERC0NDUCT0R",
} as const;

export type DeliveryMethod = keyof typeof DeliveryMethod;

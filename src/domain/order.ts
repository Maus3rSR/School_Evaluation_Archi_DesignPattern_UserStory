import { DeliveryMethod } from "./delivery.ts";

export const OrderStatus = {
  RECEIVED: "RECEIVED",
  IN_PREPARATION: "IN_PREPARATION",
  READY: "READY",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
} as const;

export type OrderStatus = keyof typeof OrderStatus;

export type OrderProps = {
  number: string;
  products: {
    id: string;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
};

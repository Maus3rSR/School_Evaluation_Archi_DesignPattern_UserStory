import { DeliveryMethod } from "./delivery.ts";

export const OrderState = {
  RECEIVED: "RECEIVED",
  IN_PREPARATION: "IN_PREPARATION",
  READY: "READY",
  SERVED: "SERVED",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
} as const;

export type OrderState = keyof typeof OrderState;

export type OrderProps = {
  number: string;
  products: {
    id: string;
    quantity: number;
  }[];
  total: number;
  state: OrderState;
  deliveryMethod: DeliveryMethod;
};

export class Order {
  private constructor(private props: OrderProps) {}

  toState(newState: OrderState) {
    if (
      (this.props.state === "RECEIVED" && newState === "IN_PREPARATION") ||
      (this.props.state === "IN_PREPARATION" && newState === "READY") ||
      (this.props.state === "READY" &&
        ["SERVED", "DELIVERING"].includes(newState)) ||
      (this.props.state === "DELIVERING" && newState === "DELIVERED")
    ) {
      this.props.state = newState;
    }
  }

  static make(props: Omit<OrderProps, "state">): Order {
    return new Order({
      ...props,
      state: "RECEIVED",
    });
  }

  toSnapshot(): OrderProps {
    return this.props;
  }

  static fromSnapshot(props: OrderProps): Order {
    return new this(props);
  }
}

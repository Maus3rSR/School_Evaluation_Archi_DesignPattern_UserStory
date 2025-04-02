import { DeliveryMethod } from "./delivery.ts";

export const OrderState = {
  RECEIVED: "RECEIVED",
  IN_PREPARATION: "IN_PREPARATION",
  READY: "READY",
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
    this.props.state = newState;
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

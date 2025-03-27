import { OrderProps } from "../domain/order.ts";

export interface OrderRepository {
  create(order: OrderProps): Promise<void>;
}

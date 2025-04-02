import { Order } from "../domain/order.ts";

export interface OrderRepository {
  create(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  retrieveFromOrderNumber(orderNumber: string): Promise<Order | undefined>;
}

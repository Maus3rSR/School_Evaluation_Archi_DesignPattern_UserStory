import { OrderProps, Order } from "../domain/order.ts";
import { OrderRepository } from "../out/order.repository.ts";

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, OrderProps> = new Map();
  async create(order: Order): Promise<void> {
    this.orders.set(order.toSnapshot().number, order.toSnapshot());
  }

  async update(order: Order): Promise<void> {
    this.orders.set(order.toSnapshot().number, order.toSnapshot());
  }

  async retrieveFromOrderNumber(
    orderNumber: string
  ): Promise<Order | undefined> {
    return Order.fromSnapshot(this.orders.get(orderNumber)!);
  }
}

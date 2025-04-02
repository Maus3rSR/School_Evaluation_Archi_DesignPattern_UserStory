import { OrderRepository } from "../../out/order.repository.ts";

export type OrderAmountToPayInput = {
  orderNumber: string;
};

export class OrderAmountToPay {
  constructor(private readonly orderRepository: OrderRepository) {}

  async get(input: OrderAmountToPayInput): Promise<string> {
    const order = await this.orderRepository.retrieveFromOrderNumber(
      input.orderNumber
    );

    return `${order?.toSnapshot().total ?? 0}€`;
  }
}

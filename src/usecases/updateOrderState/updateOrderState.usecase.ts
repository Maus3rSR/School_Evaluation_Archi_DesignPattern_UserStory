import { OrderState } from "../../domain/order.ts";
import { OrderRepository } from "../../out/order.repository.ts";

export type UpdateOrderStateInput = {
  orderNumber: string;
  to: OrderState;
};

export class UpdateOrderState {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: UpdateOrderStateInput): Promise<void> {
    const order = await this.orderRepository.retrieveFromOrderNumber(
      input.orderNumber
    );

    order?.toState(input.to);

    await this.orderRepository.update(order!);
  }
}

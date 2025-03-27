import { OrderRepository } from "../../out/order.repository.ts";

export type MakeOrderInput = {
  products: {
    id: string;
    quantity: number;
  }[];
};

export class MakeOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(input: MakeOrderInput) {
    this.orderRepository.create({
      number: "1",
      products: input.products,
      status: "RECEIVED",
    });
  }
}

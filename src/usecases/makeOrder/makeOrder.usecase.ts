import { OrderRepository } from "../../out/order.repository.ts";

export type MakeOrderInput = {
  products: {
    id: string;
    quantity: number;
  }[];
};

export class MakeOrder {
  constructor(
    private readonly idGenerator: IterableIterator<string, string>,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(input: MakeOrderInput): Promise<string> {
    const orderNumber = this.idGenerator.next().value;

    await this.orderRepository.create({
      number: orderNumber,
      products: input.products,
      status: "RECEIVED",
      total: 0,
    });

    return orderNumber;
  }
}

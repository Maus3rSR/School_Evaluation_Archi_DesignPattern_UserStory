import { OrderRepository } from "../../out/order.repository.ts";
import { ProductRepository } from "../../out/product.repository.ts";

export type MakeOrderInput = {
  products: {
    id: string;
    quantity: number;
  }[];
};

export class MakeOrder {
  constructor(
    private readonly idGenerator: IterableIterator<string, string>,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: MakeOrderInput): Promise<string> {
    const orderNumber = this.idGenerator.next().value;

    const prices = await this.productRepository.priceForProducts(
      input.products.map((product) => product.id)
    );

    await this.orderRepository.create({
      number: orderNumber,
      products: input.products,
      status: "RECEIVED",
      total: input.products.reduce(
        (total, product) =>
          total + product.quantity * (prices[product.id] ?? 0),
        0
      ),
    });

    return orderNumber;
  }
}

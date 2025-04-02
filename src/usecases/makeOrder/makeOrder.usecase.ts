import { DeliveryMethod } from "../../domain/delivery.ts";
import { DiscountRepository } from "../../out/discount.repository.ts";
import { OrderRepository } from "../../out/order.repository.ts";
import { ProductRepository } from "../../out/product.repository.ts";

export type MakeOrderInput = {
  products: {
    id: string;
    quantity: number;
  }[];
  discountCode?: string;
  deliveryMethod?: DeliveryMethod;
};

export class MakeOrder {
  constructor(
    private readonly idGenerator: IterableIterator<string, string>,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly discountRepository: DiscountRepository
  ) {}

  async execute(input: MakeOrderInput): Promise<string> {
    const orderNumber = this.idGenerator.next().value;
    const deliveryMethod = input.deliveryMethod ?? DeliveryMethod.DINE_IN;

    const prices = await this.productRepository.priceForProducts(
      input.products.map((product) => product.id)
    );

    let total = input.products.reduce(
      (total, product) => total + product.quantity * (prices[product.id] ?? 0),
      0
    );

    if (input.discountCode) {
      const discount = await this.discountRepository.fetchDiscountRule(
        input.discountCode
      );

      total -= (total * (discount?.value ?? 0)) / 100;
    }

    switch (deliveryMethod) {
      case DeliveryMethod.DRONE:
        total += 5;
        break;
      case DeliveryMethod.HOVERBIKE:
        total += 10;
        break;
      case DeliveryMethod.SUPEERC0NDUCT0R:
        total += 15;
        break;
    }

    await this.orderRepository.create({
      number: orderNumber,
      products: input.products,
      total,
      deliveryMethod,
      status: "RECEIVED",
    });

    return orderNumber;
  }
}

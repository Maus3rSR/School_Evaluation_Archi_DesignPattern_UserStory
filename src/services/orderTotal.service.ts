import { DeliveryMethod } from "../domain/delivery.ts";
import { DiscountRepository } from "../out/discount.repository.ts";
import { ProductRepository } from "../out/product.repository.ts";
import { MakeOrderInput } from "../usecases/makeOrder/makeOrder.usecase.ts";

export class OrderTotalService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly discountRepository: DiscountRepository
  ) {}

  async computePrice(input: MakeOrderInput): Promise<number> {
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

    switch (input.deliveryMethod) {
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

    return total;
  }
}

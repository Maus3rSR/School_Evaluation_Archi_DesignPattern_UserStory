import { DeliveryMethod } from "../../domain/delivery.ts";
import { OrderRepository } from "../../out/order.repository.ts";
import { OrderTotalService } from "../../services/orderTotal.service.ts";

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
    private readonly orderTotalService: OrderTotalService
  ) {}

  async execute(input: MakeOrderInput): Promise<string> {
    const orderNumber = this.idGenerator.next().value;
    input.deliveryMethod = input.deliveryMethod ?? DeliveryMethod.DINE_IN;
    const total = await this.orderTotalService.computePrice(input);

    await this.orderRepository.create({
      number: orderNumber,
      products: input.products,
      total,
      deliveryMethod: input.deliveryMethod,
      status: "RECEIVED",
    });

    return orderNumber;
  }
}

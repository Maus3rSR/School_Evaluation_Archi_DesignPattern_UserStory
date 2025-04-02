import { assertEquals } from "@std/assert/equals";

import { DeliveryMethod } from "../../domain/delivery.ts";
import { DiscountRule } from "../../domain/discount.ts";
import { OrderProps, OrderState } from "../../domain/order.ts";
import { ProductPriceTable } from "../../out/product.repository.ts";
import { OrderTotalService } from "../../services/orderTotal.service.ts";
import { MakeOrder, MakeOrderInput } from "../makeOrder/makeOrder.usecase.ts";
import {
  DeterministicIdentityGenerator,
  StubOrderRepository,
  StubProductRepository,
  StubDiscountRepository,
} from "./stubs.ts";
import {
  UpdateOrderState,
  UpdateOrderStateInput,
} from "../updateOrderState/updateOrderState.usecase.ts";

export class OrderFixture {
  readonly idGenerator: DeterministicIdentityGenerator =
    new DeterministicIdentityGenerator();
  private readonly orderRepository: StubOrderRepository =
    new StubOrderRepository();
  private readonly productRepository: StubProductRepository =
    new StubProductRepository();
  private readonly discountRepository: StubDiscountRepository =
    new StubDiscountRepository();

  private readonly makeOrderUseCase!: MakeOrder;
  private readonly updateOrderStateUseCase!: UpdateOrderState;

  private result!: string;

  constructor() {
    this.makeOrderUseCase = new MakeOrder(
      this.idGenerator.generator(),
      this.orderRepository,
      new OrderTotalService(this.productRepository, this.discountRepository)
    );

    this.updateOrderStateUseCase = new UpdateOrderState(this.orderRepository);
  }

  givenProductPrices(productPrices: ProductPriceTable): this {
    this.productRepository.prices = productPrices;
    return this;
  }

  givenSomeDiscountRule(discountRule: DiscountRule): this {
    this.discountRepository.rules.push(discountRule);
    return this;
  }

  givenAnOrderWithState(orderNumber: string, state: OrderState): this {
    this.orderRepository.orders.set(orderNumber, {
      number: orderNumber,
      state: state,
      products: [],
      total: 0,
      deliveryMethod: DeliveryMethod.DINE_IN,
    });
    return this;
  }

  async whenIMakeTheOrder(order: MakeOrderInput): Promise<this> {
    this.result = await this.makeOrderUseCase.execute(order);
    return this;
  }

  async whenIUpdateTheOrderState(input: UpdateOrderStateInput): Promise<this> {
    await this.updateOrderStateUseCase.execute(input);
    return this;
  }

  thenDeliveryMethodShouldBe(expectedMethod: DeliveryMethod): this {
    const createdOrder = this.orderRepository.orders.values().next().value!;
    assertEquals(createdOrder.deliveryMethod, expectedMethod);
    return this;
  }

  thenTheOrderShouldBeCreated(expectedOrder: OrderProps): this {
    const createdOrder = this.orderRepository.orders.get(expectedOrder.number)!;
    assertEquals(createdOrder, expectedOrder);
    return this;
  }

  thenOrderTotalShouldBe(expectedTotal: number): this {
    const createdOrder = this.orderRepository.orders.values().next().value!;
    assertEquals(createdOrder.total, expectedTotal);
    return this;
  }

  thenOrderNumberRetrievedShouldBe(expectedReturn: string): this {
    assertEquals(this.result, expectedReturn);
    return this;
  }

  thenTheOrderStateShouldBe(expectedState: OrderState): this {
    const createdOrder = this.orderRepository.orders.values().next().value!;
    assertEquals(createdOrder.state, expectedState);
    return this;
  }
}

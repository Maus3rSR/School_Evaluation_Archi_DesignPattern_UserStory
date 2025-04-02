import { describe, it, beforeEach, test } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";

import { MakeOrder, MakeOrderInput } from "./makeOrder.usecase.ts";
import { OrderProps, OrderStatus } from "../../domain/order.ts";
import {
  DeterministicIdentityGenerator,
  StubDiscountRepository,
  StubOrderRepository,
  StubProductRepository,
} from "../fixtures/stubs.ts";
import { ProductPriceTable } from "../../out/product.repository.ts";
import { DiscountRule } from "../../domain/discount.ts";
import { DeliveryMethod } from "../../domain/delivery.ts";
import { OrderTotalService } from "../../services/orderTotal.service.ts";

let fixture: OrderFixture;

beforeEach(() => {
  fixture = new OrderFixture();
});

describe("Make order usecase", () => {
  beforeEach(() => {
    fixture.idGenerator.nextIdIs("1");
  });

  it("Should make a new order", async () => {
    await fixture.whenIMakeTheOrder({
      products: [
        { id: "quantum-beef-burger", quantity: 1 },
        { id: "crypto-salmon-roll", quantity: 2 },
      ],
    });

    fixture.thenTheOrderShouldBeCreated({
      number: "1",
      products: [
        { id: "quantum-beef-burger", quantity: 1 },
        { id: "crypto-salmon-roll", quantity: 2 },
      ],
      total: 0,
      status: OrderStatus.RECEIVED,
      deliveryMethod: DeliveryMethod.DINE_IN,
    });

    fixture.thenOrderNumberRetrievedShouldBe("1");
  });

  describe("Standard order total computation", () => {
    beforeEach(() => {
      fixture.givenProductPrices({
        "quantum-beef-burger": 10,
        "crypto-salmon-roll": 5,
      });
    });

    describe("Compute the total price of order based on quantity", () => {
      test("Order: 1x10", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
        });

        fixture.thenOrderTotalShouldBe(10);
      });

      test("Order: 1x10 and 2x5", async () => {
        await fixture.whenIMakeTheOrder({
          products: [
            { id: "quantum-beef-burger", quantity: 1 },
            { id: "crypto-salmon-roll", quantity: 2 },
          ],
        });

        fixture.thenOrderTotalShouldBe(20);
      });
    });

    describe("Order total computation with discount", () => {
      it("Order: 1x10 and 2x5 with discount 20%", async () => {
        fixture.givenProductPrices({
          "quantum-beef-burger": 10,
          "crypto-salmon-roll": 5,
        });

        fixture.givenSomeDiscountRule({
          code: "CYBERPUNK20",
          value: 20,
          type: "PERCENT",
        });

        await fixture.whenIMakeTheOrder({
          products: [
            { id: "quantum-beef-burger", quantity: 1 },
            { id: "crypto-salmon-roll", quantity: 2 },
          ],
          discountCode: "CYBERPUNK20",
        });

        fixture.thenOrderTotalShouldBe(16);
      });
    });

    describe("Order total computation with delivery fees", () => {
      beforeEach(() => {
        fixture.givenProductPrices({
          "quantum-beef-burger": 10,
        });
      });

      it("Order: 1x10, Drone add 5 to total", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
          deliveryMethod: DeliveryMethod.DRONE,
        });

        fixture.thenOrderTotalShouldBe(15);
      });

      it("Order: 1x10, Hoverbike add 10 to total", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
          deliveryMethod: DeliveryMethod.HOVERBIKE,
        });

        fixture.thenOrderTotalShouldBe(20);
      });

      it("Order: 1x10, SUPEERC0NDUCT0R add 15 to total", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
          deliveryMethod: DeliveryMethod.SUPEERC0NDUCT0R,
        });

        fixture.thenOrderTotalShouldBe(25);
      });
    });
  });
});

class OrderFixture {
  readonly idGenerator: DeterministicIdentityGenerator =
    new DeterministicIdentityGenerator();
  private readonly orderRepository: StubOrderRepository =
    new StubOrderRepository();
  private readonly productRepository: StubProductRepository =
    new StubProductRepository();
  private readonly discountRepository: StubDiscountRepository =
    new StubDiscountRepository();

  private readonly makeOrderUseCase!: MakeOrder;

  private result!: string;

  constructor() {
    this.makeOrderUseCase = new MakeOrder(
      this.idGenerator.generator(),
      this.orderRepository,
      new OrderTotalService(this.productRepository, this.discountRepository)
    );
  }

  givenProductPrices(productPrices: ProductPriceTable): this {
    this.productRepository.prices = productPrices;
    return this;
  }

  givenSomeDiscountRule(discountRule: DiscountRule): this {
    this.discountRepository.rules.push(discountRule);
    return this;
  }

  async whenIMakeTheOrder(order: MakeOrderInput): Promise<this> {
    this.result = await this.makeOrderUseCase.execute(order);
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
}

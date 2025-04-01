import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";

import { MakeOrder, MakeOrderInput } from "./makeOrder.usecase.ts";
import { OrderProps, OrderStatus } from "../../domain/order.ts";
import {
  DeterministicIdentityGenerator,
  StubOrderRepository,
} from "../fixtures/stubs.ts";

let fixture: OrderFixture;

beforeEach(() => {
  fixture = new OrderFixture();
  fixture.idGenerator.nextIdIs("1");
});

describe("Make order usecase", () => {
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
      status: OrderStatus.RECEIVED,
      total: 0,
    });

    fixture.thenOrderNumberRetrievedShouldBe("1");
  });

  describe("Order total price", () => {
    it("Should compute the total price of order based on quantity", async () => {
      await fixture.whenIMakeTheOrder({
        products: [
          { id: "quantum-beef-burger", quantity: 1 },
          { id: "crypto-salmon-roll", quantity: 2 },
        ],
      });

      fixture.thenOrderTotalShouldBe(20);
    });
  });
});

class OrderFixture {
  readonly idGenerator!: DeterministicIdentityGenerator;
  private readonly orderRepository!: StubOrderRepository;
  private readonly makeOrderUseCase!: MakeOrder;
  private result!: string;

  constructor() {
    this.idGenerator = new DeterministicIdentityGenerator();
    this.orderRepository = new StubOrderRepository();
    this.makeOrderUseCase = new MakeOrder(
      this.idGenerator.generator(),
      this.orderRepository
    );
  }

  async whenIMakeTheOrder(order: MakeOrderInput): Promise<this> {
    this.result = await this.makeOrderUseCase.execute(order);
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

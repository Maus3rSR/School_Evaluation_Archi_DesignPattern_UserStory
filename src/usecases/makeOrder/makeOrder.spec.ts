import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { MakeOrder, MakeOrderInput } from "./makeOrder.usecase.ts";
import { OrderProps, OrderStatus } from "../../domain/order.ts";
import { OrderRepository } from "../../out/order.repository.ts";

let fixture: OrderFixture;

beforeEach(() => {
  fixture = new OrderFixture();
});

describe("Make order usecase", () => {
  it("should create a new order", () => {
    // Utilisation dans le test
    Deno.test("Make a new order", async () => {
      fixture.givenAnOrderToMake({
        products: [
          { id: "quantum-beef-burger", quantity: 1 },
          { id: "crypto-salmon-roll", quantity: 2 },
        ],
      });

      await fixture.whenIMakeTheOrder();

      fixture.thenTheOrderShouldBeCreated({
        number: "1",
        products: [
          { id: "quantum-beef-burger", quantity: 1 },
          { id: "crypto-salmon-roll", quantity: 2 },
        ],
        status: OrderStatus.RECEIVED,
      });
    });
  });
});

class OrderFixture {
  private orderRepository!: StubOrderRepository;
  private makeOrderUseCase!: MakeOrder;
  private orderToMake!: MakeOrderInput;
  private result: unknown;

  constructor() {
    this.orderRepository = new StubOrderRepository();
    this.makeOrderUseCase = new MakeOrder(this.orderRepository);
  }

  givenAnOrderToMake(input: MakeOrderInput): this {
    this.orderToMake = input;
    return this;
  }

  whenIMakeTheOrder(): this {
    this.result = this.makeOrderUseCase.execute(this.orderToMake);
    return this;
  }

  thenTheOrderShouldBeCreated(expectedOrder: OrderProps): this {
    const createdOrder = this.orderRepository.orders.get("1")!;

    assertEquals(createdOrder, expectedOrder);

    return this;
  }
}

class StubOrderRepository implements OrderRepository {
  public orders: Map<string, OrderProps> = new Map();
  // deno-lint-ignore require-await
  async create(order: OrderProps): Promise<void> {
    this.orders.set(order.number, order);
  }
}

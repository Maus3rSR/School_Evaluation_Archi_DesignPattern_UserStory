import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { MakeOrder, MakeOrderInput } from "./makeOrder.usecase.ts";
import { OrderProps, OrderStatus } from "../../domain/order.ts";
import { OrderRepository } from "../../out/order.repository.ts";

let fixture: OrderFixture;

beforeEach(() => {
  fixture = new OrderFixture();
  fixture.idGenerator.nextIdIs("1");
  fixture.idGenerator.nextIdIs("2");
  fixture.idGenerator.nextIdIs("3");
});

describe("Make order usecase", () => {
  it("should make a new order", async () => {
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

    fixture.thenOrderNumberRetrievedShouldBe("1");
  });
});

class OrderFixture {
  readonly idGenerator!: DeterministicIdentityGenerator;
  private readonly orderRepository!: StubOrderRepository;
  private readonly makeOrderUseCase!: MakeOrder;
  private orderToMake!: MakeOrderInput;
  private result: unknown;

  constructor() {
    this.idGenerator = new DeterministicIdentityGenerator();
    this.orderRepository = new StubOrderRepository();
    this.makeOrderUseCase = new MakeOrder(
      this.idGenerator.generator(),
      this.orderRepository
    );
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
    const createdOrder = this.orderRepository.orders.get(expectedOrder.number)!;
    assertEquals(createdOrder, expectedOrder);
    return this;
  }

  thenOrderNumberRetrievedShouldBe(
    expectedReturn: ReturnType<MakeOrder["execute"]>
  ): this {
    assertEquals(this.result, expectedReturn);
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

class DeterministicIdentityGenerator {
  private nextIds: Array<string> = [];

  nextIdIs(id: string) {
    this.nextIds.push(id);
  }

  *generator(): IterableIterator<string> {
    yield* this.nextIds;
  }
}

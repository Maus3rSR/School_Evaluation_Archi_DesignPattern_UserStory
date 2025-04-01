import { OrderProps } from "../../domain/order.ts";
import { OrderRepository } from "../../out/order.repository.ts";

export class StubOrderRepository implements OrderRepository {
  public orders: Map<string, OrderProps> = new Map();
  // deno-lint-ignore require-await
  async create(order: OrderProps): Promise<void> {
    this.orders.set(order.number, order);
  }
}

export class DeterministicIdentityGenerator {
  private nextIds: Array<string> = [];

  nextIdIs(id: string) {
    this.nextIds.push(id);
  }

  *generator(): IterableIterator<string> {
    yield* this.nextIds;
  }
}

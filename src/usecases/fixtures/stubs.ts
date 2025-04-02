import { DiscountRule } from "../../domain/discount.ts";
import { Order, OrderProps } from "../../domain/order.ts";
import { DiscountRepository } from "../../out/discount.repository.ts";
import { OrderRepository } from "../../out/order.repository.ts";
import {
  ProductPriceTable,
  ProductRepository,
} from "../../out/product.repository.ts";

export class StubOrderRepository implements OrderRepository {
  public orders: Map<string, OrderProps> = new Map();

  async create(order: Order): Promise<void> {
    this.orders.set(order.toSnapshot().number, order.toSnapshot());
  }

  async update(order: Order): Promise<void> {
    this.orders.set(order.toSnapshot().number, order.toSnapshot());
  }

  async retrieveFromOrderNumber(
    orderNumber: string
  ): Promise<Order | undefined> {
    return Order.fromSnapshot(this.orders.get(orderNumber)!);
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

export class StubProductRepository implements ProductRepository {
  prices: ProductPriceTable = {};

  async priceForProducts(ids: string[]): Promise<ProductPriceTable> {
    const map = ids.map((id) => ({ [id]: this.prices[id] }));
    return Object.assign({}, ...map);
  }
}

export class StubDiscountRepository implements DiscountRepository {
  rules: Array<DiscountRule> = [];

  async fetchDiscountRule(code: string): Promise<DiscountRule | undefined> {
    return this.rules.find((rule) => rule.code === code);
  }
}

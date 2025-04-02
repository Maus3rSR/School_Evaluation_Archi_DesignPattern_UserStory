import { DiscountRule } from "../../domain/discount.ts";
import { OrderProps } from "../../domain/order.ts";
import { DiscountRepository } from "../../out/discount.repository.ts";
import { OrderRepository } from "../../out/order.repository.ts";
import { ProductPriceTable } from "../../out/product.repository.ts";

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

export class StubProductRepository implements StubProductRepository {
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

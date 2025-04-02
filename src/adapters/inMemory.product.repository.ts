import {
  ProductRepository,
  ProductPriceTable,
} from "../out/product.repository.ts";

export class InMemoryProductRepository implements ProductRepository {
  constructor(private readonly prices: ProductPriceTable = {}) {}

  async priceForProducts(ids: string[]): Promise<ProductPriceTable> {
    const map = ids.map((id) => ({ [id]: this.prices[id] }));
    return Object.assign({}, ...map);
  }
}

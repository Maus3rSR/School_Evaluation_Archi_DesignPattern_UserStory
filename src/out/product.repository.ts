export type ProductPriceTable = Record<string, number>;

export interface ProductRepository {
  priceForProducts(ids: string[]): Promise<ProductPriceTable>;
}

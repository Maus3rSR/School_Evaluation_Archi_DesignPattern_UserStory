import { DiscountRule } from "../domain/discount.ts";

export interface DiscountRepository {
  fetchDiscountRule(code: string): Promise<DiscountRule | undefined>;
}

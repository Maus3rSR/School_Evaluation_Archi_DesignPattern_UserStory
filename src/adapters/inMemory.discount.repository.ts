import { DiscountRule } from "../domain/discount.ts";
import { DiscountRepository } from "../out/discount.repository.ts";

export class InMemoryDiscountRepository implements DiscountRepository {
  constructor(private readonly rules: Array<DiscountRule>) {}

  async fetchDiscountRule(code: string): Promise<DiscountRule | undefined> {
    return this.rules.find((rule) => rule.code === code);
  }
}

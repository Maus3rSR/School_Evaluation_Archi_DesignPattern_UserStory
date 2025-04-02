import { describe, it, beforeEach, test } from "jsr:@std/testing/bdd";

import { OrderState } from "../../domain/order.ts";
import { DeliveryMethod } from "../../domain/delivery.ts";
import { OrderFixture } from "../fixtures/order.ts";

let fixture: OrderFixture;

beforeEach(() => {
  fixture = new OrderFixture();
});

describe("Make an order usecase", () => {
  beforeEach(() => {
    fixture.idGenerator.nextIdIs("1");
  });

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
      total: 0,
      state: OrderState.RECEIVED,
      deliveryMethod: DeliveryMethod.DINE_IN,
    });

    fixture.thenOrderNumberRetrievedShouldBe("1");
  });

  describe("Standard order total computation", () => {
    beforeEach(() => {
      fixture.givenProductPrices({
        "quantum-beef-burger": 10,
        "crypto-salmon-roll": 5,
      });
    });

    describe("Compute the total price of order based on quantity", () => {
      test("Order: 1x10", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
        });

        fixture.thenOrderTotalShouldBe(10);
      });

      test("Order: 1x10 and 2x5", async () => {
        await fixture.whenIMakeTheOrder({
          products: [
            { id: "quantum-beef-burger", quantity: 1 },
            { id: "crypto-salmon-roll", quantity: 2 },
          ],
        });

        fixture.thenOrderTotalShouldBe(20);
      });
    });

    describe("Order total computation with discount", () => {
      it("Order: 1x10 and 2x5 with discount 20%", async () => {
        fixture.givenProductPrices({
          "quantum-beef-burger": 10,
          "crypto-salmon-roll": 5,
        });

        fixture.givenSomeDiscountRule({
          code: "CYBERPUNK20",
          value: 20,
          type: "PERCENT",
        });

        await fixture.whenIMakeTheOrder({
          products: [
            { id: "quantum-beef-burger", quantity: 1 },
            { id: "crypto-salmon-roll", quantity: 2 },
          ],
          discountCode: "CYBERPUNK20",
        });

        fixture.thenOrderTotalShouldBe(16);
      });
    });

    describe("Order total computation with delivery fees", () => {
      beforeEach(() => {
        fixture.givenProductPrices({
          "quantum-beef-burger": 10,
        });
      });

      it("Order: 1x10, Drone add 5 to total", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
          deliveryMethod: DeliveryMethod.DRONE,
        });

        fixture.thenOrderTotalShouldBe(15);
      });

      it("Order: 1x10, Hoverbike add 10 to total", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
          deliveryMethod: DeliveryMethod.HOVERBIKE,
        });

        fixture.thenOrderTotalShouldBe(20);
      });

      it("Order: 1x10, SUPEERC0NDUCT0R add 15 to total", async () => {
        await fixture.whenIMakeTheOrder({
          products: [{ id: "quantum-beef-burger", quantity: 1 }],
          deliveryMethod: DeliveryMethod.SUPEERC0NDUCT0R,
        });

        fixture.thenOrderTotalShouldBe(25);
      });
    });
  });
});

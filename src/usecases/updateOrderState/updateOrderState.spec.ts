import { beforeEach, describe, it } from "jsr:@std/testing/bdd";

import { OrderState } from "../../domain/order.ts";
import { OrderFixture } from "../fixtures/order.ts";

let fixture: OrderFixture;

beforeEach(() => {
  fixture = new OrderFixture();
});

describe("Update order state usecase", () => {
  it("Should update order state", async () => {
    fixture.givenAnOrderWithState("1", OrderState.RECEIVED);

    await fixture.whenIUpdateTheOrderState({
      orderNumber: "1",
      to: OrderState.IN_PREPARATION,
    });

    fixture.thenTheOrderStateShouldBe(OrderState.IN_PREPARATION);
  });

  [
    {
      from: OrderState.RECEIVED,
      to: OrderState.IN_PREPARATION,
    },
    {
      from: OrderState.IN_PREPARATION,
      to: OrderState.READY,
    },
    {
      from: OrderState.READY,
      to: OrderState.DELIVERING,
    },
    {
      from: OrderState.DELIVERING,
      to: OrderState.DELIVERED,
    },
    {
      from: OrderState.READY,
      to: OrderState.SERVED,
    },
  ].forEach(({ from, to }) => {
    it(`Should update the state from ${from} to ${to}`, async () => {
      fixture.givenAnOrderWithState("1", from);

      await fixture.whenIUpdateTheOrderState({
        orderNumber: "1",
        to,
      });

      fixture.thenTheOrderStateShouldBe(to);
    });
  });

  [
    {
      from: OrderState.RECEIVED,
      to: [
        OrderState.READY,
        OrderState.SERVED,
        OrderState.DELIVERING,
        OrderState.DELIVERED,
      ],
    },
    {
      from: OrderState.IN_PREPARATION,
      to: [
        OrderState.RECEIVED,
        OrderState.SERVED,
        OrderState.DELIVERING,
        OrderState.DELIVERED,
      ],
    },
    {
      from: OrderState.READY,
      to: [
        OrderState.RECEIVED,
        OrderState.IN_PREPARATION,
        OrderState.DELIVERED,
      ],
    },
    {
      from: OrderState.SERVED,
      to: [
        OrderState.RECEIVED,
        OrderState.IN_PREPARATION,
        OrderState.READY,
        OrderState.DELIVERING,
        OrderState.DELIVERED,
      ],
    },
    {
      from: OrderState.DELIVERING,
      to: [
        OrderState.RECEIVED,
        OrderState.IN_PREPARATION,
        OrderState.READY,
        OrderState.SERVED,
      ],
    },
    {
      from: OrderState.DELIVERED,
      to: [
        OrderState.RECEIVED,
        OrderState.IN_PREPARATION,
        OrderState.READY,
        OrderState.SERVED,
        OrderState.DELIVERING,
      ],
    },
  ].forEach(({ from, to }) => {
    to.forEach((to) => {
      it(`Should not update the state from ${from} to ${to}`, async () => {
        fixture.givenAnOrderWithState("1", from);

        await fixture.whenIUpdateTheOrderState({
          orderNumber: "1",
          to,
        });

        fixture.thenTheOrderStateShouldBe(from);
      });
    });
  });
});

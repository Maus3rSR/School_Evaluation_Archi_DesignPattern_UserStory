import { InMemoryDiscountRepository } from "./adapters/inMemory.discount.repository.ts";
import { InMemoryOrderRepository } from "./adapters/inMemory.order.repository.ts";
import { InMemoryProductRepository } from "./adapters/inMemory.product.repository.ts";
import { UUIDGenerator } from "./adapters/uuidIdentityGenerator.ts";
import { OrderTotalService } from "./services/orderTotal.service.ts";
import { MakeOrder } from "./usecases/makeOrder/makeOrder.usecase.ts";
import { OrderAmountToPay } from "./usecases/orderAmountToPay/orderAmountToPay.usecase.ts";

import { UpdateOrderState } from "./usecases/updateOrderState/updateOrderState.usecase.ts";

/**
 * Configuration des dépendances externes au code métier
 */
const orderRepository = new InMemoryOrderRepository();
const productRepository = new InMemoryProductRepository({
  quantum_beef_burger: 10,
  crypto_salmon_roll: 22,
  nanomacheese: 12,
  matrix_chocolate_cake: 7,
  electric_bluejito: 3,
  firewall_fusion: 5,
});
const discountRepository = new InMemoryDiscountRepository([
  {
    code: "WELCOME20",
    value: 20,
    type: "PERCENT",
  },
]);

/**
 * Instantiation des cas d'utilisations
 */
const orderAmountToPay = new OrderAmountToPay(orderRepository);
const updateOrderState = new UpdateOrderState(orderRepository);
const makeOrder = new MakeOrder(
  UUIDGenerator(),
  orderRepository,
  new OrderTotalService(productRepository, discountRepository)
);

/**
 * Programme
 */
async function NeuroBiteDeliveryFastFood() {
  console.log("Welcome to NeuroBite Delivery Fast Food");

  console.log(`Making an order...`);
  const orderNumberA = await makeOrder.execute({
    products: [
      {
        id: "quantum_beef_burger",
        quantity: 1,
      },
    ],
    deliveryMethod: "DINE_IN",
  });

  console.log(`Order ${orderNumberA} has been made`);

  console.log(
    `Amount to pay for order ${orderNumberA}: ${await orderAmountToPay.get({
      orderNumber: orderNumberA,
    })}`
  );

  /**
   * Quelque part en cuisine quantique...
   */
  await updateOrderState.execute({
    orderNumber: orderNumberA,
    to: "IN_PREPARATION",
  });
  console.log(`Order updated to IN_PREPARATION`);

  await updateOrderState.execute({
    orderNumber: orderNumberA,
    to: "READY",
  });
  console.log(`Order updated to READY`);

  await updateOrderState.execute({
    orderNumber: orderNumberA,
    to: "SERVED",
  });
  console.log(`Order is SERVED to customer...`);

  /**
   * Autre commande...
   */
  console.log(`Making another order...`);
  const orderNumberB = await makeOrder.execute({
    products: [
      {
        id: "quantum_beef_burger",
        quantity: 1,
      },
      {
        id: "crypto_salmon_roll",
        quantity: 2,
      },
      {
        id: "electric_bluejito",
        quantity: 3,
      },
    ],
    deliveryMethod: "SUPEERC0NDUCT0R",
    discountCode: "WELCOME20",
  });

  console.log(`Order ${orderNumberB} has been made`);

  console.log(
    `Amount to pay for order ${orderNumberB}: ${await orderAmountToPay.get({
      orderNumber: orderNumberB,
    })}`
  );
}

NeuroBiteDeliveryFastFood();

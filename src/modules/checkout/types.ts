import { CHECKOUT_STEPS } from "./constants";

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number];

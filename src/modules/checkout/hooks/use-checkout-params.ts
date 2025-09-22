import { parseAsStringEnum, useQueryStates } from "nuqs";
import { CHECKOUT_STEPS } from "../constants";

export const useCheckoutParams = () => {
  return useQueryStates({
    step: parseAsStringEnum([...CHECKOUT_STEPS])
      .withDefault(CHECKOUT_STEPS[0])
      .withOptions({
        clearOnDefault: true,
      }),
  });
};

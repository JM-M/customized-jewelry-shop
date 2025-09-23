import { useQuery } from "@tanstack/react-query";

import { TerminalState } from "@/modules/terminal/types";
import { useTRPC } from "@/trpc/client";

interface UseGetStatesProps {
  countryCode?: string;
}

export const useGetStates = ({ countryCode }: UseGetStatesProps) => {
  const trpc = useTRPC();

  const {
    data: statesData,
    isLoading,
    error,
  } = useQuery({
    ...trpc.terminal.getStates.queryOptions({
      country_code: countryCode || "",
    }),
    enabled: !!countryCode,
  });

  const states: TerminalState[] = statesData?.data || [];

  return {
    states,
    isLoading,
    error,
  };
};

import { useQuery } from "@tanstack/react-query";

import { PlansApiServices } from "@/services/api/plans.service";

export const useGetPlans = () => {
  return useQuery({
    queryFn: () => PlansApiServices.getPlans(),
    queryKey: ["plans"],
    staleTime: 5_000_000,
  });
};
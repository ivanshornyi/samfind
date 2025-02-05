import { getUserReferralsById } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useUserReferralls = (id: string) => {
  return useQuery({
    queryFn: () => getUserReferralsById(id),
    queryKey: ["user-referrals", id],
    enabled: !!id,
  });
};

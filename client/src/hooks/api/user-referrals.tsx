import { useContext } from "react";

import { AuthContext } from "@/context";

import { useQuery } from "@tanstack/react-query";
import { UserReferralApiService } from "@/services";

export const useGetUserReferralUsers = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserReferralApiService.getUserReferralUsers(user?.id ?? ""),
    queryKey: ["referral-users"],
    enabled: !!user?.id,
    staleTime: 5_000_000,
  });
};
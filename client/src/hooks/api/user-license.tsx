import { useContext } from "react";

import { AuthContext } from "@/context";

import { UserLicenseApiService } from "@/services";

import { useQuery } from "@tanstack/react-query";

export const useGetUserLicense = (id: string) => {
  return useQuery({
    queryFn: () => UserLicenseApiService.getUserLicense(id),
    queryKey: ["user-license"],
  });
};

export const useGetUserLicenses = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserLicenseApiService.getUserLicenses(user?.id ?? ""),
    queryKey: ["user-license-list", user?.id],
    enabled: !!user?.id,
  });
};

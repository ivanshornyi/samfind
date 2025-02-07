import { useMutation, useQuery } from "@tanstack/react-query";

import { OrganizationApiService, UpdateOrganizationData } from "@/services";
import { useToast } from "../use-toast";

import { handleToastError } from "@/errors";

export const useUpdateOrganization = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: {
      id: string;
      organizationData: UpdateOrganizationData;
    }) =>
      OrganizationApiService.updateOrganization(data.id, data.organizationData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
        variant: "default",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useGetOrganization = (id: string) => {
  return useQuery({
    queryFn: () => OrganizationApiService.getOrganization(id),
    queryKey: ["organization", id],
    enabled: !!id,
  });
};

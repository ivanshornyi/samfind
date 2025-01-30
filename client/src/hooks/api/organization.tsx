import { useMutation } from "@tanstack/react-query";

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
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

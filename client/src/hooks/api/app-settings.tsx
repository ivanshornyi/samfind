import { AppSettingsApiService } from "@/services/api/app-settings.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAppSettings = () => {
  return useQuery({
    queryFn: () => AppSettingsApiService.getAppSettings(),
    queryKey: ["app-settings"],
  });
};

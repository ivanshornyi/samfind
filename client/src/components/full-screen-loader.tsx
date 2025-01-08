import { LoaderCircle } from "lucide-react";

export const FullScreenLoader = () => {
  return (
    <div
      className="
        fixed left-0 top-0 h-[100dvh] w-full bg-gray-500/50
        flex items-center justify-center z-40
      "
    >
      <LoaderCircle size={40} className="text-gray-700 animate-spin" />
    </div>
  );
};

import { LoaderCircle } from "lucide-react";

export const FullScreenLoader = () => {
  return (
    <div
      className="
        fixed left-0 top-0 h-[100dvh] w-full bg-black/80
        flex items-center justify-center z-40
      "
    >
      <LoaderCircle size={40} className="animate-spin" />
    </div>
  );
};

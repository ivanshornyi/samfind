import { Info } from "lucide-react";

export const ReferralInfo = () => (
  <div className="flex gap-2 bg-[#242424] px-6 py-4 text-blue-50 font-medium text-base rounded-2xl mb-8">
    <div className="w-[14px] h-[14px] mt-[6px]">
      <Info style={{ width: "14px", height: "14px" }} />
    </div>
    <div className="space-y-2">
      <p>
        Share the benefits of our service with your friends and get rewarded!
        Use your rewards from the internal wallet to offset your license costs.
      </p>
      <p>
        Your Friend Saves Too: Each friend who registers through your link gets
        a 10% discount on their first month.
      </p>
    </div>
  </div>
);

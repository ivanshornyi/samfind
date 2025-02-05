import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] border-none text-white max-w-[600px] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[32px] leading-[44px] font-semibold">
              Are you sure you want to cancel your subscription?
            </DialogTitle>
            <Button
              variant="ghost"
              className="w-12 h-12 p-4 mb-auto"
              onClick={onClose}
            >
              <X className="h-12 w-12" />
            </Button>
          </div>
        </DialogHeader>

        <p className="text-[#C4C4C4] text-[16px] leading-[22px] mt-4">
          If you cancel, you&apos;ll lose access to all the benefits of your
          subscription. Your subscription is active until the next billing date:
          [Month] 1st.
        </p>

        <div className="flex gap-4 mt-8">
          <Button
            className="flex-1 bg-[#383838] hover:bg-[#424242] text-white rounded-full h-[56px] text-[16px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#FF6C6C] hover:bg-[#FF5252] text-white rounded-full h-[56px] text-[16px]"
            onClick={onConfirm}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

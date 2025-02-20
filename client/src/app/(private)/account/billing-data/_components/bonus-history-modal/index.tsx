import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/ui";
import { X } from "lucide-react";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useGetDiscountHistory } from "@/hooks/api/billing-history";
import { useContext } from "react";
import { AuthContext } from "@/context";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";

export const BonusHistoryModal = () => {
  const { user } = useContext(AuthContext);
  const { data: discountHistory, isPending: isDiscountHistoryPending } =
    useGetDiscountHistory(user?.id ?? "");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="underline text-disabled" variant="ghost">
          Discount funds movement
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[760px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold">
            Discount funds movement
          </AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        <div className="absolute right-5 top-5">
          <AlertDialogCancel className="shadow-none border-none p-1 rounded-full bg-card">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <Table>
          <TableHeader className="hover:bg-transparent">
            <TableRow className="border-white/30 hover:bg-transparent">
              <TableHead className="uppercase text-white/60">Date</TableHead>
              <TableHead className="uppercase text-white/60">
                Transaction Type
              </TableHead>
              <TableHead className="uppercase text-white/60">Amount</TableHead>
              <TableHead className="uppercase text-white/60">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountHistory?.map((historyItem) => (
              <TableRow
                key={historyItem.id}
                className="border-none hover:bg-transparent"
              >
                <TableCell className="font-medium py-2">
                  {historyItem.date &&
                    format(new Date(historyItem.date), "dd.MM.yyyy")}
                </TableCell>
                <TableCell>{historyItem.type}</TableCell>
                <TableCell>
                  {historyItem.type === "income" ? "+" : "-"}€
                  {historyItem.amount / 100}
                </TableCell>
                <TableCell>
                  <p className="truncate w-[250px]">
                    {historyItem.description}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!isDiscountHistoryPending &&
          (discountHistory?.length === 0 || !discountHistory) && (
            <div className="py-[50px]">
              <p className="text-center text-white/60 w-full">
                This is where your bonus history will be displayed
              </p>
            </div>
          )}

        {isDiscountHistoryPending && (
          <div className="py-[50px] text-center">
            <p>Loading...</p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

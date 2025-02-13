"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context";
import { useGetBillingHistory } from "@/hooks/api/billing-history";
// import { BillingHistoryItem } from "@/types/billings";
// import {
//   createColumnHelper,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { format } from "date-fns";

export const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const { data: billingHistory, isPending: isBillingHistoryPending } =
    useGetBillingHistory(user?.id ?? "");

  // const columnHelper = createColumnHelper<BillingHistoryItem>();

  // const columns = [
  //   columnHelper.accessor("number", {
  //     header: "Invoice Number",
  //     cell: (info) => (
  //       <div>
  //         <div>{info.getValue()}</div>
  //         <div className="text-[#C4C4C4] text-xs">
  //           {info.row.original.description}
  //         </div>
  //       </div>
  //     ),
  //   }),
  //   columnHelper.accessor("date", {
  //     header: "Invoice Date",
  //     cell: (info) => {
  //       const date = new Date(info.getValue() * 1000);
  //       return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  //     },
  //   }),
  //   columnHelper.accessor("price", {
  //     header: "Amount",
  //     cell: (info) => `€${(info.getValue() / 100).toFixed(2)}`,
  //   }),
  //   columnHelper.accessor("status", {
  //     header: "Status",
  //     cell: (info) => (
  //       <div
  //         className={
  //           info.getValue() === "paid" ? "text-[#4BB543]" : "text-[#FF6C6C]"
  //         }
  //       >
  //         {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
  //       </div>
  //     ),
  //   }),
  // ];

  // const table = useReactTable({
  //   data: billingHistory ?? [],
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "MMM d, yyyy");
  };

  return (
    <div className="w-full mt-5 mb-[100px]">
      <Table>
        <TableHeader className="hover:bg-transparent">
          <TableRow className="border-white/30 hover:bg-transparent">
            <TableHead className="w-[250px] uppercase text-white/60">
              Invoice
            </TableHead>
            <TableHead className="uppercase text-white/60">
              Invoice date
            </TableHead>
            <TableHead className="uppercase text-white/60">Price</TableHead>
            <TableHead className="uppercase text-white/60">
              After discount
            </TableHead>
            <TableHead className="uppercase text-white/60">Status</TableHead>
            <TableHead className="uppercase text-white/60"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billingHistory?.map((historyItem) => (
            <TableRow
              key={historyItem.number}
              className="border-none hover:bg-transparent"
            >
              <TableCell className="font-medium py-2">
                <div className="">
                  <p>{historyItem.number}</p>
                  <p className="text-disabled text-[12px] truncate w-[200px]">
                    {historyItem.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {historyItem.date && formatTimestamp(historyItem.date)}
              </TableCell>
              <TableCell>€{historyItem.price / 100}</TableCell>
              <TableCell>
                €{(historyItem?.afterDiscount ?? historyItem.price / 100) / 100}
              </TableCell>
              <TableCell
                className={`${historyItem.status === "paid" ? "text-[#4BB543]" : "text-[#FF6C6C]"} capitalize`}
              >
                {historyItem.status}
              </TableCell>
              <TableCell>
                {historyItem.url && (
                  <Link
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={historyItem.url}
                  >
                    Open an invoice
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isBillingHistoryPending &&
        (billingHistory?.length === 0 || billingHistory === undefined) && (
          <div className="py-[50px]">
            <p className="text-center text-white/60 w-full">
              This is where your payment history will be displayed
            </p>
          </div>
        )}

      {isBillingHistoryPending && (
        <div className="py-[50px] text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

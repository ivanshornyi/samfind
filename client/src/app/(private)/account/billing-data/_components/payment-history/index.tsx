import { ReusableTable } from "@/components/table";
import { AuthContext } from "@/context";
import { useGetBillingHistory } from "@/hooks/api/billing-history";
import { BillingHistoryItem } from "@/types/billings";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useContext, useEffect } from "react";

export const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const { data: billingHistory, isLoading } = useGetBillingHistory(
    user?.id ?? ""
  );

  const columnHelper = createColumnHelper<BillingHistoryItem>();

  const columns = [
    columnHelper.accessor("number", {
      header: "Invoice Number",
      cell: (info) => (
        <div>
          <div>{info.getValue()}</div>
          <div className="text-[#C4C4C4] text-xs">
            {info.row.original.description}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Invoice Date",
      cell: (info) => {
        const date = new Date(info.getValue() * 1000);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      },
    }),
    columnHelper.accessor("price", {
      header: "Amount",
      cell: (info) => `$${(info.getValue() / 100).toFixed(2)}`,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <div
          className={
            info.getValue() === "paid" ? "text-[#4BB543]" : "text-[#FF6C6C]"
          }
        >
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: billingHistory ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    console.log('rerender')
  }, []);

  return (
    <ReusableTable
      table={table}
      isLoading={isLoading}
      noDataMessage="No payment history available."
      onPageChange={() => {}}
      pageCount={1}
    />
  );
};

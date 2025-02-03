import { Button } from "@/components";
import { ReusableTable } from "@/components/table";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Info } from "lucide-react";

interface ReferrallItem {
  username: string;
  activationDate: string;
  payout: number;
}

interface DisplayReferralItem extends ReferrallItem {
  icon: React.ReactNode;
}

const generateUsernameCircle = (username: string) => {
  const firstLetter = username.charAt(0).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center">
      <span className="text-2xl text-[#BEB8FF] font-semibold">
        {firstLetter}
      </span>
    </div>
  );
};

const data: DisplayReferralItem[] = [
  {
    icon: generateUsernameCircle("john_doe"),
    username: "john_doe",
    activationDate: "2023-01-01",
    payout: 50,
  },
  {
    icon: generateUsernameCircle("jane_smith"),
    username: "jane_smith",
    activationDate: "2023-02-15",
    payout: 75,
  },
  {
    icon: generateUsernameCircle("alice_jones"),
    username: "alice_jones",
    activationDate: "2023-03-10",
    payout: 100,
  },
];

const columns: ColumnDef<DisplayReferralItem>[] = [
  {
    id: "icon",
    cell: ({ row }) => row.original.icon,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[#A8A8A8] text-sm uppercase font-semibold px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-semibold text-[15px] leading-[20px]">
        {row.original.username}
      </span>
    ),
  },
  {
    accessorKey: "activationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[#A8A8A8] text-sm uppercase font-semibold px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of activation
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-sm">{row.original.activationDate}</span>
    ),
  },
  {
    accessorKey: "payout",
    header: () => (
      <div className="flex items-start gap-2 text-[#A8A8A8]">
        <span className="text-sm uppercase font-semibold">Payout</span>
        <Info style={{ width: "14px", height: "14px", marginTop: "1.5px" }} />
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-[#00DC2C]">{row.original.payout}$</span>
    ),
  },
];

export const ReferralsTable = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <ReusableTable table={table} onPageChange={() => {}} pageCount={3} />;
};

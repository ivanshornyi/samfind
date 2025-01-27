"use client";

import React from "react";

import { useGetUserLicenses } from "@/hooks";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ReusableTable } from "@/components/table";

const mockData = [
  {
    name: "Name1",
    email: "starttyping@gmail.com",
    date: "02.02.2025",
    access: "Owner",
    licence: "4923882344",
  },
  {
    name: "Name2",
    email: "starttyping@gmail.com",
    date: "02.02.2025",
    access: "Member",
    licence: "4923882344",
  },
  {
    name: "Name3",
    email: "starttyping@gmail.com",
    date: "02.02.2025",
    access: "Member",
    licence: "4923882344",
  },
];

const headers = {
  name: "name",
  email: "email",
  date: "date of activation",
  access: "access rights",
  licence: "licence key",
};

interface LicenseItem {
  name: string;
  email: string;
  date: string;
  access: string;
  licence: string;
}

const columns: ColumnDef<LicenseItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="text-disabled uppercase text-left pl-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{headers.name}</span>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue(headers.name)}</div>,
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="text-disabled uppercase">{headers.email}</div>
    ),
    cell: ({ row }) => <div>{row.getValue(headers.email)}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        className="text-disabled uppercase text-left pl-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {headers.date}
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "licence",
    header: () => (
      <div className="text-disabled uppercase">{headers.licence}</div>
    ),
    cell: ({ row }) => <div>{row.getValue("licence")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Delete user</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function LicenseList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: userLicenses = [], isPending: isUserLicensesPending } =
    useGetUserLicenses();

  const table = useReactTable({
    data: mockData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mx-auto">
      <div className="w-full">
        <h2 className="text-[32px] leading-[44px] font-semibold">
          License management
        </h2>
        <div className="mt-6"></div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Search"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-card"
          />
        </div>

        <ReusableTable
          table={table}
          isLoading={false}
          onPageChange={(page: number) => console.log(page)}
          pageCount={100}
          noDataMessage="No licenses found."
        />
      </div>
    </div>
  );
}

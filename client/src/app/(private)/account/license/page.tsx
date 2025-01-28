/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";

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
  Card,
} from "@/components";

import { ArrowUpDown, Info, MoreHorizontal, Search } from "lucide-react";
import { ReusableTable } from "@/components/table";
import { InviteMember, ProgressChart } from "./_components";

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
    cell: ({ row }) => {
      const value: string = row.getValue(headers.name);
      return (
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center rounded-full w-10 h-10 bg-input text-[24px] leading-[33px] text-link-hover font-semibold">
            <span>{value[0]}</span>
          </div>
          <span>{value}</span>
        </div>
      );
    },
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
    accessorKey: "access",
    header: () => {
      const [showInfo, setShowInfo] = useState(false);
      return (
        <div className="relative overflow-visible flex items-center gap-2 text-disabled uppercase">
          <span>{headers.access}</span>
          <Info
            onMouseLeave={() => setShowInfo(false)}
            onMouseEnter={() => setShowInfo(true)}
            className="cursor-pointer"
            style={{ width: "14px", height: "14px" }}
          />
          {showInfo ? (
            <Card className="absolute top-5 w-[300px] h-[100px] text-disabled lowercase p-4">
              As an Owner, you can add other users to your group. You’ll be
              responsible for covering their license fees.
            </Card>
          ) : null}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("access")}</div>,
  },
  {
    accessorKey: "licence",
    header: () => (
      <div className=" text-disabled uppercase">{headers.licence}</div>
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
        <DropdownMenuContent className="bg-input border-none" align="end">
          <DropdownMenuItem>
            <Button
              variant={"edit"}
              className="text-[#FF6C6C] hover:text-[#D23535] active:text-[#302935]"
            >
              Delete user
            </Button>
          </DropdownMenuItem>
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
        <div className="mt-6 flex justify-between items-end">
          <ProgressChart currentMembers={3} maxMembers={10} />
          <InviteMember allowedMembers={10} />
        </div>
        <div className="flex items-center justify-end py-4">
          <div className="w-[308px] relative">
            <Input
              placeholder="Search"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm bg-card"
            />
            <div className="absolute right-6 top-0 h-full flex justify-center items-center">
              <Search style={{ width: "24px", height: "24px" }} />
            </div>
          </div>
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

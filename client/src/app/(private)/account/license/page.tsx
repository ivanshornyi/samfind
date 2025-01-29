"use client";

import React, { useContext, useEffect, useState } from "react";

import { useGetUserLicenses } from "@/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
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

import { ArrowUpDown, Info, MoreHorizontal, Search } from "lucide-react";
import { ReusableTable } from "@/components/table";
import { InviteMember, ProgressChart } from "./_components";
import { AuthContext } from "@/context";

const mockData = [
  {
    name: "Name1",
    email: "starttyping@gmail.com",
    date: "02.02.2025",
    access: "Owner",
    license: "4923882344",
  },
  {
    name: "Name2",
    email: "starttyping@gmail.com",
    date: "02.02.2025",
    access: "Member",
    license: "4923882344",
  },
  {
    name: "Name3",
    email: "starttyping@gmail.com",
    date: "02.02.2025",
    access: "Member",
    license: "4923882344",
  },
];

const headers = {
  name: "name",
  email: "email",
  date: "date of activation",
  access: "access rights",
  license: "license key",
};

interface LicenseItem {
  name: string;
  email: string;
  date: string;
  access: string;
  license: string;
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
      return (
        <div className="relative overflow-visible flex items-center gap-2 text-disabled uppercase">
          <span>{headers.access}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info style={{ width: "14px", height: "14px" }} />
              </TooltipTrigger>
              <TooltipContent className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] text-xs font-medium text-[#A8A8A8] normal-case">
                As an Owner, you can add other users to your group. You’ll be
                responsible for covering their license fees.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("access")}</div>,
  },
  {
    accessorKey: "license",
    header: () => (
      <div className=" text-disabled uppercase">{headers.license}</div>
    ),
    cell: ({ row }) => <div>{row.getValue("license")}</div>,
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
  const [users, setUsers] = useState<LicenseItem[]>(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { user } = useContext(AuthContext);
  const { data: userLicense, isPending: isUserLicensesPending } =
    useGetUserLicenses();
  const itemsPerPage = 10;
  const pageCount = Math.ceil(userLicense?.users.length || 0 / itemsPerPage);

  useEffect(() => {
    if (userLicense?.users) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const selectedUsers = userLicense.users
        .slice(startIndex, endIndex)
        .map((u) => ({
          name: u.name,
          email: u.email,
          date: new Intl.DateTimeFormat("ru-RU").format(new Date(u.date)),
          access: u.email === user?.email ? "Owner" : "Member",
          license: u.license,
        }));

      setUsers(selectedUsers);
    }
  }, [userLicense, currentPage, user?.email]);
  console.log("userLicenses", userLicense);

  const table = useReactTable({
    data: users,
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
          isLoading={isUserLicensesPending}
          onPageChange={(page: number) => setCurrentPage(page)}
          pageCount={pageCount}
          noDataMessage="No licenses found."
        />
      </div>
    </div>
  );
}

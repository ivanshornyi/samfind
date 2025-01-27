"use client";

import React from "react";

import { useGetUserLicenses } from "@/hooks";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components";

import {
  ArrowUpDown,
  ChevronDown,
  LoaderCircle,
  MoreHorizontal,
} from "lucide-react";
import { License, LicenseStatus } from "@/types";

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
  username: string;
  date: string;
  role: string;
  phoneNumber: string;
}

const columns: ColumnDef<LicenseItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="text-disabled uppercase"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <div>{headers.name}</div>
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
        className="text-disabled uppercase"
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
        <div className="flex items-center py-4">
          <Input
            placeholder="Search"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-card"
          />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <Table
          // className="bg-card rounded-md border-none"
          className="max-w-full w-[1064px]"
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-disabled">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length !== 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-none"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {table.getRowModel().rows?.length === 0 &&
              !isUserLicensesPending && (
                <TableRow className="border-none">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}

            {/* {isUserLicensesPending && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <LoaderCircle size={18} className="mx-auto animate-spin" />
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

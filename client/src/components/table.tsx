import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import {
  flexRender,
  RowData,
  Table as ReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReusableTableProps<T extends RowData> {
  table: ReactTable<T>;
  isLoading?: boolean;
  noDataMessage?: string;
  onPageChange: (page: number) => void;
  pageCount: number;
}

export const ReusableTable = <T extends RowData>({
  table,
  isLoading = false,
  noDataMessage = "No results found.",
  onPageChange,
  pageCount,
}: ReusableTableProps<T>) => {
  return (
    <div>
      <Table className="max-w-full w-[1064px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="text-left" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-none hover:bg-transparent"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-left" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {table.getRowModel().rows.length === 0 && !isLoading && (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-center"
              >
                {noDataMessage}
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-center"
              >
                <div>Loading...</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ReactPaginate
        breakLabel="..."
        nextLabel={<ChevronRight />}
        previousLabel={<ChevronLeft />}
        onPageChange={(e) => onPageChange(e.selected)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        containerClassName="flex space-x-2 mt-4"
        pageClassName="px-3 py-1 bg-g text-disabled bg-[#242424] rounded-md"
        activeClassName="text-light"
        previousClassName="px-3 py-1 bg-[#242424] text-disabled rounded-md"
        nextClassName="px-3 py-1 bg-[#242424] text-disabled rounded-md"
        breakClassName="px-3 py-1 bg-[#242424] text-disabled rounded-md"
        disabledClassName="bg-[#1F1E1F] cursor-not-allowed"
      />
    </div>
  );
};

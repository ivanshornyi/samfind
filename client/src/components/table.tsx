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
  Table as ReactTable,
  RowData,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

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
      <Table className="w-full max-w-[1064px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="hover:bg-transparent border-disabled"
              key={headerGroup.id}
            >
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
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-center py-20"
              >
                {noDataMessage}
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-center "
              >
                <div>Loading...</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel={<ChevronRight />}
          previousLabel={<ChevronLeft />}
          onPageChange={(e) => onPageChange(e.selected)}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          containerClassName="flex space-x-2 mt-[50px]"
          pageClassName="px-3 py-1 bg-g text-[#A8A8A8] bg-transparent rounded-md"
          activeClassName="text-white bg-slate-800 font-semibold"
          previousClassName="px-3 py-1 bg-transparent text-[#A8A8A8] rounded-md"
          nextClassName="px-3 py-1 bg-transparent text-[#A8A8A8] rounded-md"
          breakClassName="px-3 py-1 bg-transparent text-[#A8A8A8] rounded-md"
          disabledClassName="bg-transparent text-slate-600 cursor-not-allowed"
        />
      )}
    </div>
  );
};

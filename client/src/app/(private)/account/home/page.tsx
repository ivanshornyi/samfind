// "use client";

// import React from "react";

// import { useGetUserLicenses } from "@/hooks";

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Button,
//   Input,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components";

// import {
//   ArrowUpDown,
//   ChevronDown,
//   LoaderCircle,
//   MoreHorizontal,
// } from "lucide-react";
// import { License, LicenseStatus } from "@/types";

// const columns: ColumnDef<License>[] = [
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div
//         className={`${
//           row.getValue("status") === LicenseStatus.Active
//             ? "text-green-500"
//             : "text-orange-400"
//         } capitalize text-xs`}
//       >
//         {row.getValue("status")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Name
//         <ArrowUpDown />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: () => (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>View details</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     ),
//   },
// ];

export default function Home() {
  return (
    <div>
      <p>Home page</p>
    </div>
  );
}

// export default function LicenseList() {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   const { data: userLicenses = [], isPending: isUserLicensesPending } =
//     useGetUserLicenses();

//   const table = useReactTable({
//     data: userLicenses,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="mx-auto w-[732px]">
//       <div className="w-full">
//         <h2 className="text-[24px]">Your licenses</h2>
//         <div className="flex items-center py-4">
//           <Input
//             placeholder="Filter license names..."
//             value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
//             onChange={(event) =>
//               table.getColumn("name")?.setFilterValue(event.target.value)
//             }
//             className="max-w-sm bg-card"
//           />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="ml-auto">
//                 Columns <ChevronDown />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               {table
//                 .getAllColumns()
//                 .filter((column) => column.getCanHide())
//                 .map((column) => {
//                   return (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) =>
//                         column.toggleVisibility(!!value)
//                       }
//                     >
//                       {column.id}
//                     </DropdownMenuCheckboxItem>
//                   );
//                 })}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <div className="rounded-md border">
//           <Table className="bg-card rounded-md border-none">
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => {
//                     return (
//                       <TableHead key={header.id}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                       </TableHead>
//                     );
//                   })}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length !== 0 &&
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}

//               {table.getRowModel().rows?.length === 0 &&
//                 !isUserLicensesPending && (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}

//               {isUserLicensesPending && (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     <LoaderCircle size={18} className="mx-auto animate-spin" />
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="flex items-center justify-end space-x-2 py-4">
//           <div className="space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

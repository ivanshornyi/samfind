import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: number;
  status: string;
  name: string;
  email: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const users: User[] = [
  { id: 1, status: "Success", name: "John Doe", email: "john@gmail.com" },
  { id: 2, status: "Success", name: "Jane Smith", email: "jane@gmail.com" },
  { id: 3, status: "Success", name: "Alice Johnson", email: "alice@gmail.com" },
  { id: 4, status: "Success", name: "Bob Brown", email: "bob@gmail.com" },
];

export const UserManagementPage = () => {
  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

import { DataTable } from "@/components/data-table";
import { useFindUsers } from "@/hooks";
import { User } from "@shared/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export const UserManagementPage = () => {
  const { data, isLoading, isError } = useFindUsers();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

import { Input, userColumns } from "@/components";
import { DataTable } from "@/components/data-table";
import { useFindUsers } from "@/hooks";

export const UserManagementPage = () => {
  const { data, isLoading, isError } = useFindUsers();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className="flex flex-col gap-4 py-6 px-3 rounded-lg">
      <Input placeholder="Search users..." className="max-w-96" />
      <DataTable columns={userColumns} data={data} />
    </div>
  );
};

import { useState } from "react";
import {
  Input,
  userColumns,
  Button,
} from "@/components";
import { DataTable } from "@/components/data-table";
import { useFindUsers } from "@/hooks";

export const UserManagementPage = () => {
  const [page, setPage] = useState<number>(0);
  const { data, isLoading, isError } = useFindUsers("", page * 10, 10);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  const handleNextPage = () => setPage((prev) => prev + 1);

  const handlePrevPage = () => setPage((prev) => prev - 1);

  return (
    <div className="flex flex-col gap-4 py-6 px-3 rounded-lg">
      <Input placeholder="Search users..." className="max-w-96" />
      <DataTable columns={userColumns} data={data || []} />
      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 0 ? <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
        >
          Previous
        </Button> : null}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

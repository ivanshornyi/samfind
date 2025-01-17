import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import {
  Input,
  userColumns,
  Button,
} from "@/components";
import { DataTable } from "@/components/data-table";
import { useFindUsers } from "@/hooks";

export const UserManagementPage = () => {
  const [page, setPage] = useState<number>(0);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  const { register, watch } = useForm<{ search: string }>({ values: { search: "" } });
  const searchValue = watch("search");

  useEffect(() => {
    const handler = debounce((value: string) => {
      setDebouncedSearchValue(value);
    }, 300);

    handler(searchValue || "");

    return () => {
      handler.cancel();
    };
  }, [searchValue]);

  const { data } = useFindUsers(debouncedSearchValue, page * 10, 10);

  const handleNextPage = () => setPage((prev) => prev + 1);

  const handlePrevPage = () => setPage((prev) => prev - 1);

  return (
    <div className="flex flex-col gap-4 py-6 px-3 rounded-lg">
      <Input
        placeholder="Search users..."
        className="max-w-96"
        {...register("search")}
      />
      <DataTable columns={userColumns} data={data || []} />
      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 0 && (
          <Button variant="outline" size="sm" onClick={handlePrevPage}>
            Previous
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleNextPage}>
          Next
        </Button>
      </div>
    </div>
  );
};

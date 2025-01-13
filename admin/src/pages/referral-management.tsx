import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context";
import { useContext, useState } from "react";
import { Copy } from "lucide-react";
import { Button, DataTable } from "@/components";
import { useToast } from "@/hooks";
import { handleApiError } from "@/errors";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@shared/types";

const columns: ColumnDef<Partial<User>>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
];

const users: Partial<User>[] = [
  {
    id: "1",
    email: "wjeof@gmail.com",
    firstName: "Test",
    lastName: "Test",
  },
  {
    id: "2",
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: "3",
    email: "janedoe@example.com",
    firstName: "Jane",
    lastName: "Doe",
  },
  {
    id: "4",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Smith",
  },
  {
    id: "5",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Johnson",
  },
];

export const ReferralManagementPage = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const code = "8234u928";
  const link = import.meta.env.VITE_BASE_REFERRAL_URL + code;
  const [copied, setCopied] = useState<boolean>(false);

  const shareLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      toast({ description: "Link copied successfully!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            {user?.firstName} {user?.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center gap-4">
          <p className="text-blue-700">{code}</p>
          <Button onClick={shareLink} disabled={copied}>
            Copy
            <Copy />
          </Button>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

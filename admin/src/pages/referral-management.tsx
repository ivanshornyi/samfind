import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context";
import { useContext, useState } from "react";
import { Copy } from "lucide-react";
import { Button, DataTable } from "@/components";
import { useFindUserReferrals, useToast } from "@/hooks";
import { handleApiError } from "@/errors";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@shared/types";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

const columns: ColumnDef<User>[] = [
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

export const ReferralManagementPage = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const code = user?.referralCode;
  const link = import.meta.env.VITE_BASE_REFERRAL_URL + code;
  const [copied, setCopied] = useState<boolean>(false);

  const { data: users } = useFindUserReferrals(user?.id || "");

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
        <CardContent className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4">
            <p className="font-semibold">
              Referral code: <span className="text-blue-700">{code}</span>
            </p>
            <Button size="sm" onClick={shareLink} disabled={copied}>
              <Copy />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <FacebookShareButton url={link}>
              <FacebookIcon size={34} round />
            </FacebookShareButton>
            <TwitterShareButton url={link}>
              <TwitterIcon size={34} round />
            </TwitterShareButton>
            <TelegramShareButton url={link}>
              <TelegramIcon size={34} round />
            </TelegramShareButton>
            <LinkedinShareButton url={link}>
              <LinkedinIcon size={34} round />
            </LinkedinShareButton>
          </div>
          <CardDescription>Discount: {user?.discount}</CardDescription>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={users || []} />
    </div>
  );
};

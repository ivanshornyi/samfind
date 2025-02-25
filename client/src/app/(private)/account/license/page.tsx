"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetInvitedUserInfo,
  useGetUserLicenses,
  useGetUserRoleSubscriptionInfo,
  useToast,
} from "@/hooks";

import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  // Input,
  UserAccountTypeBox,
} from "@/components";

import { ReusableTable } from "@/components/table";
import { AuthContext } from "@/context";
import {
  CopyLinkButton,
  DeleteMember,
  InviteMember,
  ProgressChart,
} from "./_components";

import {
  ArrowUpDown,
  Check,
  Download,
  Info,
  MoreHorizontal,
  // Search,
} from "lucide-react";

const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

const headers = {
  name: "name",
  email: "email",
  date: "date of activation",
  access: "access rights",
  license: "license key",
};

interface LicenseItem {
  licenseId: string;
  userId?: string;
  icon?: string;
  name: string;
  email?: string;
  date?: string;
  access: string;
  activeLicenseId: string;
}

const columns: ColumnDef<LicenseItem>[] = [
  {
    accessorKey: "icon",
    header: () => <div className="w-[50px]" />,
    cell: ({ row }) => {
      const value: string = row.getValue(headers.name);

      return (
        <div
          className="
            flex justify-center items-center rounded-full 
            w-10 h-10 bg-input text-[24px] leading-[33px] 
            text-link-hover font-semibold
          "
        >
          {value[0]}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="text-disabled uppercase text-left pl-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{headers.name}</span>
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="text-disabled uppercase">{headers.email}</div>
    ),
    cell: ({ row }) => <div>{row.getValue(headers.email)}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        className="text-disabled uppercase text-left pl-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {headers.date}
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "access",
    header: () => {
      return (
        <div className="relative overflow-visible flex items-center gap-2 text-disabled uppercase">
          <span>{headers.access}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info style={{ width: "14px", height: "14px" }} />
              </TooltipTrigger>
              <TooltipContent className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] text-xs font-medium text-[#A8A8A8] normal-case">
                As an Owner, you can add other users to your group. You&apos;ll
                be responsible for covering their license fees.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("access") === "Owner" ? (
          <span className="text-blue-50">Owner</span>
        ) : (
          <span>Member</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <>
          {row.original.access === "Member" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-input border-none" align="end">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DeleteMember
                    activeLicenseId={row.original.activeLicenseId}
                    userName={row.original.name}
                    email={row.original.email}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </>
      );
    },
  },
];

const FREEMIUM_FEATURES = [
  {
    title: "Essential features",
  },
  {
    title: "Community access",
  },
  {
    title: "Basic support",
  },
];

const INVITED_USER_FEATURES = [
  {
    title: "Enhanced capabilities",
  },
  {
    title: "Priority updates",
  },
  {
    title: "Premium support",
  },
];

export default function License() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<LicenseItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data: userLicense, isPending: isUserLicensesPending } =
    useGetUserLicenses();

  const { data: userRoleSubscriptionInfo } = useGetUserRoleSubscriptionInfo();

  const { data: invitedUserData } = useGetInvitedUserInfo();

  const itemsPerPage = 10;
  const pageCount = Math.ceil((userLicense?.users?.length ?? 0) / itemsPerPage);

  const handleCopyInvitation = () => {
    if (user && userRoleSubscriptionInfo) {
      let link = `${frontendDomain}/auth/sign-up?accountType=private`;

      if (user.organizationId) {
        link = `${link}&orgId=${user.organizationId}`;
      }

      if (userLicense && !userRoleSubscriptionInfo.organizationOwner) {
        link = `${link}&lId=${userLicense.id}`;
      }

      navigator.clipboard.writeText(link);

      toast({
        description: "Copied",
        variant: "success",
      });
    }
  };

  useEffect(() => {
    if (userLicense?.users && user) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const selectedUsers = userLicense.users
        .slice(startIndex, endIndex)
        .map((u) => ({
          licenseId: userLicense.id,
          userId: u.memberId,
          name: u.name,
          email: u.email,
          date: new Intl.DateTimeFormat("ru-RU").format(new Date(u.date)),
          access: u.email === user?.email ? "Owner" : "Member",
          activeLicenseId: u.licenseId,
        }));

      setUsers([...selectedUsers]);
    }
  }, [userLicense, currentPage, user]);

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="w-full">
        <h2 className="text-[32px] leading-[44px] font-semibold">
          License management
        </h2>

        {!userRoleSubscriptionInfo?.freemiumUser && (
          <>
            {userLicense &&
              !isUserLicensesPending &&
              !isUserLicensesPending && (
                <>
                  <div className="mt-6 flex flex-wrap gap-2 justify-between items-end">
                    <ProgressChart
                      currentMembers={userLicense.users.length}
                      maxMembers={
                        userLicense.limit > userLicense.users.length
                          ? userLicense.limit
                          : userLicense.users.length
                      }
                    />
                    <div className="flex items-center gap-6">
                      <CopyLinkButton
                        handleCopyInvitation={handleCopyInvitation}
                      />
                      <InviteMember
                        allowedMembers={userLicense.limit}
                        handleCopyInvitation={handleCopyInvitation}
                      />
                    </div>
                  </div>
                  {/* <div className="flex items-center justify-end py-4">
                    <div className="w-full relative sm:w-[308px]">
                      <Input
                        placeholder="Search"
                        value={
                          (table
                            .getColumn("name")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                        }
                        className="bg-card"
                      />
                      <div className="absolute right-6 top-0 h-full flex justify-center items-center">
                        <Search size={24} />
                      </div>
                    </div>
                  </div> */}
                  <ReusableTable
                    table={table}
                    isLoading={isUserLicensesPending}
                    onPageChange={(page: number) => {
                      setCurrentPage(page);
                    }}
                    pageCount={pageCount}
                    noDataMessage="No licenses found."
                  />
                </>
              )}
          </>
        )}

        {userRoleSubscriptionInfo?.organizationOwner && !userLicense && (
          <>
            <div
              className="
                flex justify-between items-center rounded-[20px] 
                p-6 mt-[60px]
                bg-gradient-to-r from-transparent to-violet-600
              "
            >
              <div>
                <h2 className="text-xl font-semibold">
                  Upgrade your subscription and unlock more features!
                </h2>
                <p>
                  Boost your capabilities with premium features and priority
                  support.
                </p>
              </div>
              <Link href="/account/billing-data">
                <Button variant="tetrary">Get started</Button>
              </Link>
            </div>
          </>
        )}

        {userRoleSubscriptionInfo?.freemiumUser && (
          <>
            <div className="flex flex-col gap-[32px] mt-[60px] w-full max-w-[742px]">
              <div className="flex flex-col sm:flex-row justify-between items-center rounded-[20px] p-6 bg-gradient-to-r from-transparent to-violet-600 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-center sm:text-left">
                    Upgrade your subscription and unlock more features!
                  </h2>
                  <p className="text-center sm:text-left">
                    Boost your capabilities with premium features and priority
                    support.
                  </p>
                </div>
                <Link href="/account/billing-data">
                  <Button variant="tetrary" className="w-full sm:w-auto">
                    Get started
                  </Button>
                </Link>
              </div>

              <UserAccountTypeBox />

              <div>
                <p className="text-xl">Plan</p>

                <div className="border-b border-card py-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <p className="text-lg">Freemium</p>
                      <span className="bg-green-500/5 p-2 px-4 text-xs text-green-600 rounded-full">
                        Active subscription
                      </span>
                    </div>
                    <Link href="/account/billing-data" className="underline">
                      Upgrade
                    </Link>
                  </div>
                </div>

                <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-8">
                  {FREEMIUM_FEATURES.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check size={16} className="text-violet-50 shrink-0" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {userRoleSubscriptionInfo?.invitedUser && (
          <div className="mt-4">
            <UserAccountTypeBox />

            <div className="flex flex-wrap gap-3 justify-between items-start mt-4">
              <div className="p-4 rounded-lg bg-card w-full sm:w-[330px]">
                <p>
                  You have joined the workspace of the company{" "}
                  <span className="capitalize text-blue-50">{`${invitedUserData?.licenseOwner.organizationName ? `company ${invitedUserData?.licenseOwner.organizationName}` : `user ${invitedUserData?.licenseOwner.firstName} ${invitedUserData?.licenseOwner.lastName}`} `}</span>
                  and use access to the license.
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {INVITED_USER_FEATURES.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <Check size={20} className="text-violet-50" />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-2xl">Plan</p>
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <p className="capitalize text-lg">
                    {invitedUserData?.license.tierType}
                  </p>
                  <span
                    className={`bg-green-500/5 p-2 px-4 text-xs  ${
                      userRoleSubscriptionInfo.deletedMember
                        ? "text-[#FF5252]"
                        : "text-green-600"
                    }  rounded-full`}
                  >
                    {userRoleSubscriptionInfo.deletedMember
                      ? "Inactive subscription"
                      : "Active subscription"}
                  </span>
                </div>

                {/* <p className="opacity-50 mt-2">Renews {invitedUserData?.license?.updatedAt && formatDate(invitedUserData.license.updatedAt)}</p> */}
                {!userRoleSubscriptionInfo.deletedMember && (
                  <Button
                    className="mt-4 w-[200px]"
                    variant="secondary"
                    leftIcon={<Download />}
                    onClick={() => router.push("/download-app")}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

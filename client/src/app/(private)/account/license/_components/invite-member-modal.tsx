import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context";

import { useQuery } from "@tanstack/react-query";
import {
  useUpdateOrganization,
  useUpdateUserLicense,
  useGetUserLicenses,
} from "@/hooks";
import { OrganizationApiService, UserLicenseApiService } from "@/services";

import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  Input,
} from "@/components";

import { useToast } from "@/hooks";

import { Send, X, Info } from "lucide-react";
import { UserAccountType } from "@/types";
import { CopyLinkButton } from "./cpy-link-button";

interface InviteMemberProps {
  allowedMembers: number;
  handleCopyInvitation: () => void;
}

export const InviteMember = ({ handleCopyInvitation }: InviteMemberProps) => {
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [domain, setDomain] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toast } = useToast();

  const {
    mutate: updateUserLicenseMutation,
    isPending: isUserLicenseUpdatePending,
    isSuccess: isUserLicenseUpdateSuccess,
  } = useUpdateUserLicense();
  const {
    mutate: updateOrganizationMutation,
    isPending: isUpdateOrganizationPending,
  } = useUpdateOrganization();

  const { data: userLicense } = useGetUserLicenses();

  const { data: userLicenseData } = useQuery({
    queryFn: () =>
      userLicense?.id
        ? UserLicenseApiService.getUserLicense(userLicense?.id)
        : null,
    queryKey: ["user-license"],
    enabled: !!userLicense?.id,
  });

  const { data: userOrganization } = useQuery({
    queryFn: () =>
      user?.organizationId
        ? OrganizationApiService.getOrganization(user.organizationId)
        : null,
    queryKey: ["organization"],
    enabled: !!user?.organizationId,
  });

  const removeEmail = (emailToRemove: string) => {
    setEmails((prevEmails) =>
      prevEmails.filter((email) => email !== emailToRemove)
    );
  };

  const removeDomain = (domainToRemove: string) => {
    setDomains((prevDomains) =>
      prevDomains.filter((domain) => domain !== domainToRemove)
    );
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast({
        description: "Please enter a valid email address.",
      });

      return;
    }

    if (emails.some((e) => e === email)) {
      toast({
        description: "Email already in list.",
      });

      return;
    }

    setEmails((prevEmails) => [...prevEmails, email]);
    setEmail("");
  };

  const addDomain = () => {
    if (domains.some((e) => e === domain)) {
      toast({
        description: "Domain already in list.",
      });

      return;
    }

    setDomains((prevDomains) => [...prevDomains, domain]);
    setDomain("");
  };

  const handleAddEmails = () => {
    if (user) {
      // business
      if (user.organizationId) {
        updateOrganizationMutation({
          id: user.organizationId,
          organizationData: { availableEmails: emails, domains },
        });
      }

      // private
      if (userLicense) {
        updateUserLicenseMutation({
          id: userLicense.id,
          licenseData: { availableEmails: emails },
        });
      }
    }
  };

  useEffect(() => {
    if (userLicenseData) {
      setEmails([...userLicenseData.availableEmails]);
    }
  }, [userLicenseData]);

  useEffect(() => {
    if (userOrganization) {
      setEmails([...userOrganization.availableEmails]);
      setDomains(userOrganization.domains);
    }
  }, [userOrganization]);

  useEffect(() => {
    if (isUserLicenseUpdateSuccess) {
      setIsModalOpen(false);
    }
  }, [isUserLicenseUpdateSuccess]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="purple"
          leftIcon={<Send />}
          onClick={() => setIsModalOpen(true)}
        >
          Invite members
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px] max-h-[95vh] overflow-y-auto">
        <div className="absolute right-1 top-1">
          <AlertDialogCancel
            onClick={() => setIsModalOpen(false)}
            className="shadow-none border-none p-3"
          >
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px] leading-[33px] font-semibold">
            Invite members
          </AlertDialogTitle>
          {/* <AlertDialogDescription className="text-[16px] leading-[22px] p-[10px] px-6 text-link-hover flex gap-2 items-center">
            <Info size={14} />
            <span>
              You can add {allowedMembers - emails.length} more members on your
              plan.
            </span>
          </AlertDialogDescription> */}
        </AlertDialogHeader>

        <div className="my-4 flex items-center gap-2 rounded-2xl px-4 py-2">
          <Info color="#BEB8FF" />
          <p className="text-[#BEB8FF]">
            If you invite more users than the number of licenses you’ve paid
            for, you’ll be charged for the extra ones automatically after they
            join.
          </p>
        </div>

        {user?.accountType === UserAccountType.Business ? (
          <>
            <div className="flex justify-between">
              <p className="font-bold">Invite members in your domain:</p>
              <CopyLinkButton handleCopyInvitation={handleCopyInvitation} />
            </div>
            <ol className="list-lower-alpha space-y-2 pl-6 mt-2 text-[16px] leading-[22px] text-disabled font-medium">
              <li>
                a. All email addresses{" "}
                <span className="text-white">
                  must match your domain to gain access!
                </span>
              </li>
              <li>b. Copy invitation link and share with members</li>
              <li>c. Once registered, they will gain access.</li>
            </ol>
            {domains.length ? (
              <div className="mt-3">
                <p className="text-[16px] leading-[22px] text-link-hover">
                  Added domains
                </p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {domains.map((domain) => (
                    <div
                      key={domain}
                      className="text-[14px] leading-[19px] font-medium p-2 px-4 flex items-center gap-2 bg-input rounded-[30px]"
                    >
                      <span>{domain}</span>
                      <X
                        onClick={() => removeDomain(domain)}
                        className="cursor-pointer text-disabled hover:text-light"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 mt-2 md:flex-nowrap">
              <Input
                placeholder="Enter domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                className="bg-card"
              />
              <Button
                variant="saveProfile"
                onClick={addDomain}
                disabled={!domain.length}
              >
                Add domain
              </Button>
            </div>
          </>
        ) : null}

        <div className="flex justify-between">
          <p className="font-bold">Invite members by email:</p>
        </div>
        <ol className="list-lower-alpha space-y-2 pl-6 mt-2 text-[16px] leading-[22px] text-disabled font-medium">
          <li>a. Add emails manually</li>
          <li>b. They must register using this link</li>
          <li>c. Once registered, they will gain access</li>
        </ol>

        {emails.length ? (
          <div className="mt-3">
            <p className="text-[16px] leading-[22px] text-link-hover">
              Added emails
            </p>
            <div className="flex gap-2 flex-wrap mt-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="text-[14px] leading-[19px] font-medium p-2 px-4 flex items-center gap-2 bg-input rounded-[30px]"
                >
                  <span>{email}</span>
                  <X
                    onClick={() => removeEmail(email)}
                    className="cursor-pointer text-disabled hover:text-light"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* {allowedMembers <= emails.length ? (
          <p className="mt-4 text-[#FF7676] text-[12px] leading-[16px]">
            You have reached the limit for adding new members
          </p>
        ) : null} */}

        <div className="flex flex-wrap gap-2 mt-2 md:flex-nowrap">
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-card"
          />
          <Button
            variant="saveProfile"
            onClick={addEmail}
            disabled={!email.length}
          >
            Add email
          </Button>
        </div>

        <AlertDialogFooter className="flex gap-6 w-full">
          <Button
            onClick={handleAddEmails}
            variant="purple"
            className="w-full"
            withLoader
            loading={isUpdateOrganizationPending || isUserLicenseUpdatePending}
            disabled={
              // (emails.length <= 0 && domains.length <= 0) ||
              isUpdateOrganizationPending || isUserLicenseUpdatePending
            }
          >
            Update/Send invitations
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

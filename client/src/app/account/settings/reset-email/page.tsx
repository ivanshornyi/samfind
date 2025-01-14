"use client";

import React, { useContext, useEffect, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { AuthContext } from "@/context";

import { useUpdateUserEmail } from "@/hooks";

import { Card, Button, Input } from "@/components";

export default function ResetEmail() {
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [verificationCode, setVerificationCode] = useState("");

  const { mutate: updateUserEmailMutation, isPending: isUpdatePending } =
    useUpdateUserEmail();

  const handleVerificationCodeSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (user) {
      updateUserEmailMutation({
        userId: user.id,
        verificationCode,
        newEmail: searchParams.get("email")!,
      });
    }
  };

  useEffect(() => {
    if (!searchParams.get("email")) router.push("/");
  }, [searchParams, router]);

  return (
    <div>
      <Card className="py-6 px-8 rounded-2xl w-[300px] mt-[200px] mx-auto">
        <p className="text-lg">Confirm verification code</p>
        <form onSubmit={handleVerificationCodeSubmit} className="mt-3">
          <div>
            <Input
              className="text-center py-5"
              maxLength={6}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
            />
          </div>

          <Button
            className="w-full mt-3 py-5"
            withLoader={true}
            loading={isUpdatePending}
          >
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useResetPassword, useSignIn, useSignUp, useToast } from "@/hooks";

import { UserAuthType } from "@/services";

import { Button, Input } from "@/components";
import { SendVerificationCodeModal } from "./send-verification-code-modal";

import { EyeIcon, EyeOff } from "lucide-react";

interface AuthFormProps {
  authPageType: "signIn" | "signUp" | "resetPassword";
}

export const AuthForm: React.FC<AuthFormProps> = ({ authPageType }) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    verificationCode: "",
    newPassword: "",
  });

  const { mutate: signInMutation, isPending: isSignInPending } = useSignIn();
  const { mutate: signUpMutation, isPending: isSignUpPending } = useSignUp();
  const { mutate: resetPasswordMutation, isPending: isResetPasswordPending } =
    useResetPassword();

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const handleResetPasswordFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setResetPasswordFormData({ ...resetPasswordFormData, [name]: value });
  };

  const handlePasswordInputTypeChange = () => {
    if (passwordInputType === "text") {
      setPasswordInputType("password");
    } else {
      setPasswordInputType("text");
    }
  };

  const handleAuthFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (authPageType === "signIn") {
      if (formData.email === "" || formData.password === "") {
        toast({
          description: "Some fields are empty",
        });

        return;
      }

      signInMutation({
        email: formData.email,
        password: formData.password.trim(),
        authType: UserAuthType.Email,
      });
    }

    if (authPageType === "signUp") {
      if (
        formData.firstName === "" ||
        formData.email === "" ||
        formData.password === ""
      ) {
        toast({
          description: "Some fields are empty",
        });

        return;
      }

      signUpMutation({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        authType: UserAuthType.Email,
      });
    }

    if (authPageType === "resetPassword") {
      if (
        resetPasswordFormData.newPassword === "" ||
        resetPasswordFormData.verificationCode === ""
      ) {
        toast({
          description: "Some fields are empty",
        });

        return;
      }

      const recoveryEmail = searchParams.get("recoveryEmail");

      resetPasswordMutation({
        email: recoveryEmail ?? "",
        verificationCode: resetPasswordFormData.verificationCode,
        newPassword: resetPasswordFormData.newPassword.trim(),
      });
    }
  };

  const formTitle = {
    signIn: "Log in",
    signUp: "Sign Up",
    resetPassword: "Password recovery",
  };

  const formSubtitle = {
    signIn: "Welcome back! Access your personalized experience",
    signUp: "Join the innovation! You&apos;re almost there!",
    resetPassword: "",
  };

  const disabledFormItems =
    isSignInPending || isSignUpPending || isResetPasswordPending;

  useEffect(() => {
    const referralCode = searchParams.get("userReferralCode");
    const token = localStorage.getItem("accessToken");

    if (referralCode && !token) {
      localStorage.setItem("userReferralCode", referralCode);
    }
  }, [searchParams]);

  return (
    <>
      <div className="w-full max-w-[591px] rounded-[30px] border-[1px] border-solid border-[#A64CE8] p-8 shadow-lg mt-20">
        <form onSubmit={handleAuthFormSubmit}>
          <h2 className="font-semibold text-[32px] leading-[43.71px] mb-4">{formTitle[authPageType]}</h2>
          <h3 className="font-normal text-xl">{formSubtitle[authPageType]}</h3>

          <div className="mt-3 flex flex-col gap-2">
            {authPageType === "signUp" && (
              <>
                <div>
                  <label htmlFor="firstName" className="text-sm">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleFormInputChange}
                    className="py-6 px-3 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleFormInputChange}
                    className="py-6 px-3 rounded-lg"
                  />
                </div>
              </>
            )}

            {authPageType === "resetPassword" && (
              <>
                <div>
                  <label htmlFor="verificationCode" className="text-sm">
                    Verification code
                  </label>
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    placeholder="Enter verification code"
                    value={resetPasswordFormData.verificationCode}
                    onChange={handleResetPasswordFormInputChange}
                    className="py-6 px-3 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="text-sm">
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    placeholder="Your new password"
                    type="password"
                    value={resetPasswordFormData.newPassword}
                    onChange={handleResetPasswordFormInputChange}
                    className="py-6 px-3 rounded-lg"
                  />
                </div>
              </>
            )}

            {authPageType !== "resetPassword" && (
              <>
                <div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleFormInputChange}
                    className="px-6 h-[44px] rounded-[30px]"
                  />
                </div>
                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      type={passwordInputType}
                      value={formData.password}
                      onChange={handleFormInputChange}
                      className="px-6 h-[44px] rounded-[30px]"
                    />

                    <button
                      type="button"
                      disabled={disabledFormItems}
                      onClick={handlePasswordInputTypeChange}
                      className="
                        absolute top-1 right-1 inset-y-1 p-3
                        rounded-r-xl
                      "
                    >
                      {passwordInputType === "password" ? (
                        <EyeOff strokeWidth={1.5} size={20} />
                      ) : (
                        <EyeIcon strokeWidth={1.5} size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button
            className="mt-4 h-[44px] w-full rounded-[30px] bg-[#363637]"
            withLoader={true}
            loading={disabledFormItems}
            disabled={disabledFormItems}
            variant="secondary"
          >
            {authPageType !== "resetPassword" ? (
              <span>Continue</span>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </form>

        <div className="pt-4">
          {authPageType === "signIn" && (
            <>
              <p className="text-sm">
                <span>Dont have an account? </span>
                <Link
                  href="/auth/sign-up"
                  className="text-blue-400 hover:opacity-80"
                >
                  Sign up
                </Link>
              </p>

              <SendVerificationCodeModal />
            </>
          )}

          {authPageType === "signUp" && (
            <p className="text-sm">
              <span>Already have an account? </span>
              <Link
                href="/auth/sign-in"
                className="text-blue-400 hover:opacity-80"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

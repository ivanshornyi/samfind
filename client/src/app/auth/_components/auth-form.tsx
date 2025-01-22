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
      <div className="w-[591px] border-[1px] border-violet-100 rounded-[30px] p-8">
        <form onSubmit={handleAuthFormSubmit}>
          <h2 className="font-semibold text-3xl">{formTitle[authPageType]}</h2>
          {authPageType === "signIn" && (
            <p className="mt-4">
              Welcome back! Access your personalized experience
            </p>
          )}
          {authPageType === "signUp" && (
            <p className="mt-4">Join the innovation! You’re almost there!</p>
          )}

          <div className="mt-8 flex flex-col gap-2">
            {authPageType === "signUp" && (
              <>
                <div>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleFormInputChange}
                  />
                </div>
                <div>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleFormInputChange}
                  />
                </div>
              </>
            )}

            {authPageType === "resetPassword" && (
              <>
                <div>
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    placeholder="Verification code"
                    value={resetPasswordFormData.verificationCode}
                    onChange={handleResetPasswordFormInputChange}
                  />
                </div>
                <div>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    placeholder="Your new password"
                    type="password"
                    value={resetPasswordFormData.newPassword}
                    onChange={handleResetPasswordFormInputChange}
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
                  />
                </div>
                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Password"
                      type={passwordInputType}
                      value={formData.password}
                      onChange={handleFormInputChange}
                    />

                    <button
                      type="button"
                      disabled={disabledFormItems}
                      onClick={handlePasswordInputTypeChange}
                      className="
                        absolute top-0 right-1 inset-y-1 p-3
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
            variant="secondary"
            className="mt-5 w-full"
            withLoader={true}
            loading={disabledFormItems}
            disabled={disabledFormItems}
          >
            {authPageType !== "resetPassword" ? (
              <span>Continue</span>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </form>

        <div className="pt-4">
          {authPageType === "signIn" && <SendVerificationCodeModal />}

          <p className="text-center my-5">Or</p>

          {authPageType !== "resetPassword" && (
            <div className="flex flex-col gap-2">
              <button className="py-2.5 bg-white text-black rounded-full">
                Sign in with Google
              </button>
              <button className="py-2.5 bg-white text-black rounded-full">
                Sign in with Github
              </button>
            </div>
          )}

          {authPageType === "signIn" && (
            <p className="text-sm text-center mt-3">
              <span>Not a member yet? </span>
              <Link
                href="/auth/sign-up"
                className="font-semibold underline hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          )}

          {authPageType === "signUp" && (
            <p className="text-sm text-center mt-3">
              <span>Already have an account? </span>
              <Link
                href="/auth/sign-in"
                className="font-semibold underline hover:opacity-80"
              >
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

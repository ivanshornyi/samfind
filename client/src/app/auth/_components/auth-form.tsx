"use client";

import React, { useContext, useEffect, useState } from "react";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { AuthContext } from "@/context";

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
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);

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

    const emptyFieldsMessage = toast({
      description: "Some fields are empty",
    });

    if (authPageType === "signIn") {
      if (formData.email === "" || formData.password === "") {
        emptyFieldsMessage;

        return;
      }

      signInMutation({
        email: formData.email,
        password: formData.password,
        authType: UserAuthType.Email,
      });
    }

    if (authPageType === "signUp") {
      if (
        formData.firstName === "" ||
        formData.email === "" ||
        formData.password === ""
      ) {
        emptyFieldsMessage;

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
        emptyFieldsMessage;

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
    signIn: "Sign In",
    signUp: "Sign Up",
    resetPassword: "Password recovery",
  };

  const disabledFormItems =
    isSignInPending || isSignUpPending || isResetPasswordPending;

  return (
    <>
      <div className="w-96 border-[1px] rounded-2xl px-10 py-8 shadow-lg bg-card mt-20">
        <form onSubmit={handleAuthFormSubmit}>
          <h2 className="font-semibold text-xl">{formTitle[authPageType]}</h2>

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
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleFormInputChange}
                    className="py-6 px-3 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      type={passwordInputType}
                      value={formData.password}
                      onChange={handleFormInputChange}
                      className="py-6 px-3 rounded-lg"
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
            className="mt-4 p-6 w-full rounded-lg"
            withLoader={true}
            loading={disabledFormItems}
            disabled={disabledFormItems}
          >
            {authPageType !== "resetPassword" ? (
              <span>Submit</span>
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

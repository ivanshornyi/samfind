"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { UserAccountType } from "@/types";

import {
  useGetUserOrganizationName,
  useGetUserName,
  useResetPassword,
  useSignIn,
  useSignUp,
  useToast,
} from "@/hooks";

import { SignUpData, UserAuthType } from "@/services";

import { Button, Input } from "@/components";
import { SendResetPasswordCodeModal, VerifyUserModal } from "../_components";
import { ACCOUNT_TYPE_CARD_ITEMS } from "../account-type/data";

import { Building2, Check, EyeIcon, EyeOff, Hash, Info, X } from "lucide-react";

interface AuthFormProps {
  authPageType: "signIn" | "signUp" | "resetPassword";
}

const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);

  return {
    minLength,
    hasNumber,
    hasUpperCase,
    hasLowerCase,
    isValid: minLength && hasNumber && hasUpperCase && hasLowerCase,
  };
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const options = [
  { name: "Yes", value: "yes" },
  { name: "No", value: "no" },
];

export const AuthForm: React.FC<AuthFormProps> = ({ authPageType }) => {
  const { toast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = searchParams.get("accountType") as UserAccountType;
  const referralCode = searchParams.get("userReferralCode");
  const licenseId = searchParams.get("lId");
  const organizationId = searchParams.get("orgId");
  const redirectUrl = searchParams.get("redirect");
  const backendUrl = searchParams.get("backend");

  const { data: organizationName } = useGetUserOrganizationName(organizationId);
  const { data: userName } = useGetUserName(licenseId);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    norwayValue: "",
  });
  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    verificationCode: "",
    newPassword: "",
  });

  const [organizationFormData, setOrganizationFormData] = useState({
    name: "",
    businessOrganizationNumber: "",
    VAT: "",
    domains: [""],
  });

  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    isValid: false,
  });

  const { mutate: signInMutation, isPending: isSignInPending } = useSignIn();
  const {
    mutate: signUpMutation,
    isPending: isSignUpPending,
    isSuccess: isSignUpSuccess,
  } = useSignUp();
  const { mutate: resetPasswordMutation, isPending: isResetPasswordPending } =
    useResetPassword();

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleResetPasswordFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setResetPasswordFormData({ ...resetPasswordFormData, [name]: value });
  };

  const handleOrganizationFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "domain") {
      setOrganizationFormData((prev) => {
        const newDomains = [...prev.domains];
        newDomains[index!] = value;
        return { ...prev, domains: newDomains };
      });
    } else {
      setOrganizationFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const addDomainField = () => {
  //   setOrganizationFormData((prev) => ({
  //     ...prev,
  //     domains: [...prev.domains, ""],
  //   }));
  // };

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
        signInRedirect: redirectUrl,
        backendLink: backendUrl,
      });
    }

    if (authPageType === "signUp") {
      if (
        formData.firstName === "" ||
        formData.email === "" ||
        formData.password === "" ||
        formData.norwayValue === ""
      ) {
        toast({
          description: "Some fields are empty",
        });

        return;
      }

      if (!validateEmail(formData.email)) {
        toast({
          description: "Invalid email address",
        });
        return;
      }

      if (!passwordValidation.isValid) {
        setShowPasswordError(true);
        return;
      }

      let signUpData: SignUpData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        authType: UserAuthType.Email,
        accountType,
        isFromNorway: formData.norwayValue === "yes",
      };

      if (referralCode) {
        signUpData = {
          ...signUpData,
          invitedReferralCode: Number(referralCode),
        };
      }

      if (accountType === UserAccountType.Business) {
        if (organizationFormData.name === "") {
          toast({
            description: "Some fields are empty",
          });

          return;
        }

        const organization = {
          name: organizationFormData.name,
          VAT: organizationFormData.VAT,
          businessOrganizationNumber:
            organizationFormData.businessOrganizationNumber,
          domains: organizationFormData.domains.filter(
            (domain) => domain.trim() !== ""
          ),
        };

        signUpData = {
          ...signUpData,
          organization,
        };
      }

      signUpMutation(signUpData);
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

  const formDescription = {
    signIn: "Welcome back! Access your personalized experience",
    signUp: "Join the innovation! You're almost there!",
    resetPassword:
      "Set a secure password to protect your account and ensure safe access.",
  };

  const disabledFormItems =
    isSignInPending || isSignUpPending || isResetPasswordPending;

  useEffect(() => {
    const referralCode = searchParams.get("userReferralCode");
    const token = localStorage.getItem("accessToken");

    if (referralCode && !token) {
      localStorage.setItem("userReferralCode", referralCode);
    }

    if (
      authPageType === "signUp" &&
      (!accountType ||
        ![UserAccountType.Private, UserAccountType.Business].includes(
          accountType
        ))
    ) {
      router.push("/");
    }
  }, [searchParams, accountType]);

  useEffect(() => {
    if (isSignUpSuccess) localStorage.removeItem("referralCode");
  }, [isSignUpSuccess]);

  return (
    <>
      <div className="w-[591px] border-[1px] border-violet-100 rounded-[30px] p-8">
        {authPageType === "signUp" && (
          <ul>
            {ACCOUNT_TYPE_CARD_ITEMS.map((item) => {
              return item.type === accountType ? (
                <li
                  key={item.type}
                  className="
                    capitalize text-violet-50 font-semibold bg-background
                    rounded-full px-6 py-2 w-[208px] flex items-center justify-center gap-2
                    [&>svg]:w-3.5 [&>svg]:h-3.5
                  "
                >
                  {item.icon}
                  <span>
                    {accountType === "private" ? "personal" : "business"}{" "}
                    Account
                  </span>
                </li>
              ) : null;
            })}
          </ul>
        )}

        <form onSubmit={handleAuthFormSubmit} className="mt-4">
          <h2 className="font-semibold text-3xl">{formTitle[authPageType]}</h2>
          <p className="mt-4 text-lg">
            {userName || organizationName
              ? "Join the innovation! You’re almost there! Use the email to which you were sent the invitation."
              : formDescription[authPageType]}
          </p>
          {authPageType === "signUp" && referralCode && (
            <div className="my-4 flex items-center gap-2 bg-[#363637] rounded-2xl px-4 py-2">
              <Info color="#BEB8FF" />
              <p className="text-[#BEB8FF]">
                You&apos;ve got a 10% bonus via referral link!
              </p>
            </div>
          )}

          {authPageType === "signUp" && (userName || organizationName) && (
            <div className="my-4 flex items-center gap-2 bg-[#363637] rounded-2xl px-4 py-2">
              <Info color="#BEB8FF" />
              <p className="text-[#BEB8FF]">
                You have been invited to join the workspace of the company
                {` ${userName?.name || organizationName?.name}`} and use access
                to the license. Create the account to continue.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-2">
            {authPageType === "signUp" && (
              <>
                <div className="flex gap-2">
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleFormInputChange}
                  />
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
                  {authPageType === "signUp" && (
                    <div>
                      <p className="mt-4 text-lg">
                        {accountType === UserAccountType.Business
                          ? "Is your company from Norway / Er dette et norsk selskap?"
                          : "Are you currently living in Norway / Bor du i Norge?"}
                      </p>
                      <div className="flex gap-4 mt-4">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="norwayValue"
                              value={option.value}
                              checked={formData.norwayValue === option.value}
                              onChange={handleFormInputChange}
                              className="peer hidden"
                            />
                            <div className="w-5 h-5 border-2 border-[#A64CE8] rounded-full flex items-center justify-center ">
                              <div
                                className={`w-2.5 h-2.5 ${formData.norwayValue === option.value ? "bg-[#A64CE8]" : "bg-transparent"} rounded-full peer-checked:bg-transparent`}
                              ></div>
                            </div>
                            <span className="peer-checked:text-[#A64CE8] text-[16px] leading-[22px] font-semibold">
                              {option.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {showPasswordError ? (
                    <div className="text-xs mt-2">
                      <p className="font-normal">
                        Your password must include:.
                      </p>
                      <ul className="text-xs">
                        <li
                          className={`flex items-center gap-2 ${passwordValidation.minLength ? "text-green-500" : "text-red-500"}`}
                        >
                          {passwordValidation.minLength ? (
                            <Check style={{ width: "10px", height: "10px" }} />
                          ) : (
                            <X style={{ width: "10px", height: "10px" }} />
                          )}{" "}
                          Password strenghts:{" "}
                          {passwordValidation.isValid ? "strong" : "weak"}
                        </li>
                        <li
                          className={`flex items-center gap-2 ${passwordValidation.minLength ? "text-green-500" : "text-red-500"}`}
                        >
                          {passwordValidation.minLength ? (
                            <Check style={{ width: "10px", height: "10px" }} />
                          ) : (
                            <X style={{ width: "10px", height: "10px" }} />
                          )}{" "}
                          At least 8 characters
                        </li>
                        <li
                          className={`flex items-center gap-2 ${passwordValidation.hasNumber ? "text-green-500" : "text-red-500"}`}
                        >
                          {passwordValidation.hasNumber ? (
                            <Check style={{ width: "10px", height: "10px" }} />
                          ) : (
                            <X style={{ width: "10px", height: "10px" }} />
                          )}{" "}
                          At least one number (0-9).
                        </li>
                        <li
                          className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? "text-green-500" : "text-red-500"}`}
                        >
                          {passwordValidation.hasUpperCase ? (
                            <Check style={{ width: "10px", height: "10px" }} />
                          ) : (
                            <X style={{ width: "10px", height: "10px" }} />
                          )}{" "}
                          At least one uppercase letter (A-Z).
                        </li>
                        <li
                          className={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? "text-green-500" : "text-red-500"}`}
                        >
                          {passwordValidation.hasLowerCase ? (
                            <Check style={{ width: "10px", height: "10px" }} />
                          ) : (
                            <X style={{ width: "10px", height: "10px" }} />
                          )}{" "}
                          At least one lowercase letter (a-z).
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {authPageType === "signUp" &&
            accountType === UserAccountType.Business && (
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">Company details</h3>

                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input
                        name="name"
                        placeholder="Company name (required)"
                        value={organizationFormData.name}
                        onChange={handleOrganizationFormInputChange}
                        className="pl-11"
                      />
                      <Building2
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Input
                          name="businessOrganizationNumber"
                          placeholder="Business registration No."
                          value={
                            organizationFormData.businessOrganizationNumber
                          }
                          onChange={handleOrganizationFormInputChange}
                          className="pl-11"
                        />
                        <Hash
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>

                      <div className="relative flex-1">
                        <Input
                          name="VAT"
                          placeholder="VAT number"
                          value={organizationFormData.VAT}
                          onChange={handleOrganizationFormInputChange}
                          className="pl-11"
                        />
                        <Hash
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* {organizationFormData.domains.map((domain, index) => (
                      <div key={index} className="relative">
                        <Input
                          name="domain"
                          placeholder="Domain"
                          value={domain}
                          onChange={(e) =>
                            handleOrganizationFormInputChange(e, index)
                          }
                          className="pl-11"
                        />
                        <Globe
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>
                    ))} */}

                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={addDomainField}
                      className="w-fit px-4"
                    >
                      Add another domain
                    </Button> */}
                  </div>
                </div>
              </div>
            )}

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

        {authPageType === "signUp" ? (
          <p className="text-lg mt-4 text-center">
            By continuing, I agree to the{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        ) : null}

        <div className="pt-4">
          {authPageType === "signIn" && <SendResetPasswordCodeModal />}

          {authPageType === "signIn" && (
            <p className="text-sm text-center mt-3">
              <span>Not a member yet? </span>
              <Link
                href="/auth/account-type"
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

      {authPageType === "signUp" && (
        <VerifyUserModal isOpen={isSignUpSuccess} email={formData.email} />
      )}
    </>
  );
};

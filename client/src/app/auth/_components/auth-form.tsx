"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { UserAccountType } from "@/types";

import { useResetPassword, useSignIn, useSignUp, useToast } from "@/hooks";

import { SignUpData, UserAuthType } from "@/services";

import { Button, Input } from "@/components";
import { SendResetPasswordCodeModal, VerifyUserModal } from "../_components";
import { ACCOUNT_TYPE_CARD_ITEMS } from "../account-type/data";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { GoogleIcon } from "@public/icons";
import { EyeIcon, EyeOff, Info } from "lucide-react";

interface AuthFormProps {
  authPageType: "signIn" | "signUp" | "resetPassword";
}

export const AuthForm: React.FC<AuthFormProps> = ({ authPageType }) => {
  const { toast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = searchParams.get("accountType") as UserAccountType;
  const referralCode = searchParams.get("userReferralCode");

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

  const [organizationFormData, setOrganizationFormData] = useState({
    name: "",
    businessOrganizationNumber: "",
    VAT: "",
    domain: "",
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

  const handleOrganizationFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setOrganizationFormData({ ...organizationFormData, [name]: value });
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

      let signUpData: SignUpData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        authType: UserAuthType.Email,
        accountType,
      };

      if (referralCode) {
        signUpData = {
          ...signUpData,
          invitedReferralCode: Number(referralCode),
        };
      }

      if (accountType === UserAccountType.Business) {
        if (
          organizationFormData.name === "" ||
          organizationFormData.businessOrganizationNumber === "" ||
          organizationFormData.VAT === ""
        ) {
          toast({
            description: "Some fields are empty",
          });

          return;
        }

        const organization: {
          name: string;
          VAT: string;
          businessOrganizationNumber: string;
          domain?: string;
        } = {
          name: organizationFormData.name,
          VAT: organizationFormData.VAT,
          businessOrganizationNumber:
            organizationFormData.businessOrganizationNumber,
        };

        // add organization
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

  const googleSignUpSuccessHandler = async (credentialResponse: any) => {
    const user: { email: string } = jwtDecode(
      credentialResponse?.credential as string
    );

    console.log(user);
    // await mutate({
    //   email: user.email,
    //   password: "",
    //   school: currentSchoolName,
    //   auth: UserAuthType.Google,
    // });

    // let signUpData: SignUpData = {
    //   firstName: user.fir,
    //   lastName: formData.lastName.trim(),
    //   email: formData.email.trim(),
    //   password: formData.password.trim(),
    //   authType: UserAuthType.Email,
    //   accountType,
    // }

    // if (referralCode) {
    //   signUpData = {
    //     ...signUpData,
    //     invitedReferralCode: Number(referralCode),
    //   }
    // }

    // signUpMutation(signUpData);
  };

  const googleSignUpErrorHandler = () => {
    // toast.error("Something went wrong");
  };

  const googleSignInSuccessHandler = async (credentialResponse: any) => {
    // const user: { email: string } = jwtDecode(credentialResponse?.credential as string);
    // await mutate({
    //   email: user.email,
    //   password: "",
    //   school: currentSchoolName,
    //   auth: UserAuthType.Google,
    // });
  };

  const googleSignInErrorHandler = () => {
    // toast.error("Something went wrong");
  };

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
                  <span>{accountType} Account</span>
                </li>
              ) : null;
            })}
          </ul>
        )}

        <form onSubmit={handleAuthFormSubmit} className="mt-4">
          <h2 className="font-semibold text-3xl">{formTitle[authPageType]}</h2>
          <p className="mt-4 text-lg">{formDescription[authPageType]}</p>
          {authPageType === "signUp" && referralCode && (
            <div className="my-4 flex items-center gap-2 bg-[#363637] rounded-2xl px-4 py-2">
              <Info color="#BEB8FF" />
              <p className="text-[#BEB8FF]">
                You&apos;ve got a 10% discount via referral link!
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
                </div>
              </>
            )}
          </div>

          {authPageType === "signUp" &&
            accountType === UserAccountType.Business && (
              <div className="flex flex-col gap-2 mt-4">
                <p>
                  Provide detailed information about your business to help us
                  customize your experience
                </p>

                <Input
                  name="name"
                  placeholder="Company name"
                  value={organizationFormData.name}
                  onChange={handleOrganizationFormInputChange}
                />
                <Input
                  name="businessOrganizationNumber"
                  placeholder="Business registration number"
                  value={organizationFormData.businessOrganizationNumber}
                  onChange={handleOrganizationFormInputChange}
                />
                <Input
                  name="VAT"
                  placeholder="VAT number"
                  value={organizationFormData.VAT}
                  onChange={handleOrganizationFormInputChange}
                />
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

        <div className="pt-4">
          {authPageType === "signIn" && <SendResetPasswordCodeModal />}

          {((authPageType === "signUp" &&
            accountType === UserAccountType.Private) ||
            authPageType === "signIn") && (
            <>
              <p className="text-center mt-1 mb-5">Or</p>

              <div className="flex flex-col gap-2 relative">
                <div className="opacity-0 absolute z-10 w-full mt-0.5 rounded-full overflow-hidden">
                  <GoogleLogin
                    onSuccess={googleSignInSuccessHandler}
                    onError={googleSignInErrorHandler}
                  />
                </div>
                <button
                  className="
                    py-2.5 bg-white flex items-center gap-2 justify-center text-black 
                    rounded-full relative z-0
                  "
                >
                  <Image
                    src={GoogleIcon}
                    width={20}
                    height={20}
                    alt="google"
                    className="w-5 h-5"
                  />
                  <span>
                    {authPageType === "signIn" && "Sign in "}
                    {authPageType === "signUp" && "Sign up "}
                    with Google
                  </span>
                </button>
                {/* <button className="py-2.5 bg-white text-black rounded-full">
                  Sign in with Github
                </button> */}
              </div>
            </>
          )}

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

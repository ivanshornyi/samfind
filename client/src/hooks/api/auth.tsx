import { useContext } from "react"

import { useRouter } from "next/navigation"

import { AuthContext } from "@/context"

import { useMutation } from "@tanstack/react-query"

import { AuthApiService, UserAuthType, SignUpData } from "@/services"

import { useToast } from "@/hooks"

import { handleToastError } from "@/errors"

export const useSignIn = () => {
  const router = useRouter()
  const { login } = useContext(AuthContext)
  const { toast } = useToast()

  const { ...rest } = useMutation({
    mutationFn: (data: {
      email: string
      password: string
      authType: UserAuthType
      signInRedirect: string | null
      backendLink: string | null
    }) => AuthApiService.signIn(data.email, data.password, data.authType, data.signInRedirect, data.backendLink),
    onSuccess: (data: { accessToken: string, refreshToken: string, signInRedirect: string | null, backendLink: string | null }) => {
      toast({
        title: "Success",
        description: "Successfully logged in",
        variant: "success",
      })

      login(data.accessToken, data.refreshToken)

      if (!data.signInRedirect && !data.backendLink) {
        setTimeout(() => router.push("/account/license"), 100)
      } else {
        AuthApiService.syncAuth(data.backendLink)
          .then((res) => {
            console.warn('Res in then sync-auth', res)
            toast({
              title: "Sync-auth",
              description: "Successfully synced the data",
              variant: "success",
            })
            window.location.href = data.signInRedirect as string
          }).catch((err) => {
            console.error('Error in sync-auth', err)
            toast({
              title: "Sync-auth",
              description: "Failed to sync data",
              variant: "destructive",
            })
          })
      }
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return rest
}

export const useSignUp = () => {
  const { toast } = useToast()

  const { ...mutationProps } = useMutation({
    mutationFn: (data: SignUpData) => AuthApiService.signUp(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Verification code has been send to your email",
        variant: "success",
      })
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return mutationProps
}

export const useSendVerificationCode = () => {
  const { toast } = useToast()

  const { ...mutationProps } = useMutation({
    mutationFn: (email: string) => AuthApiService.sendVerificationCode(email),
    onSuccess: () => {
      toast({
        description: "Successfully sended",
      })

      // fetch to backend
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return mutationProps
}

type ResetPasswordData = {
  email: string
  verificationCode: string
  newPassword: string
}

export const useResetPassword = () => {
  const router = useRouter()
  const { toast } = useToast()

  const { ...mutationProps } = useMutation({
    mutationFn: (data: ResetPasswordData) =>
      AuthApiService.resetPassword(
        data.email,
        data.verificationCode,
        data.newPassword
      ),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
        variant: "success",
      })

      router.push("/auth/sign-in")
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return mutationProps
}

export const useSendVerificationCodeToUpdateEmail = () => {
  const { toast } = useToast()

  const { ...mutationProps } = useMutation({
    mutationFn: (data: { userId: string, email: string, password: string }) => {
      return AuthApiService.sendVerificationCodeToUpdateEmail(
        data.userId,
        data.email,
        data.password
      )
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Verification code has been sent to your mail",
        variant: "success",
      })
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return mutationProps
}

export const useUpdateUserEmail = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { fetchUser } = useContext(AuthContext)

  const { ...mutationProps } = useMutation({
    mutationFn: (data: {
      userId: string
      verificationCode: string
      newEmail: string
    }) => {
      return AuthApiService.updateEmail(
        data.userId,
        data.verificationCode,
        data.newEmail
      )
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
        variant: "success",
      })

      router.push("/account/settings")
      fetchUser()
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return mutationProps
}

export const useVerifyUser = () => {
  const router = useRouter()
  const { login } = useContext(AuthContext)
  const { toast } = useToast()

  const { ...mutationProps } = useMutation({
    mutationFn: (data: {
      email: string
      verificationCode: string
      licenseId?: string
      organizationId?: string
    }) => AuthApiService.verifyUser(data),
    onSuccess: (
      data: { accessToken: string, refreshToken: string },
      variables
    ) => {
      toast({
        title: "Success",
        description: "Successfully logged in",
        variant: "success",
      })

      login(data.accessToken, data.refreshToken)

      const { licenseId, organizationId } = variables
      localStorage.removeItem("licenseId")
      localStorage.removeItem("organizationId")

      setTimeout(
        () =>
          router.push(
            licenseId || organizationId
              ? "/account/license"
              : "/account/billing-data"
          ),
        100
      )
    },
    onError: (error) => {
      handleToastError(error, toast)
    },
  })

  return mutationProps
}

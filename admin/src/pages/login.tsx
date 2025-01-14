import { Button, Input } from "@/components";
import { useSignIn, useToast } from "@/hooks";
import { useState } from "react";
import { UserAuthType } from "@shared/types";

export const LoginPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate: signInMutation } = useSignIn();

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast({
        description: "Some fields are empty",
      });
      return;
    }

    signInMutation({
      email,
      password,
      authType: UserAuthType.Email,
    });
  };

  return (
    <div className="mx-auto w-96 border-[1px] rounded-2xl px-10 py-8 shadow-lg bg-card mt-20">
      <form onSubmit={handleSubmit}>
        <h2 className="font-semibold text-xl">Sign In</h2>

        <div className="mt-3 flex flex-col gap-2">
          <div>
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <Input
              id="email"
              name="email"
              placeholder="Enter email"
              onChange={handleFormInputChange}
              className="py-6 px-3 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <Input
              id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              onChange={handleFormInputChange}
              className="py-6 px-3 rounded-lg"
            />
          </div>
        </div>

        <Button className="mt-4 p-6 w-full rounded-lg">Submit</Button>
      </form>
    </div>
  );
};

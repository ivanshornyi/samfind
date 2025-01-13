import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { User, UserStatus } from "@shared/types";
import { useState } from "react";
import { useUpdateUser } from "@/hooks";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  const { mutate: updateUserMutation } = useUpdateUser();

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    updateUserMutation({ userId: user.id, user: formData });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AlertDialogHeader className="gap-2">
            <AlertDialogTitle>Update user</AlertDialogTitle>
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
            <div>
              <label htmlFor="status" className="text-sm">
                Stauts
              </label>
              <Select
                onValueChange={handleSelectChange.bind(null, "status")}
                defaultValue={Object.keys(UserStatus).find(
                  (key) => key === user.status
                )}
              >
                <SelectTrigger className="py-6 px-3 rounded-lg" id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(UserStatus).map((key: string) => (
                    <SelectItem
                      key={UserStatus[key as keyof typeof UserStatus]}
                      value={key}
                    >
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Save</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

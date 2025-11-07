import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { userApiService } from "@/infrastructure/UserApiService";
import type { UserResponse } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const UserCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
});

export type UserFormFields = z.infer<typeof UserCreateSchema>;

type Props = {
  defaultValue: UserFormFields;
  onSubmitSuccess: (user: UserResponse) => void;
};

const UserForm: FC<Props> = (props) => {
  const { defaultValue, onSubmitSuccess } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormFields>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: defaultValue,
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<UserFormFields>>(
    async (formData) => {
      startSaving();
      const { success, errorMessage, data } = await userApiService.createUser(
        formData,
      );
      if (success) {
        onSubmitSuccess(data);
        toast.success("User created successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [onSubmitSuccess, startSaving, stopSaving],
  );

  return (
    <form
      className="flex w-full flex-col gap-4"
      id="user-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Name"
        placeholder="Enter user name"
        required
        fullWidth
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        placeholder="Enter email address"
        type="email"
        required
        fullWidth
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Phone"
        placeholder="Enter phone number"
        type="tel"
        required
        fullWidth
        {...register("phone")}
        error={errors.phone?.message}
      />

      <div className="flex w-full items-center justify-end gap-4">
        <Button
          startIcon={<RefreshCcw size={20} />}
          variant="filled"
          color="neutral"
          onClick={handleReset}
          type="button"
        >
          Reset
        </Button>
        <Button
          startIcon={<Save className="text-white" size={20} />}
          type="submit"
          isLoading={isSubmitting || isSaving}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

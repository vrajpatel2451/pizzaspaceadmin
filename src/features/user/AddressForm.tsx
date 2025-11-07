import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Select from "@/components/base/Select";
import { Checkbox } from "@/components/base/Checkbox";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { addressApiService } from "@/infrastructure/AddressApiService";
import type { AddressResponse } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const AddressCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string(),
  area: z.string().min(1, "Area is required"),
  county: z.string().min(1, "County is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "Zip code is required"),
  lat: z.number(),
  long: z.number(),
  type: z.enum(["home", "work", "other"]),
  otherAddressLabel: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormFields = z.infer<typeof AddressCreateSchema>;

type Props = {
  defaultValue: AddressFormFields;
  userId: string;
  onSubmitSuccess: (address: AddressResponse) => void;
};

const addressTypeOptions = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Other", value: "other" },
];

const AddressForm: FC<Props> = (props) => {
  const { defaultValue, userId, onSubmitSuccess } = props;
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormFields>({
    resolver: zodResolver(AddressCreateSchema),
    defaultValues: defaultValue,
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const addressType = watch("type");

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<AddressFormFields>>(
    async (formData) => {
      startSaving();
      const { success, errorMessage, data } =
        await addressApiService.createAddress(formData, userId);
      if (success) {
        onSubmitSuccess(data);
        toast.success("Address created successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [onSubmitSuccess, startSaving, stopSaving, userId],
  );

  return (
    <form
      className="flex w-full flex-col gap-4"
      id="address-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Contact Name"
        placeholder="Enter contact name"
        required
        fullWidth
        {...register("name")}
        error={errors.name?.message}
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

      <Input
        label="Address Line 1"
        placeholder="Street address, P.O. box"
        required
        fullWidth
        {...register("line1")}
        error={errors.line1?.message}
      />

      <Input
        label="Address Line 2"
        placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
        fullWidth
        {...register("line2")}
        error={errors.line2?.message}
      />

      <Input
        label="Area"
        placeholder="Enter area"
        required
        fullWidth
        {...register("area")}
        error={errors.area?.message}
      />

      <Input
        label="County"
        placeholder="Enter county"
        required
        fullWidth
        {...register("county")}
        error={errors.county?.message}
      />

      <Input
        label="Country"
        placeholder="Enter country"
        required
        fullWidth
        {...register("country")}
        error={errors.country?.message}
      />

      <Input
        label="Zip Code"
        placeholder="Enter zip code"
        required
        fullWidth
        {...register("zip")}
        error={errors.zip?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          placeholder="Enter latitude"
          type="number"
          step="any"
          fullWidth
          {...register("lat", { valueAsNumber: true })}
          error={errors.lat?.message}
        />

        <Input
          label="Longitude"
          placeholder="Enter longitude"
          type="number"
          step="any"
          fullWidth
          {...register("long", { valueAsNumber: true })}
          error={errors.long?.message}
        />
      </div>

      <Controller
        name="type"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Address Type"
            required
            options={addressTypeOptions}
            value={addressTypeOptions.find((opt) => opt.value === value)}
            onChange={(option: any) => onChange(option?.value || "home")}
            error={errors.type?.message}
          />
        )}
      />

      {addressType === "other" && (
        <Input
          label="Other Address Label"
          placeholder="Enter custom label (e.g., Office, Gym)"
          fullWidth
          {...register("otherAddressLabel")}
          error={errors.otherAddressLabel?.message}
        />
      )}

      <Controller
        name="isDefault"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Checkbox
            label="Set as default address"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
        )}
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

export default AddressForm;

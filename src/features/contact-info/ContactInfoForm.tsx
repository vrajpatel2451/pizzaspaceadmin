import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { contactInfoApiService } from "@/infrastructure/ContactInfoApiService";
import type { ContactInfoResponse } from "@/types/contactInfo.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const ContactInfoSchema = z.object({
  addressLine1: z.string().min(2, "Address Line 1 is required (min 2 chars)"),
  addressLine2: z.string().optional(),
  area: z.string().min(2, "Area is required (min 2 chars)"),
  city: z.string().min(2, "City is required (min 2 chars)"),
  county: z.string().optional(),
  zip: z.string().min(2, "ZIP/Postcode is required (min 2 chars)"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  immediatePhoneNo: z.string().optional(),
  immediateEmail: z.string().email().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
});

export type ContactInfoFormFields = z.infer<typeof ContactInfoSchema>;

export type ContactInfoAction = "edit" | "create";

type Props = {
  defaultValue: ContactInfoFormFields;
  action: ContactInfoAction;
  id?: string;
  onSubmitSuccess: (contactInfo: ContactInfoResponse) => void;
};

const ContactInfoForm: FC<Props> = (props) => {
  const { defaultValue, action, id, onSubmitSuccess } = props;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactInfoFormFields>({
    resolver: zodResolver(ContactInfoSchema),
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

  const onSubmit = useCallback<SubmitHandler<ContactInfoFormFields>>(
    async (formData) => {
      startSaving();
      const apiCall =
        action === "edit" && id
          ? contactInfoApiService.updateContactInfo(id, formData)
          : contactInfoApiService.createContactInfo(formData);
      const { success, errorMessage, data } = await apiCall;
      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Contact info saved successfully");
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [action, id, onSubmitSuccess, startSaving, stopSaving]
  );

  return (
    <form
      className="flex w-full flex-col gap-4"
      id="contact-info-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Address Line 1"
          placeholder="Enter address line 1"
          required
          fullWidth
          {...register("addressLine1")}
          error={errors.addressLine1?.message}
        />
        <Input
          label="Address Line 2"
          placeholder="Enter address line 2 (optional)"
          fullWidth
          {...register("addressLine2")}
          error={errors.addressLine2?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="Area"
          placeholder="Enter area"
          required
          fullWidth
          {...register("area")}
          error={errors.area?.message}
        />
        <Input
          label="City"
          placeholder="Enter city"
          required
          fullWidth
          {...register("city")}
          error={errors.city?.message}
        />
        <Input
          label="County"
          placeholder="Enter county (optional)"
          fullWidth
          {...register("county")}
          error={errors.county?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="ZIP/Postcode"
          placeholder="Enter ZIP/Postcode"
          required
          fullWidth
          {...register("zip")}
          error={errors.zip?.message}
        />
        <Input
          label="Phone"
          placeholder="Enter phone number"
          required
          fullWidth
          {...register("phone")}
          error={errors.phone?.message}
        />
        <Input
          label="Email"
          placeholder="Enter email"
          required
          fullWidth
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Latitude"
          placeholder="Enter latitude (optional)"
          fullWidth
          type="number"
          step="any"
          {...register("lat", { valueAsNumber: true })}
          error={errors.lat?.message}
        />
        <Input
          label="Longitude"
          placeholder="Enter longitude (optional)"
          fullWidth
          type="number"
          step="any"
          {...register("lng", { valueAsNumber: true })}
          error={errors.lng?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Immediate Phone No"
          placeholder="Enter immediate phone (optional)"
          fullWidth
          {...register("immediatePhoneNo")}
          error={errors.immediatePhoneNo?.message}
        />
        <Input
          label="Immediate Email"
          placeholder="Enter immediate email (optional)"
          fullWidth
          type="email"
          {...register("immediateEmail")}
          error={errors.immediateEmail?.message}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Published</span>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value || false}
              setChecked={field.onChange}
            />
          )}
        />
      </div>

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

export default ContactInfoForm;

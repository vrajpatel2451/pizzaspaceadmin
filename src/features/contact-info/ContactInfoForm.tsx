import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import type { ParsedAddress } from "@/components/compound/address-picker";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { contactInfoApiService } from "@/infrastructure/ContactInfoApiService";
import type { ContactInfoResponse } from "@/types/contactInfo.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import ContactInfoLocationPicker from "./components/ContactInfoLocationPicker";

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
    setValue,
    watch,
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

  // Handle location selection from map picker
  const handleLocationChange = useCallback(
    (address: ParsedAddress) => {
      setValue("lat", address.lat, { shouldValidate: true });
      setValue("lng", address.long, { shouldValidate: true });
      setValue("addressLine1", address.line1, { shouldValidate: true });
      setValue("addressLine2", address.line2 || "", { shouldValidate: true });
      setValue("area", address.area, { shouldValidate: true });
      setValue("city", address.city, { shouldValidate: true });
      setValue("county", address.county || "", { shouldValidate: true });
      setValue("zip", address.zip, { shouldValidate: true });
    },
    [setValue]
  );

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
      {/* Location Picker */}
      <div>
        <h4 className="mb-2 text-sm font-medium">Location</h4>
        <ContactInfoLocationPicker
          lat={watch("lat")}
          lng={watch("lng")}
          addressLine1={watch("addressLine1")}
          addressLine2={watch("addressLine2")}
          area={watch("area")}
          city={watch("city")}
          county={watch("county")}
          zip={watch("zip")}
          onLocationChange={handleLocationChange}
          error={errors.lat?.message || errors.lng?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

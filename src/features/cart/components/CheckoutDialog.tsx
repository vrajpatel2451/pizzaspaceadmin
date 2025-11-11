import Dialog from "@/components/compound/Dialog";
import RadioGroup from "@/components/compound/RadioGroup";
import { Textarea } from "@/components/base/Textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import type { PaymentType } from "@/types/order.types";

type Props = {
  isOpen: boolean;
  close: () => void;
  onSubmitCheckout: (paymentType: PaymentType, customerMessage?: string) => void;
  isSubmitting: boolean;
};

const CheckoutFormSchema = z.object({
  paymentType: z.enum(["cash", "online"], {
    required_error: "Payment method is required",
  }),
  customerMessage: z.string().max(500, "Message must be 500 characters or less").optional(),
});

type CheckoutFormFields = z.infer<typeof CheckoutFormSchema>;

const CheckoutDialog: FC<Props> = ({ isOpen, close, onSubmitCheckout, isSubmitting }) => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormFields>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      paymentType: "cash",
      customerMessage: "",
    },
  });

  const onSubmit = useCallback<SubmitHandler<CheckoutFormFields>>(
    (formData) => {
      onSubmitCheckout(formData.paymentType, formData.customerMessage);
    },
    [onSubmitCheckout]
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      reset();
      close();
    }
  }, [isSubmitting, reset, close]);

  const paymentTypeOptions = [
    { label: "Cash", value: "cash" },
    { label: "Online", value: "online" },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      close={handleClose}
      title="Complete Order"
      size="sm"
      actions={{
        primary: {
          label: "Complete Order",
          onClick: handleSubmit(onSubmit),
          loading: isSubmitting,
          disabled: isSubmitting,
        },
        secondary: {
          label: "Cancel",
          onClick: handleClose,
          disabled: isSubmitting,
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Payment Type Selection */}
        <div>
          <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
            Payment Method<span className="text-dl-500">*</span>
          </label>
          <Controller
            name="paymentType"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup
                options={paymentTypeOptions}
                value={value}
                onChange={(val) => onChange(val as PaymentType)}
                size="md"
                orientation="horizontal"
              />
            )}
          />
          {errors.paymentType && (
            <p className="text-dl-500 mt-1 text-xs">{errors.paymentType.message}</p>
          )}
        </div>

        {/* Customer Message / Order Notes */}
        <div>
          <Textarea
            label="Order Notes"
            placeholder="Any special instructions for this order..."
            rows={3}
            maxLength={500}
            showCharCount={true}
            fullWidth
            {...register("customerMessage")}
            error={errors.customerMessage?.message}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default CheckoutDialog;

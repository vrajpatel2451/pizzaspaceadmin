import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Label from "@/components/base/Label";
import Switch from "@/components/base/Switch";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { extraChargesApiService } from "@/infrastructure/ExtraChargesApiService";
import type { ExtraChargesResponse } from "@/types/extraCharges.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Percent, Trash } from "lucide-react";
import { useCallback, useMemo, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

type Props = {
  charges: ExtraChargesResponse;
  onSave: (charges: ExtraChargesResponse, uiKey: string) => void;
  onDelete: (uiKey: string) => void;
};

const TaxFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price Amount must be positive"),
  discount: z.number().min(0, "Discount Amount must be positive"),
  tax: z.number().min(0, "Tax Amount must be positive"),
  allowTax: z.boolean(),
  taxAfterDiscount: z.boolean(),
});

export type TaxFormFields = z.infer<typeof TaxFormSchema>;

const ExtraChargesFormCard: FC<Props> = (props) => {
  const { onDelete, onSave, charges: pTax } = props;
  const {
    _id,
    uiKey,
    taxAfterDiscount,
    allowTax,
    tax,
    storeId,
    discount,
    name,
    price,
  } = pTax;
  const { isOpen, open, close } = useToggle();
  const taxInitData = useMemo<TaxFormFields>(
    () => ({
      taxAfterDiscount,
      allowTax,
      tax,
      discount,
      name,
      price,
    }),
    [allowTax, discount, name, price, tax, taxAfterDiscount],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaxFormFields>({
    resolver: zodResolver(TaxFormSchema),
    defaultValues: taxInitData,
  });

  const {
    isOpen: isDeleting,
    open: startDeleting,
    close: stopDeleting,
  } = useToggle();
  const onDeleteConfirm = useCallback(async () => {
    startDeleting();
    if (_id) {
      const { success } = await extraChargesApiService.deleteExtraCharges(_id);
      if (success) {
        toast.success("Deleted successfully");
        onDelete(uiKey);
      } else {
        toast.error("Error deleting structure");
      }
    } else {
      toast.success("Deleted successfully");
      onDelete(uiKey);
    }
    stopDeleting();
  }, [_id, onDelete, startDeleting, stopDeleting, uiKey]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();
  const onSubmit = useCallback<SubmitHandler<TaxFormFields>>(
    async (props) => {
      startSaving();
      const apiCall = _id
        ? extraChargesApiService.updateExtraCharges(
            {
              allowTax: props.allowTax,
              discount: props.discount,
              name: props.name,
              price: props.price,
              storeId,
              tax: props.tax,
              taxAfterDiscount: props.taxAfterDiscount,
            },
            _id,
          )
        : extraChargesApiService.createExtraCharges({
            allowTax: props.allowTax,
            discount: props.discount,
            name: props.name,
            price: props.price,
            storeId,
            tax: props.tax,
            taxAfterDiscount: props.taxAfterDiscount,
          });
      const { success, errorMessage, data } = await apiCall;
      if (success) {
        onSave(data, uiKey);
        toast.success("Charges saved successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [_id, onSave, startSaving, stopSaving, storeId, uiKey],
  );

  return (
    <form
      id="tax-form"
      onSubmit={handleSubmit(onSubmit)}
      className="border-pl-200 flex w-full flex-col gap-4 rounded-lg border bg-white p-4"
    >
      {isOpen && (
        <DeleteDialog
          close={close}
          isOpen
          onDelete={onDeleteConfirm}
          isDeleting={isDeleting}
          name={`Extra Charges Of This Store`}
          title="Delete Extra Charges?"
        />
      )}
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Extra Charges: {name}</div>
        <div className="flex-1" />
        <Controller
          name="allowTax"
          control={control}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} setChecked={onChange} />;
          }}
        />
        <Label>Allow Tax</Label>
        <div />
        <Controller
          name="taxAfterDiscount"
          control={control}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} setChecked={onChange} />;
          }}
        />
        <Label>After Discount?</Label>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            label="Name"
            placeholder={"Enter here"}
            fullWidth
            required
            {...register("name")}
            error={errors?.name?.message}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Price (Fix Amount)"
            placeholder={"Enter here"}
            fullWidth
            type="number"
            required
            {...register("price", { valueAsNumber: true })}
            error={errors?.price?.message}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            label="Discount (Fix Amount)"
            placeholder={"Enter here"}
            fullWidth
            type="number"
            required
            {...register("discount", { valueAsNumber: true })}
            error={errors?.discount?.message}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Tax (In Percentage)"
            placeholder={"Enter between 0 to 100"}
            fullWidth
            type="number"
            rightElement={<Percent />}
            required
            {...register("tax", { valueAsNumber: true })}
            error={errors?.tax?.message}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <Button
          variant="outline"
          startIcon={<Trash className="text-pl-500 text-sm" size={"14px"} />}
          onClick={open}
        >
          Delete
        </Button>
        <Button
          type="submit"
          isLoading={isSaving || isSubmitting}
          disabled={isSaving || isSubmitting}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default ExtraChargesFormCard;

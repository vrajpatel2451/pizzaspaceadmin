import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Label from "@/components/base/Label";
import Switch from "@/components/base/Switch";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { orderTaxStructureApiService } from "@/infrastructure/OrderTaxStructureApiService";
import type {
  OrderTaxStructureResponse,
  TaxSection,
} from "@/types/orderTaxStructure.types";
import { Percent, Trash } from "lucide-react";
import z from "zod";
import { useCallback, useMemo, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  tax: OrderTaxStructureResponse;
  onSave: (tax: OrderTaxStructureResponse, uiKey: string) => void;
  onDelete: (uiKey: string) => void;
};

const TaxFormSchema = z.object({
  tax: z.number().min(0, "Discount Amount must be positive"),
  allowTax: z.boolean(),
  afterDiscount: z.boolean(),
});

export type TaxFormFields = z.infer<typeof TaxFormSchema>;

const OrderTaxStructureFormCard: FC<Props> = (props) => {
  const { onDelete, onSave, tax: pTax } = props;
  const { section, _id, uiKey, afterDiscount, allowTax, tax, storeId } = pTax;
  const { isOpen, open, close } = useToggle();
  const taxInitData = useMemo<TaxFormFields>(
    () => ({
      afterDiscount,
      allowTax,
      tax,
    }),
    [afterDiscount, allowTax, tax],
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
      const { success } =
        await orderTaxStructureApiService.deleteOrderTaxStructure(_id);
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
        ? orderTaxStructureApiService.updateOrderTaxStructure(
            {
              afterDiscount: props.afterDiscount,
              allowTax: props.allowTax,
              section,
              storeId,
              tax: props.tax,
            },
            _id,
          )
        : orderTaxStructureApiService.createOrderTaxStructure({
            afterDiscount: props.afterDiscount,
            allowTax: props.allowTax,
            section,
            storeId,
            tax: props.tax,
          });
      const { success, errorMessage, data } = await apiCall;
      if (success) {
        onSave(data, uiKey);
        toast.success("Discount saved successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [_id, onSave, section, startSaving, stopSaving, storeId, uiKey],
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
          name={`Tax on ${mapData[section]}`}
          title="Delete Tax Config?"
        />
      )}
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Tax On {mapData[section]}</div>
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
          name="afterDiscount"
          control={control}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} setChecked={onChange} />;
          }}
        />
        <Label>After Discount?</Label>
      </div>

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

const mapData: Record<TaxSection, string> = {
  deliveryCharges: "Delivery Charges",
  itemTotal: "Item Total",
  packingCharges: "Packing Charges",
};

export default OrderTaxStructureFormCard;

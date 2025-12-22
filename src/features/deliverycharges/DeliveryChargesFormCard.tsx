import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Select from "@/components/base/Select";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { deliveryChargesApiService } from "@/infrastructure/DeliveryChargesApiService";
import type {
  DeliveryChargesResponse,
  DeliveryChargesUnit,
} from "@/types/deliveryCharges.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useCallback, useMemo, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

type Props = {
  deliveryCharges: DeliveryChargesResponse;
  onSave: (tax: DeliveryChargesResponse, uiKey: string) => void;
  onDelete: (uiKey: string) => void;
};

const DeliveryChargesFormSchema = z.object({
  deliveryChargesAmount: z.number().min(0, "Discount Amount must be positive"),
  deliveryChargesUnit: z.enum(["km", "mile", "m", "fixed"]),
});

type DeliveryChargesFormField = z.infer<typeof DeliveryChargesFormSchema>;

const DeliveryChargesFormCard: FC<Props> = (props) => {
  const { onDelete, onSave, deliveryCharges: pTax } = props;
  const { deliveryChargesAmount, deliveryChargesUnit, _id, uiKey, storeId } =
    pTax;
  const { isOpen, open, close } = useToggle();
  const taxInitData = useMemo<DeliveryChargesFormField>(
    () => ({
      deliveryChargesAmount,
      deliveryChargesUnit,
    }),
    [deliveryChargesAmount, deliveryChargesUnit],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryChargesFormField>({
    resolver: zodResolver(DeliveryChargesFormSchema),
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
        await deliveryChargesApiService.deleteDeliveryCharges(_id);
      if (success) {
        toast.success("Deleted successfully");
        onDelete(uiKey);
      } else {
        toast.error("Error deleting charges");
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
  const onSubmit = useCallback<SubmitHandler<DeliveryChargesFormField>>(
    async (props) => {
      startSaving();
      const apiCall = _id
        ? deliveryChargesApiService.updateDeliveryCharges(
            {
              deliveryChargesAmount: props.deliveryChargesAmount,
              deliveryChargesUnit: props.deliveryChargesUnit,
              storeId,
            },
            _id,
          )
        : deliveryChargesApiService.createDeliveryCharges({
            deliveryChargesAmount: props.deliveryChargesAmount,
            deliveryChargesUnit: props.deliveryChargesUnit,
            storeId,
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
      id="delivery-form"
      onSubmit={handleSubmit(onSubmit)}
      className="border-pl-200 flex w-full flex-col gap-4 rounded-lg border bg-white p-4"
    >
      {isOpen && (
        <DeleteDialog
          close={close}
          isOpen
          onDelete={onDeleteConfirm}
          isDeleting={isDeleting}
          name={`Delivery Charges of This Store`}
          title="Delete Charges?"
        />
      )}
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Delivery Charges</div>
      </div>

      <Input
        label="Delivery Charges"
        placeholder={"Enter value"}
        fullWidth
        step={"0.01"}
        type="number"
        rightElement={
          <Controller
            name="deliveryChargesUnit"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  value={
                    mapData[value]
                      ? {
                          value,
                          label: mapData[value],
                        }
                      : null
                  }
                  onChange={(op) => onChange((op as any)?.value)}
                  options={["km", "m", "mile", "fixed"].map((e) => ({
                    value: e,
                    label: mapData[e as DeliveryChargesUnit],
                  }))}
                  placeholder="Select Unit"
                  variant="minimal"
                  error={errors?.deliveryChargesUnit?.message}
                />
              );
            }}
          />
        }
        required
        {...register("deliveryChargesAmount", { valueAsNumber: true })}
        error={errors?.deliveryChargesAmount?.message}
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

const mapData: Record<DeliveryChargesUnit, string> = {
  km: "Per Kilometer",
  m: "Per Meter",
  mile: "Per Mile",
  fixed: "Fixed for any distance",
};

export default DeliveryChargesFormCard;

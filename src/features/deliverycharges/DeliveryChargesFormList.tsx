import { Button } from "@/components/base/Button";
import type { OrderTaxStructureQueryParams } from "@/types/orderTaxStructure.types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import Spinner from "@/components/compound/spinner/Spinner";
import { toast } from "@/components/compound/Sonner";
import { v4 } from "uuid";
import { useToggle } from "@/hooks/useToggle";
import { useFetchDeliveryChargesList } from "./hooks/useFetchDeliveryChargesList";
import type { DeliveryChargesResponse } from "@/types/deliveryCharges.types";
import DeliveryChargesFormCard from "./DeliveryChargesFormCard";

type Props = {
  storeId: string;
};

const DeliveryChargesList: FC<Props> = (props) => {
  const { storeId } = props;
  const fetchParams = useMemo<OrderTaxStructureQueryParams>(
    () => ({
      storeId,
      all: true,
    }),
    [storeId],
  );
  const { data, isFetching, isError, errorMessage } =
    useFetchDeliveryChargesList(fetchParams);
  const { data: orderTaxStructureList } = data || {};

  const [deliveryChargesList, setDeliveryChargesList] = useState<
    DeliveryChargesResponse[]
  >([]);
  const {
    isOpen: isVisible,
    open: showList,
    close: hideList,
  } = useToggle(true);

  useEffect(() => {
    if (orderTaxStructureList?.length) {
      setDeliveryChargesList(
        orderTaxStructureList.map((e) => ({ ...e, uiKey: v4() })),
      );
    } else {
      setDeliveryChargesList([]);
    }
  }, [orderTaxStructureList]);

  const onAddList = useCallback(() => {
    if (deliveryChargesList.length) {
      toast.warning("You cannot add more then one");
    } else {
      setDeliveryChargesList((prev) => [
        ...prev,
        {
          _id: null,
          createdAt: null,
          deliveryChargesAmount: 0,
          deliveryChargesUnit: "km",
          storeId,
          updatedAt: null,
          uiKey: v4(),
        },
      ]);
    }
  }, [storeId, deliveryChargesList]);

  const onSave = useCallback(
    (tax: DeliveryChargesResponse, uiKey: string) => {
      hideList();
      setDeliveryChargesList((prev) =>
        prev.map((e) => (e.uiKey === uiKey ? { ...tax, uiKey } : e)),
      );
      setTimeout(() => showList(), 100);
    },
    [hideList, showList],
  );
  const onDelete = useCallback((uiKey: string) => {
    setDeliveryChargesList((prev) => prev.filter((e) => e.uiKey !== uiKey));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="flex w-full items-center justify-end">
        <Button
          startIcon={<Plus className="text-white" size={20} />}
          onClick={onAddList}
        >
          Add New
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        {(isFetching || !isVisible) && <Spinner />}
        {!(isFetching || !isVisible) && (
          <>
            {isError && <div>Error: {errorMessage}</div>}
            {!isError && (
              <>
                {!deliveryChargesList?.length && <div>No charges found</div>}
                {Boolean(deliveryChargesList?.length) && (
                  <>
                    {deliveryChargesList?.map((e) => (
                      <DeliveryChargesFormCard
                        key={e.uiKey}
                        onDelete={onDelete}
                        onSave={onSave}
                        deliveryCharges={e}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryChargesList;

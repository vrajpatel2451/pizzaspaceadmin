import { Button } from "@/components/base/Button";
import Spinner from "@/components/compound/spinner/Spinner";
import { useToggle } from "@/hooks/useToggle";
import type { ExtraChargesResponse } from "@/types/extraCharges.types";
import type { OrderTaxStructureQueryParams } from "@/types/orderTaxStructure.types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { v4 } from "uuid";
import ExtraChargesFormCard from "./ExtraChargesFormCard";
import { useFetchExtraChargesList } from "./hooks/useFetchExtraChargesList";

type Props = {
  storeId: string;
};

const ExtraChargesFromList: FC<Props> = (props) => {
  const { storeId } = props;
  const fetchParams = useMemo<OrderTaxStructureQueryParams>(
    () => ({
      storeId,
      all: true,
    }),
    [storeId],
  );
  const { data, isFetching, isError, errorMessage } =
    useFetchExtraChargesList(fetchParams);
  const { data: orderTaxStructureList } = data || {};

  const [extraChargesList, setExtraChargesList] = useState<
    ExtraChargesResponse[]
  >([]);
  const {
    isOpen: isVisible,
    open: showList,
    close: hideList,
  } = useToggle(true);

  useEffect(() => {
    if (orderTaxStructureList?.length) {
      setExtraChargesList(
        orderTaxStructureList.map((e) => ({ ...e, uiKey: v4() })),
      );
    } else {
      setExtraChargesList([]);
    }
  }, [orderTaxStructureList]);

  const onAddList = useCallback(() => {
    setExtraChargesList((prev) => [
      ...prev,
      {
        _id: null,
        allowTax: true,
        createdAt: null,
        discount: 0,
        name: "",
        price: 0,
        storeId,
        tax: 0,
        taxAfterDiscount: false,
        updatedAt: null,
        uiKey: v4(),
      },
    ]);
  }, [storeId]);

  const onSave = useCallback(
    (tax: ExtraChargesResponse, uiKey: string) => {
      hideList();
      setExtraChargesList((prev) =>
        prev.map((e) => (e.uiKey === uiKey ? { ...tax, uiKey } : e)),
      );
      setTimeout(() => showList(), 100);
    },
    [hideList, showList],
  );
  const onDelete = useCallback((uiKey: string) => {
    setExtraChargesList((prev) => prev.filter((e) => e.uiKey !== uiKey));
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
                {!extraChargesList?.length && <div>No charges found</div>}
                {Boolean(extraChargesList?.length) && (
                  <>
                    {extraChargesList?.map((e) => (
                      <ExtraChargesFormCard
                        key={e.uiKey}
                        onDelete={onDelete}
                        onSave={onSave}
                        charges={e}
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

export default ExtraChargesFromList;

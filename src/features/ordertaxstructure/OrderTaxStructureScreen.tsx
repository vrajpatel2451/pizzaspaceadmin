import { Button } from "@/components/base/Button";
import type {
  OrderTaxStructureQueryParams,
  OrderTaxStructureResponse,
  TaxSection,
} from "@/types/orderTaxStructure.types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchOrderTaxStructureList } from "./hooks/useFetchOrderTaxStructureList";
import Spinner from "@/components/compound/spinner/Spinner";
import { Popover } from "@/components/compound/Popover";
import MenuItem from "@/components/compound/MenuItem";
import { toast } from "@/components/compound/Sonner";
import { v4 } from "uuid";
import OrderTaxStructureFormCard from "./OrderTaxStructureFormCard";
import { useToggle } from "@/hooks/useToggle";

type Props = {
  storeId: string;
};

const OrderTaxStructureScreen: FC<Props> = (props) => {
  const { storeId } = props;
  const fetchParams = useMemo<OrderTaxStructureQueryParams>(
    () => ({
      storeId,
      all: true,
    }),
    [storeId],
  );
  const { data, isFetching, isError, errorMessage } =
    useFetchOrderTaxStructureList(fetchParams);
  const { data: orderTaxStructureList } = data || {};

  const [taxList, setTaxList] = useState<OrderTaxStructureResponse[]>([]);
  const {
    isOpen: isVisible,
    open: showList,
    close: hideList,
  } = useToggle(true);

  useEffect(() => {
    if (orderTaxStructureList?.length) {
      setTaxList(orderTaxStructureList.map((e) => ({ ...e, uiKey: v4() })));
    } else {
      setTaxList([]);
    }
  }, [orderTaxStructureList]);

  const onAddList = useCallback(
    (section: TaxSection) => {
      const isExist = taxList.find((e) => e.section === section);
      if (isExist) {
        toast.warning("You cannot add more then one type of section");
      } else {
        setTaxList((prev) => [
          ...prev,
          {
            _id: null,
            afterDiscount: false,
            allowTax: false,
            createdAt: null,
            section,
            storeId,
            tax: 0,
            updatedAt: null,
            uiKey: v4(),
          },
        ]);
      }
    },
    [storeId, taxList],
  );

  const onSave = useCallback(
    (tax: OrderTaxStructureResponse, uiKey: string) => {
      hideList();
      setTaxList((prev) =>
        prev.map((e) => (e.uiKey === uiKey ? { ...tax, uiKey } : e)),
      );
      setTimeout(() => showList(), 100);
    },
    [hideList, showList],
  );
  const onDelete = useCallback((uiKey: string) => {
    setTaxList((prev) => prev.filter((e) => e.uiKey !== uiKey));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="flex w-full items-center justify-end">
        <Popover
          trigger={
            <Button startIcon={<Plus className="text-white" size={20} />}>
              Add New
            </Button>
          }
        >
          <div className="menu-items">
            <MenuItem startIcon="Boxes" onClick={() => onAddList("itemTotal")}>
              Item Total
            </MenuItem>
            <MenuItem
              startIcon="PackageOpen"
              onClick={() => onAddList("packingCharges")}
            >
              Packing Charges
            </MenuItem>
            <MenuItem
              startIcon="Truck"
              onClick={() => onAddList("deliveryCharges")}
            >
              Delivery Charges
            </MenuItem>
          </div>
        </Popover>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        {(isFetching || !isVisible) && <Spinner />}
        {!(isFetching || !isVisible) && (
          <>
            {isError && <div>Error: {errorMessage}</div>}
            {!isError && (
              <>
                {!taxList?.length && <div>No Taxes found</div>}
                {Boolean(taxList?.length) && (
                  <>
                    {taxList?.map((e) => (
                      <OrderTaxStructureFormCard
                        key={e.uiKey}
                        onDelete={onDelete}
                        onSave={onSave}
                        tax={e}
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

export default OrderTaxStructureScreen;

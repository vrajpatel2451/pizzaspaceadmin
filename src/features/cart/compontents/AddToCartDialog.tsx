import Dialog from "@/components/compound/Dialog";
import Spinner from "@/components/compound/spinner/Spinner";
import { useFetchProductDetails } from "@/features/inventory/hooks/uaeFetchProductDetails";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import QuantityButton from "./QuantityButton";
import Checkbox from "@/components/base/Checkbox";
import RadioGroup from "@/components/compound/RadioGroup";
import { useToggle } from "@/hooks/useToggle";
import type { OnAddToCart, PricingTransformation } from "../types/cart.types";
import type { PricingIdsAndQuantity } from "@/types/cart.types";
import type { ProductDetailsResponse } from "@/types/product.types";

type Props = {
  itemId: string;
  quantity?: number;
  selectedPricingIds?: PricingIdsAndQuantity[];
  selectedVariantId?: string;
  isOpen: boolean;
  close: () => void;
  productDetailsResponse?: ProductDetailsResponse;
  onAddToCart: OnAddToCart;
};

const AddToCartDialog: FC<Props> = (props) => {
  const {
    itemId,
    isOpen,
    close,
    quantity: pQuantity,
    selectedPricingIds: pSelectedPricingIds,
    selectedVariantId: pSelectedVariantId,
    productDetailsResponse: defProductDefaultResponse,
    onAddToCart,
  } = props;
  const { data, isFetching, refetch, setData } = useFetchProductDetails(
    itemId,
    true,
  );
  useEffect(() => {
    if (!defProductDefaultResponse) {
      refetch();
    } else {
      setData((prev) => ({
        ...prev,
        isFetching: false,
        data: defProductDefaultResponse,
        isError: false,
        isSuccess: true,
        errorMessage: "",
      }));
    }
  }, [defProductDefaultResponse, refetch, setData]);
  const {
    product,
    variantList,
    pricing,
    variantGroupList,
    addonGroupList,
    addonList,
  } = data || {};
  const { name, basePrice, category } = product || {};
  const [selectedPricingIds, setSelectedPricingIds] = useState<
    PricingIdsAndQuantity[]
  >([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(pQuantity || 1);
  }, [pQuantity]);
  useEffect(() => {
    setSelectedPricingIds(pSelectedPricingIds || []);
  }, [pSelectedPricingIds]);
  useEffect(() => {
    setSelectedVariantId(pSelectedVariantId || "");
  }, [pSelectedVariantId]);

  const amount = useMemo(() => {
    const pricingList = (pricing || [])
      .map<PricingTransformation>((pr) => {
        const isExist = selectedPricingIds?.find((e) => e.id === pr?._id);
        if (!isExist) {
          return null;
        }
        const pricing =
          (pr.type === "addon" ? isExist?.quantity || 0 : 1) * pr.price;
        return {
          amount: pricing,
          id: isExist.id,
          quantity: isExist.quantity,
        };
      })
      .filter(Boolean);
    const extraPrice = pricingList.reduce(
      (prev, current) => prev + current.amount,
      0,
    );
    let mainPrice = 0;
    const variant = variantList?.find((e) =>
      !selectedVariantId ? false : e.isPrimary && e._id === selectedVariantId,
    );
    if (variant) {
      mainPrice = variant.price;
    } else {
      mainPrice = basePrice;
    }
    return (mainPrice + extraPrice) * quantity;
  }, [
    basePrice,
    pricing,
    quantity,
    selectedPricingIds,
    selectedVariantId,
    variantList,
  ]);

  const {
    isOpen: isSubmitting,
    open: startSubmitting,
    close: stopSubmitting,
  } = useToggle();

  const onSubmit = useCallback(async () => {
    startSubmitting();
    const shouldClose = await onAddToCart(
      itemId,
      category,
      quantity,
      selectedVariantId,
      selectedPricingIds,
    );
    if (shouldClose) {
      close();
    }
    stopSubmitting();
  }, [
    close,
    itemId,
    onAddToCart,
    category,
    quantity,
    selectedPricingIds,
    selectedVariantId,
    startSubmitting,
    stopSubmitting,
  ]);

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title={isFetching ? "Cart Loading..." : name}
      actions={{
        prefix: <QuantityButton quantity={quantity} onChange={setQuantity} />,
        primary: {
          label: `Add Item - ₹${amount}`,
          onClick: onSubmit,
          loading: isFetching || isSubmitting,
          disabled: isFetching || isSubmitting,
        },
      }}
    >
      {isFetching && <Spinner />}
      {!isFetching && (
        <div className="flex max-h-[70vh] flex-col gap-4 overflow-auto">
          {variantGroupList
            ?.filter((e) => e.isPrimary)
            ?.map((group) => (
              <div className="border-pl-200 rounded-lg border" key={group._id}>
                <div className="bg-pl-50 mb-4 flex items-center rounded-t-lg p-4">
                  <h4>{group.label}</h4>
                </div>
                <RadioGroup
                  className="mb-4 px-4"
                  options={variantList
                    ?.filter((e) => e.groupId === group._id)
                    ?.map((e) => ({
                      label: e.label,
                      value: e._id,
                      helperText: `₹${e.price}`,
                    }))}
                  value={selectedVariantId}
                  onChange={(s) => {
                    setSelectedVariantId(s);
                    setSelectedPricingIds([]);
                  }}
                  size="md"
                />
              </div>
            ))}
          {variantGroupList
            ?.filter((e) => !e.isPrimary)
            ?.map((group) => (
              <div className="border-pl-200 rounded-lg border" key={group._id}>
                <div className="bg-pl-50 mb-4 flex items-center rounded-t-lg p-4">
                  <h4>{group.label}</h4>
                </div>
                <RadioGroup
                  className="mb-4 px-4"
                  options={variantList
                    ?.filter((e) => e.groupId === group._id)
                    ?.map((e) => ({
                      label: e.label,
                      value: e._id,
                      helperText: `+₹${pricing?.find((el) => el.subVariantId === e._id && el.type === "variant" && el.variantId === selectedVariantId)?.price || 0}`,
                    }))}
                  value={
                    pricing?.find((e) => {
                      if (
                        e.type !== "variant" ||
                        e.variantId !== selectedVariantId
                      ) {
                        return false;
                      }
                      const exists = selectedPricingIds?.find(
                        (el) => el.id === e._id,
                      );
                      return Boolean(exists);
                    })?.subVariantId || ""
                  }
                  onChange={(selectedId) => {
                    const pricingD = pricing.find(
                      (e) =>
                        e.subVariantId === selectedId &&
                        e.type === "variant" &&
                        e.variantId === selectedVariantId,
                    );
                    if (pricingD) {
                      setSelectedPricingIds((prev) => {
                        const isExist = prev.find((p) => p.id === pricingD._id);
                        if (!isExist) {
                          const idsToRemove = pricing
                            .filter(
                              (pr) =>
                                pr.variantId === selectedVariantId &&
                                pr.type === "variant",
                            )
                            .map((pr) => pr._id);
                          const nArray = prev.filter(
                            (p) => !idsToRemove.includes(p.id),
                          );
                          const tArray = [
                            ...nArray,
                            {
                              id: pricingD._id,
                              quantity: 1,
                            },
                          ];
                          return tArray;
                        }
                        return prev;
                      });
                    }
                  }}
                  size="md"
                />
              </div>
            ))}
          {addonGroupList
            ?.filter((e) => {
              const isExists = pricing.find(
                (el) =>
                  el.addonGroupId === e._id &&
                  el.type === "addonGroup" &&
                  el.variantId === selectedVariantId,
              );
              return isExists?.isVisible || false;
            })
            ?.map((group) => (
              <div className="border-pl-200 rounded-lg border" key={group._id}>
                <div className="bg-pl-50 mb-4 flex items-center rounded-t-lg p-4">
                  <h4>{group.label}</h4>
                </div>
                {addonList
                  ?.map((addon) => {
                    const exists = pricing?.find(
                      (e) =>
                        e.addonId === addon._id &&
                        e.type === "addon" &&
                        e.variantId === selectedVariantId,
                    );
                    const visible =
                      addon.groupId === group._id &&
                      (exists?.isVisible || false);
                    if (visible) {
                      const visibleQuantity = selectedPricingIds?.find(
                        (e) => e.id === exists._id,
                      );
                      return (
                        <div className="mb-2 flex items-center gap-4 px-4">
                          <h6 className="flex-1">{addon.label}</h6>
                          <h6>+₹{exists.price}</h6>
                          {group.allowMulti && (
                            <QuantityButton
                              min={0}
                              max={group.max}
                              quantity={visibleQuantity?.quantity || 0}
                              onChange={(q) => {
                                setSelectedPricingIds((prev) => {
                                  const isa = prev.find(
                                    (p) => p.id === exists._id,
                                  );
                                  if (isa) {
                                    return prev.map((p) =>
                                      p.id === exists._id
                                        ? { ...p, quantity: q }
                                        : p,
                                    );
                                  }
                                  return [
                                    ...prev,
                                    { id: exists._id, quantity: q },
                                  ];
                                });
                              }}
                            />
                          )}
                          {!group.allowMulti && (
                            <Checkbox
                              checked={Boolean(visibleQuantity)}
                              onChange={(c) => {
                                setSelectedPricingIds((prev) => {
                                  if (c.target.checked) {
                                    return [
                                      ...prev,
                                      { id: exists._id, quantity: 1 },
                                    ];
                                  } else {
                                    return prev.filter(
                                      (p) => p.id !== exists._id,
                                    );
                                  }
                                });
                              }}
                            />
                          )}
                        </div>
                      );
                    }
                    return null;
                  })
                  .filter(Boolean)}
              </div>
            ))}
        </div>
      )}
    </Dialog>
  );
};

export default AddToCartDialog;

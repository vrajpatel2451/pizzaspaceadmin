import type { CartResponse } from "@/types/cart.types";
import type { ProductDetailsResponse } from "@/types/product.types";

export class CartFormattingUtils {
  static getPriceFromSelection(
    productDetails: ProductDetailsResponse,
    cartItem: CartResponse,
  ): [number, number] {
    if (!productDetails?.product || !cartItem) {
      return [0, 0];
    }
    const {
      product,
      variantList,
      pricing: variantPricingList,
    } = productDetails;
    let productPrice = 0;
    const variant = cartItem.variantId
      ? variantList.find((e) => e._id === cartItem.variantId)
      : null;
    if (variant && variant?.isPrimary) {
      productPrice = variant.price;
    } else {
      productPrice = product.basePrice;
    }
    const prodDiscount = 0;
    let productPriceAfterDiscount = productPrice - prodDiscount;
    for (let i = 0; i < cartItem.pricing.length; i++) {
      const pricingCart = cartItem.pricing[i];
      const pricing = variantPricingList.find((e) => e._id === pricingCart.id);
      if (pricing) {
        const quantity = pricingCart.quantity < 1 ? 1 : pricingCart.quantity;
        const otherPrice = pricing.price * quantity;
        if (otherPrice > 0) {
          productPrice += otherPrice;
          productPriceAfterDiscount += otherPrice;
        }
      }
    }
    return [productPriceAfterDiscount, productPrice];
  }
}

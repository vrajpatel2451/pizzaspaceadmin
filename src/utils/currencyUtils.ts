export class CurrencyUtils {
  static formatCurrency = (amount: number): string => {
    const formattedAmount = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(amount);
    return formattedAmount;
  };
}

export function formatAssetAmount(value: string | number, asset: string) {
  const fractionDigits = asset.toUpperCase() === "BTC" ? 5 : 2;
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? new Intl.NumberFormat(undefined, {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
      }).format(numericValue)
    : "—";
}

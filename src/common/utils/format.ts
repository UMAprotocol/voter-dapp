// this actually will round up in some cases
export const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
}).format;

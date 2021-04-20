export default function calculateUMATotalValue(price: number, balance: string) {
  return (
    (price * Number(balance))
      .toFixed(2)
      // Add commas
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .toLocaleString()
  );
}

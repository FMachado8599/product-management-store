export const formatUYU = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-UY", {
        style: "currency",
        currency: "UYU",
        minimumFractionDigits: 2,
      }).format(n)
    : "—";

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-UY");
};

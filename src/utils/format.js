const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? usd.format(n) : "";
}

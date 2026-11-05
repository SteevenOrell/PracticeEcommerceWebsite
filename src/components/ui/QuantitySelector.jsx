export function QuantitySelector({ value, onChange, min = 1, max = 10, label = "Quantity", className = "" }) {
    return (
        <div className={`qty ${className}`} role="group" aria-label={label}>
            <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => value > min && onChange(value - 1)}>−</button>
            <output aria-live="polite">{value}</output>
            <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => value < max && onChange(value + 1)}>+</button>
        </div>
    );
}

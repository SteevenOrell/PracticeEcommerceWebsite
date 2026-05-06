export function QuantitySelector({ value, onChange, min = 1, className }) {
    return (
        <div className={className}>
            <button type="button" onClick={() => { if (value > min) onChange(value - 1); }}>−</button>
            <span>{value}</span>
            <button type="button" onClick={() => onChange(value + 1)}>+</button>
        </div>
    );
}

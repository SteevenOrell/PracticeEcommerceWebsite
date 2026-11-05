import { Link } from "react-router-dom";
import { getProductImage } from "../../utils/getProductImage";
import { formatPrice } from "../../utils/format";

export function ProductCard({ product, priority = false, badge }) {
    const folder = product["image-folder-name"];
    const primary = getProductImage(folder, 1);
    const alt = getProductImage(folder, 2);
    const name = product["article-name"];

    return (
        <Link to={`/details/${encodeURIComponent(product.id)}`} className="product-card group" aria-label={`${name}, ${formatPrice(product.price)}`}>
            <div className="product-card-media">
                {badge && <span className="badge">{badge}</span>}
                {primary && (
                    <img
                        src={primary}
                        alt={name}
                        className={`primary${alt ? " has-alt" : ""}`}
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                    />
                )}
                {alt && <img src={alt} alt="" aria-hidden="true" className="alt" loading="lazy" decoding="async" />}
            </div>
            <div className="product-card-body">
                <p className="product-card-name">{name}</p>
                <p className="product-card-meta">{[product.purpose, product.color].filter(Boolean).join(" · ")}</p>
                <p className="product-card-price">{formatPrice(product.price)}</p>
            </div>
        </Link>
    );
}

export function ProductCardSkeleton() {
    return (
        <div aria-hidden="true">
            <div className="skeleton" style={{ aspectRatio: "4 / 5" }} />
            <div className="skeleton mt-3 h-4 w-3/4" />
            <div className="skeleton mt-2 h-4 w-1/3" />
        </div>
    );
}

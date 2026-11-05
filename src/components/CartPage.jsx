import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContextComponent";
import { QuantitySelector } from "./ui/QuantitySelector";
import { getImageFor } from "../utils/getProductImage";
import { formatPrice } from "../utils/format";

function CartPage() {
    const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <main id="main" className="container-x pb-24 pt-14 md:pt-20">
            <p className="eyebrow">Your bag</p>
            <h1 className="display-lg mt-3">Bag{cartCount > 0 && <span className="muted"> ({cartCount})</span>}</h1>

            {cartItems.length === 0 ? (
                <div className="py-24">
                    <p className="lede">Your bag is empty.</p>
                    <p className="muted mt-3">Items you add will show up here.</p>
                    <Link to="/products" className="btn btn-primary mt-8">Continue shopping</Link>
                </div>
            ) : (
                <div className="mt-12 grid gap-12 lg:grid-cols-12">
                    <ul className="lg:col-span-8">
                        {cartItems.map(item => (
                            <li className="line-item lg" key={item.id}>
                                <Link to={`/details/${encodeURIComponent(item.id)}`} className="line-item-img" aria-label={`View ${item["article-name"]}`}>
                                    <img src={getImageFor(item, 1, 300)} alt="" />
                                </Link>
                                <div className="min-w-0">
                                    <p className="text-lg font-semibold">{item["article-name"]}</p>
                                    <p className="muted mt-1 text-sm">{[item.purpose, item.color, item.size && `US ${item.size}`].filter(Boolean).join(" · ")}</p>
                                    <p className="muted mt-1 text-sm">{formatPrice(item.price)} each</p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <QuantitySelector value={item.quantity} onChange={qty => updateQuantity(item.id, qty)} label={`Quantity for ${item["article-name"]}`} />
                                        <button type="button" className="link-underline text-sm muted hover:text-white" onClick={() => removeFromCart(item.id)}>
                                            Remove<span className="sr-only"> {item["article-name"]}</span>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold">{formatPrice(Number.parseFloat(item.price) * item.quantity)}</p>
                            </li>
                        ))}
                    </ul>

                    <aside className="lg:col-span-4" aria-labelledby="summary-title">
                        <div className="summary-card lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
                            <h2 id="summary-title" className="display text-3xl">Summary</h2>
                            <div className="mt-6">
                                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                                <div className="summary-row"><span>Shipping</span><span className="text-[var(--accent)]">Free</span></div>
                                <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
                            </div>
                            <button type="button" className="btn btn-primary btn-block mt-6" onClick={() => navigate("/checkout")}>Checkout</button>
                            <Link to="/products" className="link-underline mt-4 block text-center text-sm">Continue shopping</Link>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
}

export default CartPage;

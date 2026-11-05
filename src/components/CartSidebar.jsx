import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContextComponent";
import { QuantitySelector } from "./ui/QuantitySelector";
import { getProductImage } from "../utils/getProductImage";
import { formatPrice } from "../utils/format";

function CartSidebar() {
    const { cartItems, cartTotal, cartCount, isSidebarOpen, closeSidebar, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const lastFocus = useRef(null);

    useEffect(() => {
        if (!isSidebarOpen) return undefined;
        lastFocus.current = document.activeElement;
        closeRef.current?.focus();
        document.body.style.overflow = "hidden";
        function onKey(e) {
            if (e.key === "Escape") closeSidebar();
            if (e.key === "Tab" && panelRef.current) {
                const f = panelRef.current.querySelectorAll('button, a[href], input, select, [tabindex]:not([tabindex="-1"])');
                if (!f.length) return;
                const first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        }
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
            lastFocus.current?.focus?.();
        };
    }, [isSidebarOpen, closeSidebar]);

    function go(path) { closeSidebar(); navigate(path); }

    return (
        <>
            <div id="CartSidebarBackdrop" className={isSidebarOpen ? "open" : ""} onClick={closeSidebar} aria-hidden="true" />
            <aside
                id="CartSidebar"
                ref={panelRef}
                className={isSidebarOpen ? "open" : ""}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
                aria-hidden={!isSidebarOpen}
            >
                <header className="flex items-center justify-between border-b hairline px-6 py-5">
                    <h2 id="cart-title" className="display text-3xl">Bag {cartCount > 0 && <span className="muted text-xl">({cartCount})</span>}</h2>
                    <button ref={closeRef} type="button" className="icon-btn" onClick={closeSidebar} aria-label="Close bag">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6">
                    {cartItems.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="display text-3xl">Your bag is empty</p>
                            <p className="muted mt-3 text-sm">Find something you love in the latest drops.</p>
                            <button type="button" className="btn btn-primary mt-8" onClick={() => go("/products")}>Shop now</button>
                        </div>
                    ) : (
                        <ul>
                            {cartItems.map(item => (
                                <li className="line-item" key={item.id}>
                                    <div className="line-item-img">
                                        <img src={getProductImage(item["image-folder-name"])} alt="" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold leading-snug">{item["article-name"]}</p>
                                        <p className="muted mt-1 text-sm">{item.color} · US {item.size}</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <QuantitySelector value={item.quantity} onChange={qty => updateQuantity(item.id, qty)} label={`Quantity for ${item["article-name"]}`} />
                                            <button type="button" className="link-underline text-sm muted hover:text-white" onClick={() => removeFromCart(item.id)}>
                                                Remove<span className="sr-only"> {item["article-name"]}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="font-semibold">{formatPrice(Number.parseFloat(item.price) * item.quantity)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <footer className="border-t hairline px-6 py-6">
                        <div className="summary-row !pt-0"><span>Subtotal</span><span className="font-semibold">{formatPrice(cartTotal)}</span></div>
                        <p className="muted mb-5 text-xs">Shipping is free. Taxes calculated at checkout.</p>
                        <div className="grid gap-3">
                            <button type="button" className="btn btn-primary btn-block" onClick={() => go("/checkout")}>Checkout</button>
                            <button type="button" className="btn btn-ghost btn-block" onClick={() => go("/cart")}>View bag</button>
                        </div>
                    </footer>
                )}
            </aside>
        </>
    );
}

export default CartSidebar;

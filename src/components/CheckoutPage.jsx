import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContextComponent";
import { getProductImage } from "../utils/getProductImage";
import { formatPrice } from "../utils/format";

const EMPTY_FORM = {
    email: "", firstName: "", lastName: "",
    address: "", city: "", zip: "", country: "",
    cardNumber: "", expiry: "", cvv: "",
};

function Field({ id, label, className = "", ...props }) {
    return (
        <div className={`field ${className}`}>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} {...props} />
        </div>
    );
}

function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const [paid, setPaid] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const successRef = useRef(null);

    useEffect(() => { if (paid) successRef.current?.focus(); }, [paid]);

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // DEMO ONLY: no payment is processed and nothing is sent anywhere. Card fields stay in
    // memory and are wiped on submit. A real store must use a PCI-compliant hosted payment
    // element (e.g. Stripe Checkout/Elements in test mode) instead of raw card inputs.
    function handlePay(e) {
        e.preventDefault();
        if (cartItems.length === 0) return;
        setForm(EMPTY_FORM);
        clearCart();
        setPaid(true);
    }

    if (paid) {
        return (
            <main id="main" className="container-x py-32 text-center">
                <div ref={successRef} tabIndex={-1} className="mx-auto max-w-xl outline-none">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-2xl text-black" aria-hidden="true">✓</div>
                    <h1 className="display-lg mt-8">Order placed</h1>
                    <p className="muted mt-4">Thanks! This is a demo store, so no payment was taken and nothing will ship.</p>
                    <Link to="/products" className="btn btn-primary mt-10">Keep shopping</Link>
                </div>
            </main>
        );
    }

    return (
        <main id="main" className="container-x pb-24 pt-14 md:pt-20">
            <p className="eyebrow">Secure checkout · demo</p>
            <h1 className="display-lg mt-3">Checkout</h1>

            {cartItems.length === 0 ? (
                <div className="py-20">
                    <p className="lede">Your bag is empty.</p>
                    <Link to="/products" className="btn btn-primary mt-8">Shop now</Link>
                </div>
            ) : (
                <div className="mt-12 grid gap-12 lg:grid-cols-12">
                    <form id="CheckoutForm" className="space-y-12 lg:col-span-7" onSubmit={handlePay}>
                        <section aria-labelledby="co-contact" className="space-y-4">
                            <h2 id="co-contact" className="text-xl font-semibold">1. Contact</h2>
                            <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                        </section>

                        <section aria-labelledby="co-ship" className="space-y-4">
                            <h2 id="co-ship" className="text-xl font-semibold">2. Delivery</h2>
                            <div className="field-row">
                                <Field id="firstName" label="First name" autoComplete="given-name" required value={form.firstName} onChange={handleChange} />
                                <Field id="lastName" label="Last name" autoComplete="family-name" required value={form.lastName} onChange={handleChange} />
                            </div>
                            <Field id="address" label="Address" autoComplete="street-address" required value={form.address} onChange={handleChange} />
                            <div className="field-row">
                                <Field id="city" label="City" autoComplete="address-level2" required value={form.city} onChange={handleChange} />
                                <Field id="zip" label="ZIP / Postal code" autoComplete="postal-code" required value={form.zip} onChange={handleChange} />
                            </div>
                            <Field id="country" label="Country" autoComplete="country-name" required value={form.country} onChange={handleChange} />
                        </section>

                        <section aria-labelledby="co-pay" className="space-y-4">
                            <h2 id="co-pay" className="text-xl font-semibold">3. Payment</h2>
                            <p className="notice" role="note">
                                <span aria-hidden="true">ⓘ</span>
                                <span>Demo checkout: no payment is processed. <strong>Do not enter real card details</strong> — use the test number 4242 4242 4242 4242.</span>
                            </p>
                            <Field id="cardNumber" label="Card number" required value={form.cardNumber} onChange={handleChange}
                                placeholder="4242 4242 4242 4242" maxLength={19} autoComplete="off" inputMode="numeric" pattern="[0-9 ]{12,19}"
                                title="12–19 digits" />
                            <div className="field-row">
                                <Field id="expiry" label="Expiry (MM/YY)" required value={form.expiry} onChange={handleChange}
                                    placeholder="12/30" maxLength={5} autoComplete="off" pattern="(0[1-9]|1[0-2])/[0-9]{2}" title="MM/YY" />
                                <Field id="cvv" label="Security code" required value={form.cvv} onChange={handleChange}
                                    placeholder="123" maxLength={4} autoComplete="off" inputMode="numeric" pattern="[0-9]{3,4}" title="3 or 4 digits" />
                            </div>
                        </section>

                        <button type="submit" id="PayNowBtn" className="btn btn-primary btn-block !min-h-[56px] text-base">
                            Place demo order · {formatPrice(cartTotal)}
                        </button>
                    </form>

                    <aside className="lg:col-span-5" aria-labelledby="co-summary">
                        <div className="summary-card lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
                            <h2 id="co-summary" className="display text-3xl">In your bag</h2>
                            <ul className="mt-4">
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex items-center gap-4 border-b hairline py-4">
                                        <div className="line-item-img h-16 w-16 flex-shrink-0">
                                            <img src={getProductImage(item["image-folder-name"])} alt="" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">{item["article-name"]}</p>
                                            <p className="muted text-xs">Qty {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">{formatPrice(Number.parseFloat(item.price) * item.quantity)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                                <div className="summary-row"><span>Shipping</span><span className="text-[var(--accent)]">Free</span></div>
                                <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
}

export default CheckoutPage;

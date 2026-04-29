import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContextComponent";

function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [paid, setPaid] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        address: "", city: "", zip: "", country: "",
        cardNumber: "", expiry: "", cvv: "",
    });

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handlePay(e) {
        e.preventDefault();
        clearCart();
        setPaid(true);
    }

    if (paid) {
        return (
            <div id="CheckoutSuccess">
                <div id="CheckoutSuccessIcon">✓</div>
                <h2>Payment Accepted!</h2>
                <p>Thank you for your order. Your items are on their way.</p>
                <button onClick={() => navigate("/")}>Back to Home</button>
            </div>
        );
    }

    return (
        <div id="CheckoutWrapper">
            <h1 id="CheckoutTitle">Checkout</h1>
            <div id="CheckoutContent">
                <form id="CheckoutForm" onSubmit={handlePay}>
                    <section className="CheckoutSection">
                        <h3>Contact</h3>
                        <input
                            name="email" value={form.email} onChange={handleChange}
                            placeholder="Email address" type="email" required
                        />
                    </section>

                    <section className="CheckoutSection">
                        <h3>Shipping</h3>
                        <div className="CheckoutRow">
                            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
                            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
                        </div>
                        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
                        <div className="CheckoutRow">
                            <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                            <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP code" required />
                        </div>
                        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required />
                    </section>

                    <section className="CheckoutSection">
                        <h3>Payment</h3>
                        <input
                            name="cardNumber" value={form.cardNumber} onChange={handleChange}
                            placeholder="Card number (1234 5678 9012 3456)" maxLength={19} required
                        />
                        <div className="CheckoutRow">
                            <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM / YY" maxLength={7} required />
                            <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="CVV" maxLength={4} required />
                        </div>
                    </section>

                    <button type="submit" id="PayNowBtn">
                        Pay ${cartTotal.toFixed(2)}
                    </button>
                </form>

                <div id="CheckoutSummary">
                    <h3>Order Summary</h3>
                    <div id="CheckoutSummaryItems">
                        {cartItems.map(item => (
                            <div className="CheckoutSummaryItem" key={item.id}>
                                <span className="CheckoutSummaryItemName">
                                    {item["article-name"]} × {item.quantity}
                                </span>
                                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="CheckoutSummaryRow">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="CheckoutSummaryRow">
                        <span>Shipping</span>
                        <span className="CheckoutFree">Free</span>
                    </div>
                    <div className="CheckoutSummaryRow CheckoutSummaryTotal">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;

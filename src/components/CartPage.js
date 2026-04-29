import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContextComponent";

function getProductImage(folderName) {
    try {
        return require(`../assets/products-images/${folderName}/image1.png`);
    } catch {
        return null;
    }
}

function CartPage() {
    const { cartItems, cartTotal, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <div id="CartPageWrapper">
            <h1 id="CartPageTitle">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div id="CartPageEmpty">
                    <p>Your cart is empty.</p>
                    <Link to="/products" id="CartPageShopLink">Continue Shopping →</Link>
                </div>
            ) : (
                <div id="CartPageContent">
                    <div id="CartPageItems">
                        {cartItems.map(item => (
                            <div className="CartPageItem" key={item.id}>
                                <div className="CartPageItemImg">
                                    <img
                                        src={getProductImage(item["image-folder-name"])}
                                        alt={item["article-name"]}
                                    />
                                </div>
                                <div className="CartPageItemDetails">
                                    <p className="CartPageItemName">{item["article-name"]}</p>
                                    <p className="CartPageItemMeta">{item.color} · Size {item.size}</p>
                                    <p className="CartPageItemUnitPrice">${parseFloat(item.price).toFixed(2)} each</p>
                                    <div className="CartPageItemActions">
                                        <div className="CartQtyControls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="CartPageRemoveBtn" onClick={() => removeFromCart(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <p className="CartPageItemTotal">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div id="CartPageSummary">
                        <h2>Order Summary</h2>
                        <div className="CartSummaryRow">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="CartSummaryRow">
                            <span>Shipping</span>
                            <span className="CartSummaryFree">Free</span>
                        </div>
                        <div className="CartSummaryRow CartSummaryTotal">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button id="CartCheckoutBtn" onClick={() => navigate("/checkout")}>
                            Proceed to Checkout
                        </button>
                        <Link to="/products" id="CartContinueShopping">Continue Shopping</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;

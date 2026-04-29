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

function CartSidebar() {
    const { cartItems, cartTotal, isSidebarOpen, closeSidebar, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    function handleGoTo(path) {
        closeSidebar();
        navigate(path);
    }

    return (
        <>
            <div
                id="CartSidebarBackdrop"
                className={isSidebarOpen ? "open" : ""}
                onClick={closeSidebar}
            />
            <div id="CartSidebar" className={isSidebarOpen ? "open" : ""}>
                <div id="CartSidebarHeader">
                    <h2>Your Cart {cartItems.length > 0 && <span id="CartSidebarCount">({cartItems.length})</span>}</h2>
                    <button id="CartSidebarClose" onClick={closeSidebar}>✕</button>
                </div>

                <div id="CartSidebarItems">
                    {cartItems.length === 0 ? (
                        <p id="CartSidebarEmpty">Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div className="CartSidebarItem" key={item.id}>
                                <div className="CartSidebarItemImg">
                                    <img
                                        src={getProductImage(item["image-folder-name"])}
                                        alt={item["article-name"]}
                                    />
                                </div>
                                <div className="CartSidebarItemInfo">
                                    <p className="CartSidebarItemName">{item["article-name"]}</p>
                                    <p className="CartSidebarItemPrice">${parseFloat(item.price).toFixed(2)}</p>
                                    <div className="CartSidebarItemQty">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="CartSidebarRemoveBtn" onClick={() => removeFromCart(item.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div id="CartSidebarFooter">
                        <div id="CartSidebarSubtotal">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="CartSidebarBtn primary" onClick={() => handleGoTo("/checkout")}>
                            Checkout
                        </button>
                        <button className="CartSidebarBtn secondary" onClick={() => handleGoTo("/cart")}>
                            View Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartSidebar;

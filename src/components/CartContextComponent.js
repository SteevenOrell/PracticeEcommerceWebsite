import { createContext, useState, useContext } from "react";

export const CartContext = createContext({
    cartItems: [], cartCount: 0, cartTotal: 0,
    isSidebarOpen: false,
    addToCart: () => {}, removeFromCart: () => {},
    updateQuantity: () => {}, clearCart: () => {}, openSidebar: () => {}, closeSidebar: () => {},
});

export function CartContextComponent({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function addToCart(product, quantity = 1) {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    }

    function removeFromCart(id) {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }

    function updateQuantity(id, qty) {
        if (qty < 1) return;
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: qty } : item)
        );
    }

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    function clearCart() {
        setCartItems([]);
    }

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal, isSidebarOpen,
            addToCart, removeFromCart, updateQuantity, clearCart,
            openSidebar: () => setIsSidebarOpen(true),
            closeSidebar: () => setIsSidebarOpen(false),
        }}>
            {children}
        </CartContext.Provider>
    );
}

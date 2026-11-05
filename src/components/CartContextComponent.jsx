import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const CartContext = createContext({
    cartItems: [], cartCount: 0, cartTotal: 0,
    isSidebarOpen: false,
    addToCart: () => {}, removeFromCart: () => {},
    updateQuantity: () => {}, clearCart: () => {}, openSidebar: () => {}, closeSidebar: () => {},
});

const STORAGE_KEY = "cv-cart-v1";
const MAX_QTY = 10;
// Only non-sensitive catalogue fields are persisted (no user data).
const CART_FIELDS = ["id", "article-name", "price", "color", "size", "purpose", "image-folder-name", "images", "category"];

function pick(product) {
    const out = {};
    for (const k of CART_FIELDS) if (product[k] !== undefined) out[k] = product[k];
    return out;
}

function readStoredCart() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter(i => i && (typeof i.id === "string" || typeof i.id === "number") && Number.isFinite(Number.parseFloat(i.price)))
            .map(i => ({ ...pick(i), quantity: Math.min(Math.max(1, Number.parseInt(i.quantity, 10) || 1), MAX_QTY) }));
    } catch {
        return [];
    }
}

export function CartContextComponent({ children }) {
    const [cartItems, setCartItems] = useState(readStoredCart);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    useEffect(() => {
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems)); } catch { /* storage unavailable */ }
    }, [cartItems]);

    function addToCart(product, quantity = 1, { open = true } = {}) {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QTY) } : item
                );
            }
            return [...prev, { ...pick(product), quantity: Math.min(quantity, MAX_QTY) }];
        });
        if (open) setIsSidebarOpen(true);
    }

    function removeFromCart(id) {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }

    function updateQuantity(id, qty) {
        if (qty < 1 || qty > MAX_QTY) return;
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
    }

    const { cartCount, cartTotal } = useMemo(() => ({
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: cartItems.reduce((sum, item) => sum + (Number.parseFloat(item.price) * item.quantity), 0),
    }), [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal, isSidebarOpen,
            addToCart, removeFromCart, updateQuantity,
            clearCart: () => setCartItems([]),
            openSidebar, closeSidebar,
        }}>
            {children}
        </CartContext.Provider>
    );
}

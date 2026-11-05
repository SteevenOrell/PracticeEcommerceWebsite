import { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartContext, CartContextComponent } from "./CartContextComponent";

const PRODUCT = { id: "1", "article-name": "Test Runner", price: "100", color: "Black", size: 9, description: "long text", "image-folder-name": "DunkLowBlackWhite" };

function Probe() {
    const { cartCount, cartTotal, addToCart, isSidebarOpen } = useContext(CartContext);
    return (
        <div>
            <span data-testid="count">{cartCount}</span>
            <span data-testid="total">{cartTotal}</span>
            <span data-testid="open">{String(isSidebarOpen)}</span>
            <button onClick={() => addToCart(PRODUCT, 6)}>add</button>
        </div>
    );
}

describe("CartContextComponent", () => {
    beforeEach(() => window.localStorage.clear());

    it("adds items, caps quantity, opens the bag and persists only catalogue fields", () => {
        render(<CartContextComponent><Probe /></CartContextComponent>);
        fireEvent.click(screen.getByText("add"));
        fireEvent.click(screen.getByText("add"));
        expect(screen.getByTestId("count")).toHaveTextContent("10");
        expect(screen.getByTestId("total")).toHaveTextContent("1000");
        expect(screen.getByTestId("open")).toHaveTextContent("true");
        const stored = JSON.parse(window.localStorage.getItem("cv-cart-v1"));
        expect(stored[0].description).toBeUndefined();
        expect(stored[0].quantity).toBe(10);
    });

    it("ignores corrupted storage", () => {
        window.localStorage.setItem("cv-cart-v1", "{not json");
        render(<CartContextComponent><Probe /></CartContextComponent>);
        expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
});

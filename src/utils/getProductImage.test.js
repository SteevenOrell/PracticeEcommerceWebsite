import { getProductImage, getProductImages } from "./getProductImage";

describe("getProductImage", () => {
    it("resolves a known product image", () => {
        expect(getProductImage("DunkLowBlackWhite", 1)).toBeTruthy();
    });

    it("returns null for unknown or unsafe folder names", () => {
        expect(getProductImage("DoesNotExist")).toBeNull();
        expect(getProductImage("../../secrets")).toBeNull();
        expect(getProductImage(undefined)).toBeNull();
    });

    it("lists all images for a product", () => {
        expect(getProductImages("DunkLowBlackWhite").length).toBe(5);
    });
});

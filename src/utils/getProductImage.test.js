import { getProductImage, getProductImages, getImagesFor, getImageFor } from "./getProductImage";

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

describe("getImagesFor / getImageFor", () => {
    it("uses the bundled folder when a product has no remote images", () => {
        expect(getImagesFor({ "image-folder-name": "DunkLowBlackWhite" }).length).toBe(5);
    });

    it("uses https remote images and sizes Unsplash URLs", () => {
        const p = { images: ["https://images.unsplash.com/photo-123", "https://cdn.example.com/a.jpg"] };
        const [a, b] = getImagesFor(p, { width: 600 });
        expect(a).toBe("https://images.unsplash.com/photo-123?w=600&q=80&auto=format&fit=crop");
        expect(b).toBe("https://cdn.example.com/a.jpg");
        expect(getImageFor(p, 2)).toBe("https://cdn.example.com/a.jpg");
        expect(getImageFor(p, 3)).toBeNull();
    });

    it("drops non-https and malformed remote images", () => {
        expect(getImagesFor({ images: ["http://x.test/a.png", "javascript:alert(1)", "nope"] })).toEqual([]);
    });
});

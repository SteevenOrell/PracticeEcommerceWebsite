// Vite resolves this glob at build time: every product image becomes a hashed URL.
// Only URLs are bundled here; images are fetched lazily by the browser when rendered.
const images = import.meta.glob("../assets/products-images/*/image*.png", {
    eager: true,
    query: "?url",
    import: "default",
});

const FOLDER_RE = /^[A-Za-z0-9_-]+$/;

export function getProductImage(folderName, index = 1) {
    if (typeof folderName !== "string" || !FOLDER_RE.test(folderName)) return null;
    return images[`../assets/products-images/${folderName}/image${index}.png`] || null;
}

/** All available images for a product folder, in order. */
export function getProductImages(folderName, max = 8) {
    const out = [];
    for (let i = 1; i <= max; i++) {
        const src = getProductImage(folderName, i);
        if (src) out.push(src);
    }
    return out;
}

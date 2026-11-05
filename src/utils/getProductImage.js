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

// Remote images (e.g. Unsplash photos for apparel) are stored as base https URLs on the
// product's `images` field. Only https is accepted; Unsplash URLs get a sized, compressed variant.
function sizedRemote(url, width) {
    try {
        const u = new URL(url);
        if (u.protocol !== "https:") return null;
        if (u.hostname === "images.unsplash.com") {
            u.search = "";
            u.searchParams.set("w", String(width));
            u.searchParams.set("q", "80");
            u.searchParams.set("auto", "format");
            u.searchParams.set("fit", "crop");
        }
        return u.href;
    } catch {
        return null;
    }
}

/** Every image for a product: remote `images` first, else the bundled image folder. */
export function getImagesFor(product, { width = 1200, max = 8 } = {}) {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) {
        return product.images.map(src => sizedRemote(src, width)).filter(Boolean).slice(0, max);
    }
    return getProductImages(product["image-folder-name"], max);
}

/** The nth (1-based) image for a product, or null. */
export function getImageFor(product, index = 1, width = 800) {
    return getImagesFor(product, { width, max: index })[index - 1] ?? null;
}

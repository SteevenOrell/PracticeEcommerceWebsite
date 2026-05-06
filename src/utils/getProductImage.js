export function getProductImage(folderName, index = 1) {
    try {
        return require(`../assets/products-images/${folderName}/image${index}.png`);
    } catch {
        return null;
    }
}

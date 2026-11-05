// Copy the demo catalog and demo users into Firestore.
//
//   npm run firebase:seed                 # products (from src/data/products.json) + users (from MockAPI)
//   npm run firebase:seed -- --products   # products only
//   npm run firebase:seed -- --dry-run    # show what would be written
//
// Users are fetched live from the old MockAPI project so no user records are committed to
// the repo. Only whitelisted fields are copied, and `password` is always dropped.
// Re-running is safe: documents are written with the same ids (overwritten, not duplicated).
import { readFile } from "node:fs/promises";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const productsOnly = args.has("--products");
const MOCKAPI_URL = process.env.MOCKAPI_URL || "https://6648f7ef4032b1331becf0f2.mockapi.io";

const PRODUCT_FIELDS = ["article-name", "category", "color", "created-at", "description", "gender",
    "id", "image-folder-name", "images", "image-credits", "price", "purpose", "quantity", "size"];
const USER_FIELDS = ["name", "email", "avatar", "createdAt", "user-role"];

const pick = (obj, keys) => Object.fromEntries(keys.filter(k => obj[k] !== undefined && obj[k] !== null).map(k => [k, obj[k]]));

function cleanUser(u) {
    const out = pick(u, USER_FIELDS);
    if (out.avatar && !/^https:\/\//.test(out.avatar)) delete out.avatar;
    if (!["user", "admin"].includes(out["user-role"])) out["user-role"] = "user";
    if (out.createdAt) out.createdAt = String(out.createdAt);
    return out;
}

async function loadProducts() {
    const raw = await readFile(new URL("../../src/data/products.json", import.meta.url), "utf8");
    return JSON.parse(raw).map(p => pick(p, PRODUCT_FIELDS));
}

async function loadUsers() {
    const res = await fetch(`${MOCKAPI_URL}/users`);
    if (!res.ok) throw new Error(`MockAPI /users returned HTTP ${res.status}`);
    return (await res.json()).map(u => ({ id: String(u.id), data: cleanUser(u) }));
}

async function main() {
    const products = await loadProducts();
    const users = productsOnly ? [] : await loadUsers();

    if (dryRun) {
        console.log(`[dry run] would write ${products.length} products and ${users.length} users`);
        console.log("product fields:", [...new Set(products.flatMap(Object.keys))].join(", "));
        console.log("user fields:   ", [...new Set(users.flatMap(u => Object.keys(u.data)))].join(", "));
        return;
    }

    const { db, target } = await import("./admin-app.mjs");
    const batch = db.batch();
    for (const p of products) batch.set(db.collection("products").doc(String(p.id)), p);
    for (const u of users) batch.set(db.collection("users").doc(u.id), u.data);
    await batch.commit();
    console.log(`Wrote ${products.length} products and ${users.length} users to ${target}.`);
}

// Avoid process.exit(): on Windows it can abort while fetch/gRPC handles are closing.
main().catch(err => { console.error(err.message || err); process.exitCode = 1; });
